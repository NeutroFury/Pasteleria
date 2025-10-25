import { useState, useEffect } from "react";
import catalogo from "../data/catalogo";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  // Cargar productos desde el catálogo compartido
  useEffect(() => {
    setProductos(catalogo);
    // Opcional: dejarlos disponibles para otras vistas como Carrito
    try {
      const raw = localStorage.getItem("productos");
      const arr = raw ? JSON.parse(raw) : null;
      if (!Array.isArray(arr) || arr.length === 0) {
        localStorage.setItem("productos", JSON.stringify(catalogo));
      }
    } catch {
      localStorage.setItem("productos", JSON.stringify(catalogo));
    }
  }, []);

  // Formateador de precios (igual que en tu JS)
  const CLP = (n) =>
    n.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });

  // Función para agregar producto al carrito
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
      existe.cantidad = (Number(existe.cantidad) || 1) + 1;
    } else {
      carrito.push({
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: Number(producto.precio) || 0,
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
            style={{
              border: "1px solid #f0d9d2",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0,0,0,.06)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <img
              src={p.img}
              alt={p.nombre}
              loading="lazy"
              style={{ width: "100%", height: "160px", objectFit: "cover" }}
            />
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
                <strong style={{ color: "#7c3a2d" }}>{CLP(p.precio)}</strong>
                <button
                  onClick={() => agregarAlCarrito(p.codigo)}
                  style={{
                    background: "#d16a8a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
