import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import userService from '../data/userService';

function fmtDate(iso) {
  try { return new Date(iso).toLocaleString('es-CL'); } catch { return iso || ''; }
}

function StatusPill({ estado }) {
  const cls = estado === 'activo' ? 'status-badge status-active' : 'status-badge status-inactive';
  return <span className={cls} style={{ textTransform: 'capitalize' }}>{estado}</span>;
}

function UserForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(() => initial || {
    nombre: '', email: '', password: '', rol: 'cliente', estado: 'activo', telefono: ''
  });
  const isEdit = !!initial;
  const change = (e) => {
    const { name, value } = e.target;
    setF((prev) => ({ ...prev, [name]: value }));
  };
  const submit = (e) => {
    e.preventDefault();
    if (!f.email || !f.nombre) { alert('Nombre y Email son obligatorios'); return; }
    onSave(f);
  };
  return (
    <form onSubmit={submit} className="admin-form">
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>{isEdit ? 'Editar usuario' : 'Nuevo usuario'}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div>
          <label>Nombre</label>
          <input name="nombre" value={f.nombre} onChange={change} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={f.email} onChange={change} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="text" name="password" value={f.password} onChange={change} placeholder={isEdit ? '(sin cambio)' : ''} />
        </div>
        <div>
          <label>Rol</label>
          <select name="rol" value={f.rol} onChange={change}>
            <option value="cliente">cliente</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div>
          <label>Estado</label>
          <select name="estado" value={f.estado} onChange={change}>
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
        </div>
        <div>
          <label>Teléfono</label>
          <input name="telefono" value={f.telefono} onChange={change} />
        </div>
      </div>
      <div className="admin-actions" style={{ marginTop: 4 }}>
        <button type="submit" className="admin-btn">{isEdit ? 'Guardar cambios' : 'Crear usuario'}</button>
        <button type="button" onClick={onCancel} className="admin-btn-secondary">Cancelar</button>
      </div>
    </form>
  );
}

export default function AdminUsuarios() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [rol, setRol] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [histUser, setHistUser] = useState(null); // vista de historial (stub)
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = () => setItems(userService.getAll());
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = String(search).toLowerCase().trim();
    return (items || []).filter((u) => {
      const okQ = !q || u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const okE = !estado || u.estado === estado;
      const okR = !rol || u.rol === rol;
      return okQ && okE && okR;
    });
  }, [items, search, estado, rol]);

  const totalPages = Math.max(1, Math.ceil((filtered.length || 0) / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => { setPage(1); }, [search, estado, rol]);

  const createClick = () => { setEditing(null); setShowForm(true); };
  const editClick = (u) => { setEditing(u); setShowForm(true); };
  const deleteClick = (u) => {
    if (window.confirm('¿Eliminar usuario?')) { userService.remove(u.id); load(); }
  };
  const toggleEstado = (u) => { userService.toggleEstado(u.id); load(); };
  const onSave = (data) => {
    try {
      if (editing) userService.update(editing.id, data); else userService.create(data);
      setShowForm(false); setEditing(null); load();
    } catch (e) { alert(e.message || 'Error al guardar'); }
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
          <li><Link to="/admin-usuarios" className="active">Usuarios</Link></li>
        </ul>
      </nav>
      
      <main className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Gestión de Usuarios</h1>
            <p>Administra los usuarios registrados en el sistema</p>
          </div>
          <div className="admin-actions">
            <button onClick={createClick} className="admin-btn">Nuevo Usuario</button>
            <Link to="/" className="btn-principal">🏠 Ir al Sitio</Link>
          </div>
        </div>

        {showForm && (
          <UserForm initial={editing} onSave={onSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
        )}

        {/* Filtros */}
        <div className="admin-filters">
          <input type="text" placeholder="Buscar usuarios..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="cliente">Clientes</option>
            <option value="admin">Administradores</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#7c3a2d' }}>No hay usuarios</td></tr>
              ) : paged.map((u) => (
                <tr key={u.id}>
                  <td title={u.id}>{String(u.id).slice(-6)}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td style={{ textTransform: 'capitalize' }}>{u.rol}</td>
                  <td><StatusPill estado={u.estado} /></td>
                  <td>{fmtDate(u.fechaRegistro)}</td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="admin-action-btn is-edit" onClick={() => editClick(u)}>Editar</button>
                      <button type="button" className="admin-action-btn is-toggle" onClick={() => toggleEstado(u)}>{u.estado === 'activo' ? 'Desactivar' : 'Activar'}</button>
                      <button type="button" className="admin-action-btn is-history" onClick={() => setHistUser(u)}>Historial</button>
                      <button type="button" className="admin-action-btn is-delete" onClick={() => deleteClick(u)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="admin-pagination" style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
          <button className="admin-btn-secondary" disabled={currentPage <= 1} onClick={() => setPage((p)=>Math.max(1,p-1))}>Anterior</button>
          <span>Página {currentPage} de {totalPages}</span>
          <button className="admin-btn-secondary" disabled={currentPage >= totalPages} onClick={() => setPage((p)=>Math.min(totalPages,p+1))}>Siguiente</button>
        </div>

        {/* Historial de compras (stub) */}
        {histUser && (
          <div className="card-sombra" style={{ marginTop: 16, padding: 16, borderRadius: 12, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Historial de compras — {histUser.nombre} &lt;{histUser.email}&gt;</h3>
              <button className="admin-btn-secondary" onClick={() => setHistUser(null)}>Cerrar</button>
            </div>
            <p style={{ marginTop: 8, opacity: .8 }}>Aún no hay compras registradas para este usuario.</p>
          </div>
        )}
      </main>
    </div>
  );
}