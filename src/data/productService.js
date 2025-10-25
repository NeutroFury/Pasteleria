// Servicio de productos con persistencia en localStorage
// Fuente inicial: src/data/catalogo.js

import catalogo from "./catalogo";

const STORAGE_KEY = "productos";

function safeParse(json) {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}

function seedIfEmpty() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse(raw);
  if (parsed && parsed.length) return parsed;

  // Semilla: añadimos campos faltantes (stock/estado) con valores por defecto
  const seeded = (catalogo || []).map((p) => ({
    codigo: p.codigo,
    categoria: p.categoria,
    nombre: p.nombre,
    precio: Number(p.precio) || 0,
    descripcion: p.descripcion || "",
    img: p.img || "",
    descuento: p.descuento ?? 0,
    stock: 10,
    estado: "disponible",
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

export const productService = {
  getAll() {
    return seedIfEmpty();
  },

  saveAll(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list || []));
    return this.getAll();
  },

  getById(codigo) {
    const items = this.getAll();
    return items.find((x) => x.codigo === codigo) || null;
  },

  create(producto) {
    const items = this.getAll();
    if (!producto || !producto.codigo) {
      throw new Error("El producto debe tener un 'codigo' único");
    }
    if (items.some((x) => x.codigo === producto.codigo)) {
      throw new Error("Ya existe un producto con ese código");
    }
    const nuevo = {
      codigo: String(producto.codigo).trim(),
      categoria: producto.categoria || "Otros",
      nombre: producto.nombre || "Sin nombre",
      precio: Number(producto.precio) || 0,
      descripcion: producto.descripcion || "",
      img: producto.img || "",
      descuento: Number(producto.descuento) || 0,
      stock: Number(producto.stock) || 0,
      estado: producto.estado || (Number(producto.stock) > 0 ? "disponible" : "agotado"),
    };
    items.push(nuevo);
    this.saveAll(items);
    return nuevo;
  },

  update(codigo, cambios) {
    const items = this.getAll();
    const idx = items.findIndex((x) => x.codigo === codigo);
    if (idx === -1) throw new Error("Producto no encontrado");
    const prev = items[idx];
    const merged = {
      ...prev,
      ...cambios,
      precio: cambios?.precio !== undefined ? Number(cambios.precio) : prev.precio,
      descuento: cambios?.descuento !== undefined ? Number(cambios.descuento) : prev.descuento,
      stock: cambios?.stock !== undefined ? Number(cambios.stock) : prev.stock,
    };
    // Normalizar estado en relación al stock si no viene explícito
    if (!("estado" in cambios)) {
      merged.estado = merged.stock > 0 ? "disponible" : prev.estado || "agotado";
    }
    items[idx] = merged;
    this.saveAll(items);
    return merged;
  },

  remove(codigo) {
    const items = this.getAll();
    const filtered = items.filter((x) => x.codigo !== codigo);
    const changed = filtered.length !== items.length;
    if (changed) this.saveAll(filtered);
    return changed;
  },

  query({ search = "", category = "", status = "" } = {}) {
    const q = String(search).toLowerCase().trim();
    const items = this.getAll();
    return items.filter((p) => {
      const okSearch = !q ||
        p.codigo.toLowerCase().includes(q) ||
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcion || "").toLowerCase().includes(q);
      const okCategory = !category || p.categoria === category;
      const okStatus = !status || p.estado === status;
      return okSearch && okCategory && okStatus;
    });
  },
};

export default productService;
