import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import orderService from '../data/orderService';

const CLP = (n) => Number(n).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

function toDateKey(iso) {
  try { const d = new Date(iso); return d.toISOString().slice(0,10); } catch { return String(iso).slice(0,10); }
}

function exportCSV(filename, rows) {
  const process = (r) => r.map((v)=>`"${String(v??'').replace(/"/g,'""')}"`).join(',');
  const csv = [Object.keys(rows[0]||{}).join(','), ...rows.map(r=>process(Object.values(r)))].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

export default function AdminReportes() {
  const [orders, setOrders] = useState([]);
  const [rango, setRango] = useState('30'); // días

  const load = () => {
    try { orderService.dedupe(); } catch {}
    const list = orderService.getAll();
    if (!list || list.length === 0) orderService.seedIfEmpty();
    setOrders(orderService.getAll());
  };
  useEffect(()=>{ load(); }, []);

  const desde = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - Number(rango)); d.setHours(0,0,0,0); return d;
  }, [rango]);

  const enRango = useMemo(() => (orders||[]).filter(o => new Date(o.fecha) >= desde), [orders, desde]);

  const totales = useMemo(() => {
    const acc = { total: 0, count: 0, pagado: 0, fallido: 0, anulado: 0 };
    enRango.forEach(o => {
      acc.count += 1; acc.total += Number(o.total)||0; acc[o.estado] = (acc[o.estado]||0)+1;
    });
    return acc;
  }, [enRango]);

  const ventasPorDia = useMemo(() => {
    const map = new Map();
    enRango.forEach(o => {
      const k = toDateKey(o.fecha);
      const prev = map.get(k) || { fecha: k, pedidos: 0, ingresos: 0 };
      if (o.estado === 'pagado') { prev.pedidos += 1; prev.ingresos += Number(o.total)||0; }
      map.set(k, prev);
    });
    // Generar últimos N días aunque estén en 0
    const arr = [];
    const today = new Date(); today.setHours(0,0,0,0);
    for (let i = Number(rango)-1; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate()-i);
      const k = d.toISOString().slice(0,10);
      arr.push(map.get(k) || { fecha: k, pedidos: 0, ingresos: 0 });
    }
    return arr;
  }, [enRango, rango]);

  const topProductos = useMemo(() => {
    const map = new Map();
    enRango.filter(o=>o.estado==='pagado').forEach(o => {
      (o.items||[]).forEach(it => {
        const prev = map.get(it.codigo) || { codigo: it.codigo, nombre: it.nombre, cantidad: 0, ingresos: 0 };
        prev.cantidad += Number(it.cantidad)||0;
        prev.ingresos += (Number(it.precio)||0)*(Number(it.cantidad)||1);
        map.set(it.codigo, prev);
      });
    });
    return Array.from(map.values()).sort((a,b)=> b.cantidad - a.cantidad).slice(0,10);
  }, [enRango]);

  const exportarOrdenes = () => {
    const rows = enRango.map(o => ({ id:o.id, codigo:o.codigo, nro:o.nro, fecha:o.fecha, estado:o.estado, total:o.total, cliente:o.cliente?.correo||'' }));
    exportCSV(`ordenes_${rango}d.csv`, rows);
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
          <li><Link to="/admin-boletas">Boletas</Link></li>
          <li><Link to="/admin-reportes" className="active">Reportes</Link></li>
          <li><Link to="/admin-perfil">Perfil</Link></li>
        </ul>
      </nav>

      <main className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Reportes</h1>
            <p>Resumen de ventas y actividad</p>
          </div>
          <div className="admin-actions">
            <button className="admin-btn" onClick={exportarOrdenes}>Exportar CSV</button>
            <Link to="/" className="btn-principal">🏠 Ir al Sitio</Link>
          </div>
        </div>

        <div className="admin-filters">
          <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
            Rango
            <select value={rango} onChange={(e)=>setRango(e.target.value)}>
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
            </select>
          </label>
        </div>

        {/* KPIs */}
        <div className="admin-stats" style={{ marginTop: 8 }}>
          <div className="admin-stat-card"><h3>{totales.count}</h3><p>Pedidos totales</p></div>
          <div className="admin-stat-card"><h3>{CLP(totales.total)}</h3><p>Ingresos (todos)</p></div>
          <div className="admin-stat-card"><h3>{totales.pagado}</h3><p>Pagados</p></div>
          <div className="admin-stat-card"><h3>{totales.fallido}</h3><p>Fallidos</p></div>
        </div>

        {/* Ventas por día */}
        <div className="card-sombra" style={{ padding:16, borderRadius:14, marginBottom:16 }}>
          <h3 style={{ color:'#7c3a2d', marginBottom:8 }}>Ventas por día</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            {ventasPorDia.map(d => (
              <div key={d.fecha} className="card" style={{ padding:12 }}>
                <strong style={{ color:'#7c3a2d' }}>{new Date(d.fecha).toLocaleDateString('es-CL')}</strong>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                  <span>Pedidos:</span>
                  <b>{d.pedidos}</b>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                  <span>Ingresos:</span>
                  <b>{CLP(d.ingresos)}</b>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top productos */}
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th colSpan="4" style={{ textAlign:'left' }}>Top productos más vendidos</th>
              </tr>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {topProductos.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign:'center', color:'#7c3a2d' }}>Sin ventas en el rango</td></tr>
              ) : topProductos.map(p => (
                <tr key={p.codigo}>
                  <td>{p.codigo}</td>
                  <td style={{ color:'#7c3a2d', fontWeight:600 }}>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>{CLP(p.ingresos)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
