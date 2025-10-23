import { useState, useEffect } from "react";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  // Cargar productos desde el archivo 
  useEffect(() => {
    const data = [
      {codigo: "TC001", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Chocolate", precio: 45000, descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales", img: "img/Pastel_1.png" },
        { codigo: "TC002", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Frutas", precio: 50000, descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.", img: "img/Pastel_2.png" },
        { codigo: "TT001", categoria: "Tortas Circulares", nombre: "Torta Circular de Vainilla", precio: 40000, descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.", img: "img/Pastel_3.png" },
        { codigo: "TT002", categoria: "Tortas Circulares", nombre: "Torta Circular de Manjar", precio: 42000, descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.", img: "img/Pastel_4.png" },
        { codigo: "PI001", categoria: "Postres Individuales", nombre: "Mousse de Chocolate", precio: 5000, descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.", img: "img/Pastel_5.png" },
        { codigo: "PI002", categoria: "Postres Individuales", nombre: "Tiramisú Clásico", precio: 5500, descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.", img: "img/Pastel_6.png" },
        { codigo: "PSA001", categoria: "Productos Sin Azúcar", nombre: "Torta Sin Azúcar de Naranja", precio: 48000, descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.", img: "img/Pastel_7.png" },
        { codigo: "PSA002", categoria: "Productos Sin Azúcar", nombre: "Cheesecake Sin Azúcar", precio: 47000, descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.", img: "img/cheesecake.png" },
        { codigo: "PT001", categoria: "Pastelería Tradicional", nombre: "Empanada de Manzana", precio: 3000, descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.", img: "img/Pastel_8.png" },
        { codigo: "PT002", categoria: "Pastelería Tradicional", nombre: "Tarta de Santiago", precio: 6000, descripcion: "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.", img: "img/Pastel_9.png" },
        { codigo: "PG001", categoria: "Productos Sin Gluten", nombre: "Brownie Sin Gluten", precio: 4000, descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.", img: "img/Pastel_10.png" },
        { codigo: "PG002", categoria: "Productos Sin Gluten", nombre: "Pan Sin Gluten", precio: 3500, descripcion: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.", img: "img/Pastel_11.png" },
        { codigo: "PV001", categoria: "Productos Veganos", nombre: "Torta Vegana de Chocolate", precio: 50000, descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.", img: "img/Pastel_12.png" },
        { codigo: "PV002", categoria: "Productos Veganos", nombre: "Galletas Veganas de Avena", precio: 4500, descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.", img: "img/Pastel_13.png" },
        { codigo: "TE001", categoria: "Tortas Especiales", nombre: "Torta Especial de Cumpleaños", precio: 55000, descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.", img: "img/Pastel_14.png" },
        { codigo: "TE002", categoria: "Tortas Especiales", nombre: "Torta Especial de Boda", precio: 60000, descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.", img: "img/Pastel_15.png" } 
    ];
    setProductos(data);
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
