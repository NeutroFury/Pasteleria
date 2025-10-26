// Servicio de órdenes/boletas con persistencia en localStorage
// Se alimenta desde Checkout (localStorage.ultima_orden) y desde Pago-bien/Pago-mal

const STORAGE_KEY = "orders";

function safeParse(json) {
  try { const v = JSON.parse(json); return Array.isArray(v) ? v : []; } catch { return []; }
}

function nowIso() { return new Date().toISOString(); }

function normalize(o) {
  if (!o) return null;
  const id = o.id || `ORD-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
  const codigo = o.codigo || `ORDER${String(Date.now()).slice(-5)}`;
  const nro = o.nro || `#${new Date().getFullYear()}${String(Date.now()).slice(-4)}`;
  return {
    id,
    codigo,
    nro,
    fecha: o.fecha || nowIso(),
    estado: o.estado || "pagado", // pagado | fallido | anulado
    total: Number(o.total) || calcTotal(o.items),
    items: Array.isArray(o.items) ? o.items : [],
    cliente: o.cliente || {},
  };
}

function calcTotal(items) {
  return (Array.isArray(items) ? items : []).reduce((s, it) => s + (Number(it.precio)||0)*(Number(it.cantidad)||1), 0);
}

export const orderService = {
  getAll() {
    return safeParse(localStorage.getItem(STORAGE_KEY));
  },
  saveAll(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list || []));
    return this.getAll();
  },
  create(order) {
    const list = this.getAll();
    const o = normalize(order);
    list.unshift(o); // agregar al inicio
    this.saveAll(list);
    return o;
  },
  getById(id) {
    return this.getAll().find(o => o.id === id) || null;
  },
  update(id, cambios) {
    const list = this.getAll();
    const idx = list.findIndex(o => o.id === id);
    if (idx === -1) throw new Error("Orden no encontrada");
    const prev = list[idx];
    const merged = normalize({ ...prev, ...cambios, id: prev.id });
    list[idx] = merged;
    this.saveAll(list);
    return merged;
  },
  remove(id) {
    const list = this.getAll();
    const filtered = list.filter(o => o.id !== id);
    this.saveAll(filtered);
  },
  seedIfEmpty() {
    const list = this.getAll();
    if (list.length) return list;
    const demo = [
      normalize({
        id: `ORD-DEMO-1`, codigo: "ORDER001", nro: "#2025-0001", estado: "pagado",
        cliente: { nombre: "Cliente Demo", correo: "cliente@demo.local", comuna: "Santiago" },
        items: [ { codigo: "TC001", nombre: "Torta Chocolate", cantidad: 1, precio: 36000, img: "img/torta01.png" } ],
      }),
      normalize({
        id: `ORD-DEMO-2`, codigo: "ORDER002", nro: "#2025-0002", estado: "fallido",
        cliente: { nombre: "Ana Pérez", correo: "ana@correo.cl", comuna: "Providencia" },
        items: [ { codigo: "TT001", nombre: "Torta Vainilla", cantidad: 2, precio: 40000, img: "img/torta02.png" } ],
      }),
    ];
    this.saveAll(demo);
    return demo;
  },
  saveFromUltimaOrden(estado = "pagado") {
    try {
      const raw = localStorage.getItem("ultima_orden");
      const o = raw ? JSON.parse(raw) : null;
      if (!o || !Array.isArray(o.items) || o.items.length === 0) return null;
      // Hacer esta operación idempotente para evitar duplicados (por StrictMode o recargas)
      const list = this.getAll();
      const existsIdx = list.findIndex(x =>
        (o.id && x.id === o.id) ||
        (o.codigo && x.codigo === o.codigo) ||
        (o.nro && x.nro === o.nro)
      );
      if (existsIdx !== -1) {
        const prev = list[existsIdx];
        const merged = normalize({ ...prev, ...o, estado, id: prev.id });
        list[existsIdx] = merged;
        this.saveAll(list);
        return merged;
      }
      return this.create({ ...o, estado });
    } catch { return null; }
  }
  ,
  dedupe() {
    const list = this.getAll();
    const before = list.length;
    if (before <= 1) return { before, after: before, removed: 0 };

    // Agrupamos por coincidencia en cualquiera de los identificadores: id, codigo o nro
    const idToGroup = new Map();
    const codigoToGroup = new Map();
    const nroToGroup = new Map();
    const groups = [];

    const getGroupIndex = (o) => {
      return (
        (o.id && idToGroup.get(o.id)) ??
        (o.codigo && codigoToGroup.get(o.codigo)) ??
        (o.nro && nroToGroup.get(o.nro))
      );
    };

    list.forEach((o) => {
      let g = getGroupIndex(o);
      if (g === undefined) {
        g = groups.length;
        groups.push([o]);
      } else {
        groups[g].push(o);
      }
      if (o.id) idToGroup.set(o.id, g);
      if (o.codigo) codigoToGroup.set(o.codigo, g);
      if (o.nro) nroToGroup.set(o.nro, g);
    });

    const merged = groups.map((arr) => {
      if (arr.length === 1) return arr[0];
      // Elegimos el más reciente por fecha y fusionamos campos
      const sorted = [...arr].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      const newest = sorted[0];
      const oldest = sorted[sorted.length - 1];
      return normalize({ ...oldest, ...newest, id: newest.id || oldest.id });
    });

    // Orden descendente por fecha como estaba (unshift al crear)
    merged.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    this.saveAll(merged);
    return { before, after: merged.length, removed: before - merged.length };
  }
};

export default orderService;
