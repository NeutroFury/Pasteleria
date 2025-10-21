import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importar la lista de productos
import { productos } from '../data/carrito';

export default function Carrito() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState(productos);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  // Efecto para verificar el login y cargar el carrito
  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem("loggedIn")) || false;
    if (!loggedIn) {
      alert("⚠️ Debes iniciar sesión para acceder al carrito");
      navigate('/login');
      return;
    }

    // Cargar carrito desde localStorage (fallback a arreglo vacío)
    try {
      const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
      setCarrito(carritoGuardado);
    } catch (e) {
      // Si parse falla, limpiar la clave y empezar vacío
      console.error('Error parsing carrito desde localStorage:', e);
      localStorage.removeItem('carrito');
      setCarrito([]);
    }
  }, [navigate]);

  // Obtener categorías únicas
  const categorias = ["Todos", ...new Set(productos.map(p => p.categoria))];

  // Manejadores
  const handleCategoriaChange = (e) => {
    const categoria = e.target.value;
    setCategoriaSeleccionada(categoria);

    if (categoria === "Todos") {
      setProductosFiltrados(productos);
    } else {
      setProductosFiltrados(productos.filter(p => p.categoria === categoria));
    }
  };

  const agregarAlCarrito = (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    setCarrito(prevCarrito => {
      const existe = prevCarrito.find(p => p.id === id);

      if (existe) {
        if (existe.cantidad >= 5) {
          alert("⚠️ No puedes agregar más de 5 unidades de este producto.");
          return prevCarrito;
        }

        const nuevoCarrito = prevCarrito.map(p =>
          p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        return nuevoCarrito;
      } else {
        const nuevoCarrito = [...prevCarrito, { ...producto, cantidad: 1 }];
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        return nuevoCarrito;
      }
    });
  };

  const aumentar = (id) => {
    setCarrito(prevCarrito => {
      const nuevoCarrito = prevCarrito.map(p =>
        p.id === id && p.cantidad < 5 ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      return nuevoCarrito;
    });
  };

  const disminuir = (id) => {
    setCarrito(prevCarrito => {
      const nuevoCarrito = prevCarrito.map(p =>
        p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
      ).filter(p => p.cantidad > 0);
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      return nuevoCarrito;
    });
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    localStorage.setItem("carrito", JSON.stringify([]));
  };

  // Calcular total
  const total = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

  return (
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

      {/* Filtro por categorías (dinámico) */}
      <div className="centrado" style={{ margin: "1rem 0" }}>
        <label
          htmlFor="filtroCategoria"
          style={{ fontWeight: "bold", color: "#7c3a2d", marginRight: 10 }}
        >
          Filtrar por categoría:
        </label>
        <select
          id="filtroCategoria"
          value={categoriaSeleccionada}
          onChange={handleCategoriaChange}
          className="form-control"
          style={{ padding: 5, borderRadius: 8, border: "1px solid #fac3d6" }}
        >
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
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
            {productosFiltrados && productosFiltrados.length > 0 ? (
              productosFiltrados.map(p => (
                <div className="item-producto" key={p.id} style={{ marginBottom: 12 }}>
                  <strong>{p.nombre}</strong>
                  <div className="categoria">Categoría: {p.categoria}</div>
                  <div className="precio">Precio: ${p.precio.toLocaleString('es-CL')}</div>
                  <button className="btn-agregar" onClick={() => agregarAlCarrito(p.id)}>Agregar al carrito</button>
                </div>
              ))
            ) : (
              <p>No hay productos en esta categoría.</p>
            )}
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
            {carrito && carrito.length > 0 ? (
              carrito.map(item => (
                <div className="item-carrito" key={item.id} style={{ marginBottom: 12 }}>
                  <strong>{item.nombre}</strong><br />
                  Precio: ${item.precio.toLocaleString('es-CL')} x {item.cantidad} = ${ (item.precio * item.cantidad).toLocaleString('es-CL') }
                  <div className="carrito-cantidad" style={{ marginTop: 8 }}>
                    <button onClick={() => disminuir(item.id)} disabled={item.cantidad <= 1}>-</button>
                    <span style={{ margin: '0 8px' }}>{item.cantidad}</span>
                    <button onClick={() => aumentar(item.id)} disabled={item.cantidad >= 5}>+</button>
                  </div>
                </div>
              ))
            ) : (
              <p>El carrito está vacío.</p>
            )}
          </div>

          <div id="total" className="carrito-total" style={{ marginTop: 12 }}>
            Total: ${total.toLocaleString('es-CL')}
          </div>

          <button
            id="btnLimpiar"
            className="colorBoton1"
            onClick={limpiarCarrito}
            style={{ background: "#ff6b6b", width: "100%", marginTop: "1rem" }}
          >
            Limpiar Carrito
          </button>
        </div>
      </div>
    </main>
  )
}
