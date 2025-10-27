import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import orderService from '../data/orderService';
import '../utils/Admin-Boletas.logic.js';


export default function AdminBoletas() {
  // --- Estados (Se mantienen igual) ---
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('');
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [ordenSel, setOrdenSel] = useState(null);
  const [toast, setToast] = useState(null); // { text, kind }
  const pageSize = 10;

  // --- 1. Definir la lógica ---
  // (Añade esta línea para acceder a la lógica importada)
  const logic = window.AdminBoletasLogic;

  // --- 2. Hooks (Modificados para usar 'logic') ---
  useEffect(() => {
    // Se llama a la lógica externa
    logic.load(orderService, setOrders);
  }, []); // El array vacío está bien si 'logic' y 'orderService' son estables

  // (Estos se mantienen igual, son lógica de renderizado)
  const filtered = useMemo(() => {
    const text = q.toLowerCase().trim();
    return (orders || []).filter(o => {
      const okQ = !text ||
        (o.codigo || '').toLowerCase().includes(text) ||
        (o.nro || '').toLowerCase().includes(text) ||
        (o.cliente?.nombre || '').toLowerCase().includes(text) ||
        (o.cliente?.correo || '').toLowerCase().includes(text);
      const okE = !estado || o.estado === estado;
      return okQ && okE;
    });
  }, [orders, q, estado]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => { setPage(1); }, [q, estado]);

  // --- 3. JSX (Modificado para usar 'logic') ---
  return (
    <div className="admin-container">
      <nav className="admin-sidebar">
        {/* ... (Sidebar se mantiene igual) ... */}
        <div className="admin-logo">
          <h2 style={{ margin: 0, fontFamily: "'Pacifico', cursive" }}>Pastelería Mil Sabores</h2>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>Panel Administrador</p>
        </div>
        <ul className="admin-nav">
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin-productos">Productos</Link></li>
          <li><Link to="/admin-productos-criticos">Críticos</Link></li>
          <li><Link to="/admin-usuarios">Usuarios</Link></li>
          <li><Link to="/admin-boletas" className="active">Boletas</Link></li>
          <li><Link to="/admin-reportes">Reportes</Link></li>
          <li><Link to="/admin-perfil">Perfil</Link></li>
        </ul>
      </nav>

      <main className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Órdenes / Boletas</h1>
            <p>Listar, ver y anular boletas</p>
          </div>
          <div className="admin-actions">
            <Link to="/" className="btn-principal">🏠 Ir al Sitio</Link>
            {/* ✅ Botón DEPURAR corregido */}
            <button
              onClick={() => {
                const showToast_func = (text, kind) => logic.showToast(setToast, window, text, kind);
                const load_func = () => logic.load(orderService, setOrders);
                logic.depurar(orderService, load_func, showToast_func);
              }}
              className="admin-btn-secondary"
              style={{ marginLeft: 8 }}
            >
              Depurar duplicados
            </button>
          </div>
        </div>

        <div className="admin-filters">
          {/* ... (Filtros se mantienen igual) ... */}
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar por código, nro, cliente o email" />
          <select value={estado} onChange={(e)=>setEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="pagado">Pagado</option>
            <option value="fallido">Fallido</option>
            <option value="anulado">Anulado</option>
          </select>
        </div>

        <div className="admin-table">
          <table>
            {/* ... (Thead se mantiene igual) ... */}
            <thead>
              <tr>
                <th>Código</th>
                <th>Nro</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#7c3a2d' }}>No hay boletas</td></tr>
              ) : paged.map(o => (
                <tr key={o.id}>
                  <td>{o.codigo}</td>
                  <td>{o.nro}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong style={{ color: '#7c3a2d' }}>{o.cliente?.nombre || 'Cliente'}</strong>
                      <small style={{ opacity: .8 }}>{o.cliente?.correo}</small>
                    </div>
                  </td>
                  {/* ✅ Llamada a logic.badge */}
                  <td>{logic.badge(o.estado)}</td>
                  {/* ✅ Llamada a logic.CLP */}
                  <td>{logic.CLP(o.total)}</td>
                  <td>{new Date(o.fecha).toLocaleString('es-CL')}</td>
                  <td>
                    <div className="admin-actions">
                      {/* ✅ Llamada a logic.verBoleta */}
                      <button className="admin-action-btn is-history" onClick={() => logic.verBoleta(localStorage, o, setOrdenSel, setVisible)}>Mostrar boleta</button>
                      {/* ✅ Llamada a logic.abrirPestanaBoleta */}
                      <button className="admin-action-btn" onClick={() => logic.abrirPestanaBoleta(localStorage, window, o)}>Abrir pestaña</button>
                      {o.estado !== 'anulado' && (
                        /* ✅ Llamada a logic.anular */
                        <button
                          className="admin-action-btn is-delete"
                          onClick={() => {
                            const showToast_func = (text, kind) => logic.showToast(setToast, window, text, kind);
                            const load_func = () => logic.load(orderService, setOrders);
                            logic.anular(window, orderService, load_func, showToast_func, o);
                          }}
                        >
                          Anular
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination" style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
          {/* ... (Paginación se mantiene igual) ... */}
          <button className="admin-btn-secondary" disabled={currentPage<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Anterior</button>
          <span>Página {currentPage} de {totalPages}</span>
          <button className="admin-btn-secondary" disabled={currentPage>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Siguiente</button>
        </div>

        {/* --- Modal (Modificado para usar 'logic') --- */}
        {visible && !!ordenSel && (
          <div
            role="dialog"
            aria-modal="true"
            className="modal-backdrop"
            /* ✅ Llamada a logic.cerrarBoleta */
            onClick={() => logic.cerrarBoleta(setVisible, setOrdenSel)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 }}
          >
            <div className="card cart-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(980px, 96vw)', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <h2 className="estiloEncabezado" style={{ margin: 0 }}>Boleta {ordenSel.nro}</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-compra" onClick={() => window.print()}>Imprimir</button>
                  {/* ✅ Llamada a logic.enviarEmail */}
                  <button className="btn-compra" onClick={() => logic.enviarEmail(ordenSel, logic.CLP, window)}>Enviar email</button>
                  {/* ✅ Llamada a logic.cerrarBoleta */}
                  <button className="btn-compra" onClick={() => logic.cerrarBoleta(setVisible, setOrdenSel)}>Cerrar</button>
                </div>
              </div>

              {/* ... (Datos cliente y dirección se mantienen igual) ... */}
              
              {/* Items */}
              <div className="cart-scroll" style={{ marginTop: 12 }}>
                <table className="cart-table" style={{ width: '100%' }}>
                  {/* ... (Thead se mantiene igual) ... */}
                  <tbody>
                    {(ordenSel.items || []).map(it => {
                      const sub = (Number(it.precio) || 0) * (Number(it.cantidad) || 1);
                      return (
                        <tr key={it.codigo}>
                          <td><img className="thumb" src={it.img} alt={it.nombre} /></td>
                          <td style={{ color: '#7c3a2d', fontWeight: 600 }}>{it.nombre}</td>
                          {/* ✅ Llamada a logic.CLP */}
                          <td>{logic.CLP(it.precio)}</td>
                          <td>{it.cantidad}</td>
                          {/* ✅ Llamada a logic.CLP */}
                          <td style={{ fontWeight: 700 }}>{logic.CLP(sub)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="receipt-totalbox" style={{ background: '#f3e9e1', borderRadius: 10, padding: 14, marginTop: 12, display: 'flex', justifyContent: 'center' }}>
                {/* ✅ Llamada a logic.CLP */}
                <strong style={{ color: '#7c3a2d', fontSize: 18 }}>Total: {logic.CLP(ordenSel.total)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* --- Toast (Se mantiene igual) --- */}
        {toast && (
          <div style={{ position: 'fixed', right: 16, bottom: 16, background: toast.kind === 'success' ? '#2e8b57' : toast.kind === 'info' ? '#7c3a2d' : '#9b2c2c', color: '#fff', padding: '10px 14px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,.18)', zIndex: 60 }}>
            {toast.text}
          </div>
        )}
      </main>
    </div>
  );
}