import { NavLink } from "react-router-dom";
export default function Carrito() {
    return (    
        <>
        <main>
    <h1
      className="centrado"
      style={{
        margin: "1.5rem 0",
        color: "#7c3a2d",
        fontFamily: '"Pacifico", cursive',
        fontSize: "2rem"
      }}
    >
      🛒 Carrito de Compras
    </h1>
    {/* Filtro por categorías (simple) */}
    <div className="centrado" style={{ margin: "1rem 0" }}>
      <label
        htmlFor="filtroCategoria"
        style={{ fontWeight: "bold", color: "#7c3a2d", marginRight: 10 }}
      >
        Filtrar por categoría:
      </label>
      <select
        id="filtroCategoria"
        className="form-control"
        style={{ padding: 5, borderRadius: 8, border: "1px solid #fac3d6" }}
      >
        <option value="Todos">Todas las categorías</option>
      </select>
    </div>
    <div className="carrito-grid">
      {/* Columna izquierda: Productos disponibles */}
      <div className="productos-card">
        <h2
          style={{
            color: "#7c3a2d",
            marginBottom: "1rem",
            fontFamily: '"Pacifico", cursive'
          }}
        >
          Productos Disponibles
        </h2>
        <div id="listaProductos">
          {/* Los productos se cargarán aquí con JavaScript */}
        </div>
      </div>
      {/* Columna derecha: Carrito */}
      <div className="carrito-card">
        <h2
          style={{
            color: "#7c3a2d",
            marginBottom: "1rem",
            fontFamily: '"Pacifico", cursive'
          }}
        >
          Mi Carrito
        </h2>
        <div id="carrito">
          {/* Los productos del carrito se mostrarán aquí */}
        </div>
        <div id="total" className="carrito-total">
          Total: $0
        </div>
        <button
          id="btnLimpiar"
          className="colorBoton1"
          style={{ background: "#ff6b6b", width: "100%", marginTop: "1rem" }}
        >
          Limpiar Carrito
        </button>
      </div>
    </div>
  </main>
    </>
    )}
    ;