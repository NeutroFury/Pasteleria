import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import catalogo from "../data/catalogo";
import "../styles/style.css";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);

  // Cargar carrito
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("carrito");
        const arr = raw ? JSON.parse(raw) : [];
        setCarrito(Array.isArray(arr) ? arr : []);
      } catch {
        setCarrito([]);
      }
    };
    load();
    const onChanged = () => load();
    window.addEventListener("carrito-changed", onChanged);
    window.addEventListener("storage", onChanged);
    return () => {
      window.removeEventListener("carrito-changed", onChanged);
      window.removeEventListener("storage", onChanged);
    };
  }, []);

  // Cargar productos (solo para mostrar en la lista)
  useEffect(() => {
    // Usar el catálogo actual y persistir para consistencia
    setProductos(catalogo);
    localStorage.setItem("productos", JSON.stringify(catalogo));
  }, []);

  const resolveImg = (src) => {
    if (!src) return '';
    if (/^https?:\/\//i.test(src) || /^data:/i.test(src)) return src;
    const s = String(src).replace(/^\/+/, '');
    const prefix = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    return `${prefix}/${s}` || `/${s}`;
  };

  const guardar = (nuevo) => {
    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
    window.dispatchEvent(new Event("carrito-changed"));
  };

  const incrementar = (codigo) =>
    guardar(
      carrito.map((it) =>
        it.codigo === codigo && (Number(it.cantidad) || 1) < 5
          ? { ...it, cantidad: (Number(it.cantidad) || 1) + 1 }
          : it
      )
    );

  const decrementar = (codigo) =>
    guardar(
      carrito
        .map((it) =>
          it.codigo === codigo
            ? { ...it, cantidad: Math.max(1, (Number(it.cantidad) || 1) - 1) }
            : it
        )
        .filter((it) => (Number(it.cantidad) || 1) > 0)
    );

  const eliminar = (codigo) => guardar(carrito.filter((it) => it.codigo !== codigo));

  const limpiar = () => guardar([]);

  const CLP = (n) =>
    Number(n).toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });

  const precioConDescuento = (p) => {
    const base = Number(p.precio) || 0;
    const d = Number(p.descuento) || 0;
    return d > 0 ? Math.round(base * (1 - d / 100)) : base;
  };

  const agregarDesdeListado = (p) => {
    let nuevo = Array.isArray(carrito) ? [...carrito] : [];
    const existe = nuevo.find((x) => x.codigo === p.codigo);
    if (existe) {
      if ((Number(existe.cantidad) || 1) >= 5) return;
      // Asegurar precio vigente (aplicar descuento si corresponde)
      const pf = precioConDescuento(p);
      if (Number(existe.precio) !== pf) {
        existe.precio = pf;
      }
      existe.cantidad = (Number(existe.cantidad) || 1) + 1;
    } else {
      nuevo.push({
        codigo: p.codigo,
        nombre: p.nombre,
        precio: precioConDescuento(p),
        img: p.img,
        categoria: p.categoria,
        cantidad: 1,
      });
    }
    guardar(nuevo);
  };

  const total = Array.isArray(carrito)
    ? carrito.reduce(
        (sum, it) => sum + (Number(it.precio) || 0) * (Number(it.cantidad) || 1),
        0
      )
    : 0;

  return (
    <main>
      <div className="carrito-layout">
        {/* Lista de productos */}
        <section className="carrito-left">
          <h2 className="estiloEncabezado">Lista de productos</h2>
          <div className="card product-cardlist">
            <div className="product-grid">
              {(productos || []).map((p) => (
                <article key={p.codigo} className="product-card">
                  <div className="product-thumb">
                    {p.img ? (
                      <img src={resolveImg(p.img)} alt={p.nombre} />
                    ) : (
                      <span>400 x 300</span>
                    )}
                  </div>
                  <div className="product-title">{p.nombre}</div>
                  <div className="product-price">
                    {p.descuento ? (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
                          {CLP(p.precio)}
                        </span>
                        <strong>{CLP(precioConDescuento(p))}</strong>
                      </div>
                    ) : (
                      <strong>{CLP(p.precio)}</strong>
                    )}
                  </div>
                  <button className="btn-agregar" onClick={() => agregarDesdeListado(p)}>
                    Añadir
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Carrito */}
        <section className="carrito-right">
          <h2 className="estiloEncabezado">Carrito de Compras</h2>

          {carrito.length === 0 ? (
            <div className="card empty-cart">
              <p>Tu carrito está vacío.</p>
              <NavLink to="/productos" className="btn-principal" style={{ marginTop: 8 }}>
                Ver productos
              </NavLink>
            </div>
          ) : (
            <div className="cart-card card">
              <div className="cart-scroll">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((it) => {
                      const subtotal =
                        (Number(it.precio) || 0) * (Number(it.cantidad) || 1);
                      return (
                        <tr key={it.codigo}>
                          <td><img className="thumb" src={it.img} alt={it.nombre} /></td>
                          <td style={{ color: "#7c3a2d", fontWeight: 600 }}>{it.nombre}</td>
                          <td>{CLP(it.precio)}</td>
                          <td>
                            <div className="qty-controls">
                              <button
                                className="cart-qty-btn is-minus"
                                onClick={() => decrementar(it.codigo)}
                                aria-label={`Disminuir cantidad de ${it.nombre}`}
                                disabled={(Number(it.cantidad) || 1) <= 1}
                              >
                                -
                              </button>
                              <span>{it.cantidad}</span>
                              <button
                                className="cart-qty-btn is-plus"
                                onClick={() => incrementar(it.codigo)}
                                aria-label={`Aumentar cantidad de ${it.nombre}`}
                                disabled={(Number(it.cantidad) || 1) >= 5}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td style={{ fontWeight: 700 }}>{CLP(subtotal)}</td>
                          <td>
                            <button className="colorBoton1" onClick={() => eliminar(it.codigo)}>
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="cart-totalbar">
                <div>
                  <strong>Total: </strong>
                  <span className="total">{CLP(total)}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="cart-clean-btn" onClick={limpiar}>Limpiar</button>
                  <button className="btn-compra" onClick={() => alert("Continuar compra")}>
                    Comprar ahora
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}