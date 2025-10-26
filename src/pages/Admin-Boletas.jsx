import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import orderService from '../data/orderService';

const CLP = (n) => Number(n).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export default function AdminBoletas() {
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('');
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [ordenSel, setOrdenSel] = useState(null);
  const [toast, setToast] = useState(null); // { text, kind }
  const pageSize = 10;
  const showToast = (text, kind = 'info') => {
    setToast({ text, kind });
    window.clearTimeout(window.__toastTimer);
    window.__toastTimer = window.setTimeout(()=> setToast(null), 2600);
  };

  const load = () => {
    // Limpieza de posibles duplicados y eliminación de ejemplos por defecto
    try { orderService.dedupe(); } catch {}
    try { orderService.purgeExamples(); } catch {}
    setOrders(orderService.getAll());
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const text = q.toLowerCase().trim();
    return (orders || []).filter(o => {
      const okQ = !text ||
        (o.codigo||'').toLowerCase().includes(text) ||
        (o.nro||'').toLowerCase().includes(text) ||
        (o.cliente?.nombre||'').toLowerCase().includes(text) ||
        (o.cliente?.correo||'').toLowerCase().includes(text);
      const okE = !estado || o.estado === estado;
      return okQ && okE;
    });
  }, [orders, q, estado]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage-1)*pageSize, currentPage*pageSize);
  useEffect(()=>{ setPage(1); }, [q, estado]);

  const verBoleta = (o) => {
    // Guardamos para mantener compatibilidad con la pantalla de Pago-bien
    try { localStorage.setItem('ultima_orden', JSON.stringify(o)); } catch {}
    setOrdenSel(o);
    setVisible(true);
  };

  const cerrarBoleta = () => { setVisible(false); setOrdenSel(null); };

  const enviarEmail = () => {
    if (!ordenSel) return;
    const total = (ordenSel.items||[]).reduce((s,it)=> s + (Number(it.precio)||0)*(Number(it.cantidad)||1), 0);
    const to = ordenSel?.cliente?.correo || '';
    const subject = encodeURIComponent(`Boleta de compra ${ordenSel.codigo || ordenSel.id}`);
    const cuerpo = [
      `Hola ${ordenSel?.cliente?.nombre || ''},`,
      '',
      `Adjuntamos el detalle de tu compra ${ordenSel.codigo || ordenSel.id}.`,
      '',
      ...(ordenSel.items || []).map(
        (it) => `• ${it.nombre} x${it.cantidad} = ${CLP((Number(it.precio)||0)*(Number(it.cantidad)||1))}`
      ),
      '',
      `Total pagado: ${CLP(total)}`,
    ].join('%0D%0A');
    window.location.href = `mailto:${to}?subject=${subject}&body=${cuerpo}`;
  };

  const anular = (o) => {
    if (!window.confirm('¿Anular esta boleta?')) return;
    orderService.update(o.id, { estado: 'anulado' });
    load();
    showToast('Boleta anulada', 'info');
  };

  const depurar = () => {
    const res = orderService.dedupe();
    load();
    if (res && typeof res.removed === 'number') {
      showToast(`Depuración completa. Eliminados ${res.removed} duplicados.`, 'success');
    }
  };

  const badge = (s) => {
    const map = { pagado: '#e9ffe8', fallido: '#fff5f5', anulado: '#f5f5f5' };
    const color = s === 'pagado' ? '#0f5d1d' : s === 'fallido' ? '#9b2c2c' : '#4a4a4a';
    return <span style={{ background: map[s]||'#f5f5f5', color, padding:'4px 8px', borderRadius:999, fontSize:12, fontWeight:700, textTransform:'capitalize' }}>{s}</span>;
  };

  return (
    <div className="admin-container">
      <nav className="admin-sidebar">
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
            <button onClick={depurar} className="admin-btn-secondary" style={{ marginLeft: 8 }}>Depurar duplicados</button>
          </div>
        </div>

        <div className="admin-filters">
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
                <tr><td colSpan={7} style={{ textAlign:'center', color:'#7c3a2d' }}>No hay boletas</td></tr>
              ) : paged.map(o => (
                <tr key={o.id}>
                  <td>{o.codigo}</td>
                  <td>{o.nro}</td>
                  <td>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <strong style={{color:'#7c3a2d'}}>{o.cliente?.nombre || 'Cliente'}</strong>
                      <small style={{opacity:.8}}>{o.cliente?.correo}</small>
                    </div>
                  </td>
                  <td>{badge(o.estado)}</td>
                  <td>{CLP(o.total)}</td>
                  <td>{new Date(o.fecha).toLocaleString('es-CL')}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn is-history" onClick={()=>verBoleta(o)}>Mostrar boleta</button>
                      <button className="admin-action-btn" onClick={()=>{ localStorage.setItem('ultima_orden', JSON.stringify(o)); window.open('/pago-bien','_blank'); }}>Abrir pestaña</button>
                      {o.estado !== 'anulado' && (
                        <button className="admin-action-btn is-delete" onClick={()=>anular(o)}>Anular</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination" style={{ display:'flex', gap:8, justifyContent:'center', alignItems:'center', marginTop:12 }}>
          <button className="admin-btn-secondary" disabled={currentPage<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Anterior</button>
          <span>Página {currentPage} de {totalPages}</span>
          <button className="admin-btn-secondary" disabled={currentPage>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Siguiente</button>
        </div>

        {visible && !!ordenSel && (
          <div role="dialog" aria-modal="true" className="modal-backdrop" onClick={cerrarBoleta}
               style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', display:'flex', alignItems:'center', justifyContent:'center', padding:16, zIndex: 50 }}>
            <div className="card cart-card" onClick={(e)=>e.stopPropagation()} style={{ width:'min(980px, 96vw)', maxHeight:'90vh', overflow:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                <h2 className="estiloEncabezado" style={{ margin:0 }}>Boleta {ordenSel.nro}</h2>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn-compra" onClick={()=>window.print()}>Imprimir</button>
                  <button className="btn-compra" onClick={enviarEmail}>Enviar email</button>
                  <button className="btn-compra" onClick={cerrarBoleta}>Cerrar</button>
                </div>
              </div>

              {/* Datos cliente */}
              <div className="form-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:10 }}>
                <div className="form-field">
                  <label className="form-label">Nombre</label>
                  <input className="input" readOnly value={ordenSel?.cliente?.nombre || ''} />
                </div>
                <div className="form-field">
                  <label className="form-label">Apellidos</label>
                  <input className="input" readOnly value={ordenSel?.cliente?.apellidos || ''} />
                </div>
                <div className="form-field">
                  <label className="form-label">Correo</label>
                  <input className="input" readOnly value={ordenSel?.cliente?.correo || ''} />
                </div>
              </div>

              {/* Dirección */}
              <div className="form-grid-2" style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:12 }}>
                <div className="form-field">
                  <label className="form-label">Calle</label>
                  <input className="input" readOnly value={ordenSel?.cliente?.calle || ''} />
                </div>
                <div className="form-field">
                  <label className="form-label">Departamento</label>
                  <input className="input" readOnly value={ordenSel?.cliente?.depto || ''} />
                </div>
              </div>
              <div className="form-grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-field">
                  <label className="form-label">Región</label>
                  <input className="input" readOnly value={ordenSel?.cliente?.region || ''} />
                </div>
                <div className="form-field">
                  <label className="form-label">Comuna</label>
                  <input className="input" readOnly value={ordenSel?.cliente?.comuna || ''} />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Indicaciones</label>
                <textarea className="input" rows={2} readOnly value={ordenSel?.cliente?.indicaciones || ''} />
              </div>

              {/* Items */}
              <div className="cart-scroll" style={{ marginTop: 12 }}>
                <table className="cart-table" style={{ width:'100%' }}>
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(ordenSel.items||[]).map(it => {
                      const sub = (Number(it.precio)||0)*(Number(it.cantidad)||1);
                      return (
                        <tr key={it.codigo}>
                          <td><img className="thumb" src={it.img} alt={it.nombre} /></td>
                          <td style={{ color:'#7c3a2d', fontWeight:600 }}>{it.nombre}</td>
                          <td>{CLP(it.precio)}</td>
                          <td>{it.cantidad}</td>
                          <td style={{ fontWeight:700 }}>{CLP(sub)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="receipt-totalbox" style={{ background:'#f3e9e1', borderRadius:10, padding:14, marginTop:12, display:'flex', justifyContent:'center' }}>
                <strong style={{ color:'#7c3a2d', fontSize:18 }}>Total: {CLP(ordenSel.total)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Toast minimalista */}
        {toast && (
          <div style={{ position:'fixed', right:16, bottom:16, background: toast.kind==='success'? '#2e8b57' : toast.kind==='info'? '#7c3a2d' : '#9b2c2c', color:'#fff', padding:'10px 14px', borderRadius:8, boxShadow:'0 4px 16px rgba(0,0,0,.18)', zIndex:60 }}>
            {toast.text}
          </div>
        )}
      </main>
    </div>
  );
}
