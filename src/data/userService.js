// Servicio de usuarios con persistencia en localStorage
// Compatibilidad: migra usuarios creados por registro.js {nombre, email, password}

const STORAGE_KEY = "usuarios";

function uuid() {
  return (crypto?.randomUUID?.() || (Date.now().toString(36) + Math.random().toString(36).slice(2, 8))).toUpperCase();
}

function safeParse(json) {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}

function normalize(u) {
  const nowIso = new Date().toISOString();
  return {
    id: u.id || uuid(),
    nombre: u.nombre || "Sin nombre",
    email: u.email || "",
    password: u.password || "",
    rol: u.rol || "cliente", // cliente | admin
    estado: u.estado || "activo", // activo | inactivo
    telefono: u.telefono || "",
    fechaRegistro: u.fechaRegistro || nowIso,
  };
}

function seedIfEmpty() {
  const parsed = safeParse(localStorage.getItem(STORAGE_KEY));
  if (parsed && parsed.length) return parsed.map(normalize);

  // Intentar migrar usuarios existentes del mismo storage
  const migrables = safeParse(localStorage.getItem("usuarios"));
  let seeded = Array.isArray(migrables) && migrables.length ? migrables.map(normalize) : null;

  if (!seeded) {
    // Semilla por defecto: un admin y un cliente
    seeded = [
      normalize({ nombre: "Admin", email: "admin@pasteleria.local", password: "admin", rol: "admin" }),
      normalize({ nombre: "Cliente Demo", email: "cliente@demo.local", password: "demo", rol: "cliente" }),
    ];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

export const userService = {
  getAll() {
    return seedIfEmpty();
  },
  saveAll(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list || []));
    return this.getAll();
  },
  getById(id) {
    return this.getAll().find((u) => u.id === id) || null;
  },
  create(user) {
    const list = this.getAll();
    if (!user?.email) throw new Error("El usuario debe tener 'email'");
    if (list.some((u) => u.email.toLowerCase() === String(user.email).toLowerCase())) {
      throw new Error("Ya existe un usuario con ese email");
    }
    const nuevo = normalize(user);
    list.push(nuevo);
    this.saveAll(list);
    return nuevo;
  },
  update(id, cambios) {
    const list = this.getAll();
    const idx = list.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("Usuario no encontrado");
    const prev = list[idx];
    // Evitar duplicar email
    if (cambios?.email && cambios.email.toLowerCase() !== prev.email.toLowerCase()) {
      if (list.some((u) => u.email.toLowerCase() === String(cambios.email).toLowerCase())) {
        throw new Error("Ya existe un usuario con ese email");
      }
    }
    const merged = normalize({ ...prev, ...cambios, id: prev.id, fechaRegistro: prev.fechaRegistro });
    list[idx] = merged;
    this.saveAll(list);
    return merged;
  },
  remove(id) {
    const list = this.getAll();
    const filtered = list.filter((u) => u.id !== id);
    const changed = filtered.length !== list.length;
    if (changed) this.saveAll(filtered);
    return changed;
  },
  query({ search = "", estado = "", rol = "" } = {}) {
    const q = String(search).toLowerCase().trim();
    return this.getAll().filter((u) => {
      const okSearch = !q || u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const okEstado = !estado || u.estado === estado;
      const okRol = !rol || u.rol === rol;
      return okSearch && okEstado && okRol;
    });
  },
  toggleEstado(id) {
    const u = this.getById(id);
    if (!u) throw new Error("Usuario no encontrado");
    const nuevoEstado = u.estado === "activo" ? "inactivo" : "activo";
    return this.update(id, { estado: nuevoEstado });
  },
};

export default userService;
