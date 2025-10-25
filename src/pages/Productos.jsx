import { useState, useEffect } from "react";
import catalogo from "../data/catalogo";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  // Cargar productos desde el catálogo compartido
  useEffect(() => {
    // Fuente única de productos
    setProductos(catalogo);
    // Persistimos siempre para que Ofertas/Carrito tengan los mismos datos (incluye descuentos)
    localStorage.setItem("productos", JSON.stringify(catalogo));
  }, []);

  // Formateador de precios (igual que en tu JS)
  const CLP = (n) =>
    n.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });

  // Calcula el precio final aplicando descuento (si existe)
  const precioConDescuento = (p) => {
    const base = Number(p.precio) || 0;
    const d = Number(p.descuento) || 0;
    return d > 0 ? Math.round(base * (1 - d / 100)) : base;
  };

  // Función para agregar producto al carrito (usa precio final)
  const agregarAlCarrito = (codigo) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      // Redirige al login si no hay sesión
      window.location.href = "/login";
      return;
    }

    const producto = productos.find((p) => p.codigo === codigo);
    if (!producto) return;

    let carrito;
    try {
      const raw = localStorage.getItem("carrito");
      carrito = raw ? JSON.parse(raw) : [];
    } catch {
      carrito = [];
    }
    if (!Array.isArray(carrito)) carrito = [];

    const existe = carrito.find((p) => p.codigo === codigo);
    if (existe) {
      if ((Number(existe.cantidad) || 1) >= 5) {
        alert("⚠️ No puedes agregar más de 5 unidades de este producto.");
        return;
      }
      // Asegurar precio vigente (aplicar descuento si corresponde)
      const pf = precioConDescuento(producto);
      if (Number(existe.precio) !== pf) {
        existe.precio = pf;
      }
      existe.cantidad = (Number(existe.cantidad) || 1) + 1;
    } else {
      carrito.push({
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: precioConDescuento(producto),
        img: producto.img,
        categoria: producto.categoria,
        cantidad: 1,
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    // Opcional: notificar a otros componentes
    window.dispatchEvent(new Event("carrito-changed"));
  };

  // Obtener categorías únicas
  const categorias = ["Todas", ...new Set(productos.map(p => p.categoria))];

  // Filtrar productos por categoría
  const productosFiltrados = categoriaSeleccionada === "Todas" 
    ? productos 
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <main>
      <h1
        style={{
          textAlign: "center",
          margin: "1.5rem 0",
          color: "#7c3a2d",
          fontFamily: '"Pacifico", cursive',
        }}
      >
        Catálogo de Productos
      </h1>

      {/* Filtro de categorías */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        margin: "1rem 0",
        gap: "10px"
      }}>
        {categorias.map(categoria => (
          <button
            key={categoria}
            onClick={() => setCategoriaSeleccionada(categoria)}
            style={{
              background: categoriaSeleccionada === categoria ? "#7c3a2d" : "#d16a8a",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
          >
            {categoria}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          padding: "1rem",
        }}
      >
        {productosFiltrados.map((p) => (
          <div
            key={p.codigo}
            className="card-sombra"
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div className="catalog-thumb">
              <img
                src={p.img}
                alt={p.nombre}
                loading="lazy"
              />
            </div>
            <div style={{ padding: "10px 12px" }}>
              <h3 style={{ color: "#7c3a2d", margin: "0 0 6px" }}>{p.nombre}</h3>
              <p style={{ color: "#7c3a2d", opacity: ".9", marginBottom: "10px" }}>
                {p.descripcion}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Precio con posible descuento */}
                {p.descuento ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ textDecoration: "line-through", opacity: 0.6, color: "#7c3a2d" }}>
                      {CLP(p.precio)}
                    </span>
                    <strong style={{ color: "#7c3a2d" }}>{CLP(precioConDescuento(p))}</strong>
                  </div>
                ) : (
                  <strong style={{ color: "#7c3a2d" }}>{CLP(p.precio)}</strong>
                )}
                <button
                  onClick={() => agregarAlCarrito(p.codigo)}
                  className="btn-agregar"
                >
                  Agregar
                </button>
              </div>
              {p.descuento ? (
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 6,
                    background: "#ff6b6b",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "2px 8px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Oferta -{p.descuento}%
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
