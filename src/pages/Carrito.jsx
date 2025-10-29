import React, { useEffect, useState } from "react";
import {  NavLink } from "react-router-dom";
import catalogo from "../data/catalogo";
import "../styles/style.css";
import "../utils/Carrito.logic";

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

  // Usar funciones de la lógica pura
  const resolveImg = (src) => window.CarritoLogic.resolveImg(src, process.env.PUBLIC_URL);
  const CLP = (n) => window.CarritoLogic.CLP(n);
  const precioConDescuento = (p) => window.CarritoLogic.precioConDescuento(p);

  const guardar = (nuevo) => {
    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
    window.dispatchEvent(new Event("carrito-changed"));
  };

  const incrementar = (codigo) => guardar(window.CarritoLogic.logic_incrementar(carrito, codigo));
  const decrementar = (codigo) => guardar(window.CarritoLogic.logic_decrementar(carrito, codigo));
  const eliminar = (codigo) => guardar(window.CarritoLogic.logic_eliminar(carrito, codigo));
  const limpiar = () => guardar(window.CarritoLogic.logic_limpiar());
  
  const agregarDesdeListado = (p) => {
    const nuevoCarrito = window.CarritoLogic.logic_agregarDesdeListado(
      carrito, 
      p, 
      window.CarritoLogic.precioConDescuento
    );
    guardar(nuevoCarrito);
  };

  const total = window.CarritoLogic.calcularTotal(carrito);

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
                      const subtotal = window.CarritoLogic.calcularSubtotal(it);
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
                  <NavLink to="/checkout" className="btn-compra">
                    Comprar ahora
                  </NavLink>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}