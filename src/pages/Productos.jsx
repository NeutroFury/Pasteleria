import { useState, useEffect } from "react";
import productService from "../data/productService";
import "../utils/Productos.logic.js";

export default function Productos() {
  const resolveImg = (src) => window.ProductosLogic.resolveImg(src, process.env.PUBLIC_URL);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  // Cargar productos desde servicio (usa localStorage con semilla del catálogo)
  useEffect(() => {
    setProductos(productService.getAll());
  }, []);

  const CLP = (n) => window.ProductosLogic.CLP(n);
  const precioConDescuento = (p) => window.ProductosLogic.precioConDescuento(p);
  const agregarAlCarrito = (codigo) => {
    window.ProductosLogic.agregarAlCarrito(codigo, productos);
  };

  // Obtener categorías únicas
  const categorias = ["Todas", ...new Set((productos || []).map(p => p.categoria))];

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
                src={resolveImg(p.img)}
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
