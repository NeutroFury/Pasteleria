// Servicio de productos con persistencia en localStorage
// Fuente inicial: src/data/catalogo.js

import catalogo from "./catalogo";
import api from "../services/api";

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
    // Intentar obtener catálogo desde backend en background y persistir en localStorage
    try {
      api.getProducts()
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            const mapped = data.map((p) => ({
              id: p.id || null,
              codigo: p.codigo || (p.id ? String(p.id) : ''),
              categoria: p.categoria || p.category || 'Otros',
              nombre: p.nombre || p.name || 'Sin nombre',
              precio: Number(p.precio ?? p.price ?? 0),
              descripcion: p.descripcion || p.description || '',
              img: p.img || p.image || '',
              descuento: Number(p.descuento ?? p.discount ?? 0),
              stock: Number(p.stock ?? 10),
              estado: p.estado || (Number(p.stock ?? 10) > 0 ? 'disponible' : 'agotado'),
            }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
          }
        })
        .catch(() => {});
    } catch {}
    return seedIfEmpty();
  },

  saveAll(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list || []));
    // Emitir evento para que UI pueda refrescarse
    try {
      window.dispatchEvent(new Event('productos-updated'));
    } catch {}
    return this.getAll();
  },

  getById(codigo) {
    const items = this.getAll();
    return items.find((x) => String(x.codigo) === String(codigo) || String(x.id) === String(codigo)) || null;
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
    // Intentar crear en backend (no bloquear la UI)
    try {
      const payload = {
        codigo: nuevo.codigo,
        categoria: nuevo.categoria,
        nombre: nuevo.nombre,
        precio: nuevo.precio,
        descripcion: nuevo.descripcion,
        img: nuevo.img,
        descuento: nuevo.descuento,
        stock: nuevo.stock,
      };
      // fire-and-forget; productService may be used without auth in dev
      api.create?.(payload).catch(() => {});
    } catch {}
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
