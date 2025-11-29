import '../utils/Admin-Productos.logic.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import productService from "../data/productService";


function ProductoForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(() => initial || {
    codigo: '',
    nombre: '',
    categoria: '',
    precio: 0,
    descripcion: '',
    img: '',
    descuento: 0,
    stock: 0,
    estado: 'disponible',
  });
  const isEdit = !!initial;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'precio' || name === 'descuento' || name === 'stock' ? Number(value) : value }));
  };

  //
  //  REFACTORIZAR 'submit' PARA USAR EL VALIDADOR
  //
  const submit = (e) => {
    e.preventDefault();
    //
    // REFACTOR: Usar la lógica de validación externa
    const error = window.AdminProductosLogic.validateProductoForm(form);
    if (error) {
      alert(error);
      return;
    }
    //
    /* LÍNEAS ORIGINALES ELIMINADAS:
    if (!form.codigo.trim() || !form.nombre.trim() || !form.categoria.trim()) {
      alert('Completa al menos: código, nombre y categoría');
      return;
    }
    if (isNaN(Number(form.precio)) || Number(form.precio) < 0) {
      alert('Precio inválido');
      return;
    }
    */
    onSave({ ...form, codigo: form.codigo.trim() });
  };
  //

  return (
    <form onSubmit={submit} className="admin-form">
      {/* ...el resto del JSX de ProductoForm no cambia... */}
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>{isEdit ? 'Editar producto' : 'Nuevo producto'}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div>
          <label>Código</label>
          <input name="codigo" value={form.codigo} onChange={handleChange} required disabled={isEdit} />
        </div>
        <div>
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div>
          <label>Categoría</label>
          <input name="categoria" value={form.categoria} onChange={handleChange} required />
        </div>
        <div>
          <label>Precio</label>
          <input type="number" min="0" step="1" name="precio" value={form.precio} onChange={handleChange} />
        </div>
        <div>
          <label>Descuento (%)</label>
          <input type="number" min="0" max="100" step="1" name="descuento" value={form.descuento} onChange={handleChange} />
        </div>
        <div>
          <label>Stock</label>
          <input type="number" min="0" step="1" name="stock" value={form.stock} onChange={handleChange} />
        </div>
        <div>
          <label>Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="disponible">disponible</option>
            <option value="agotado">agotado</option>
            <option value="descontinuado">descontinuado</option>
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Imagen (ruta)</label>
          <input name="img" value={form.img} onChange={handleChange} placeholder="img/archivo.png" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} />
        </div>
      </div>
      <div className="admin-actions" style={{ marginTop: 4 }}>
        <button type="submit" className="admin-btn">{isEdit ? 'Guardar cambios' : 'Crear producto'}</button>
        <button type="button" onClick={onCancel} className="admin-btn-secondary">Cancelar</button>
      </div>
    </form>
  );
}

export default function AdminProductos() {
  //
  // ELIMINAR LÓGICA INTERNA (resolveImg)
  /*
  const resolveImg = (src) => {
    if (!src) return '';
    if (/^https?:\/\//i.test(src) || /^data:/i.test(src)) return src;
    const s = String(src).replace(/^\/+/, '');
    const prefix = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    return `${prefix}/${s}` || `/${s}`;
  };
  */
  //

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setItems(productService.getAll());
  }, []);

  //
  // REFACTORIZAR 'useMemo [categorias]'
  //
  const categorias = useMemo(
    // REFACTOR: Usar la lógica externa
    () => window.AdminProductosLogic.getCategorias(items), 
    [items]
  );
  // LÍNEA ORIGINAL ELIMINADA:
  // const categorias = useMemo(() => Array.from(new Set((items || []).map(i => i.categoria))).sort(), [items]);
  //

  //
  // REFACTORIZAR 'useMemo [filtered]'
  //
  const filtered = useMemo(
    // REFACTOR: Usar la lógica externa
    () => window.AdminProductosLogic.filterItems(items, search, category, status),
    [items, search, category, status]
  );
  // LÓGICA ORIGINAL ELIMINADA:
  /*
  const filtered = useMemo(() => {
    const q = String(search).toLowerCase().trim();
    return (items || []).filter((p) => {
      const okSearch = !q || p.codigo.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q);
      const okCategory = !category || p.categoria === category;
      const okStatus = !status || p.estado === status;
      return okSearch && okCategory && okStatus;
    });
  }, [items, search, category, status]);
  */
  //

  const totalPages = Math.max(1, Math.ceil((filtered.length || 0) / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    // Si cambian filtros, reseteamos a página 1
    setPage(1);
  }, [search, category, status]);

  const reload = () => setItems(productService.getAll());

  const onCreateClick = () => {
    setEditing(null);
    setShowForm(true);
  };
  const onEditClick = (p) => {
    setEditing(p);
    setShowForm(true);
  };

  //
  //  REFACTORIZAR 'onDeleteClick'
  //
  const onDeleteClick = (codigo) => {
    // REFACTOR: Usar la lógica externa, pasando las dependencias
    try {
      const eliminado = window.AdminProductosLogic.onDeleteLogic(codigo, window.confirm, productService);
      if (eliminado) {
        reload(); // Recargar solo si se confirmó y eliminó
      }
    } catch (e) {
      alert(e.message || 'Error al eliminar');
    }
  };
  // LÓGICA ORIGINAL ELIMINADA:
  /*
  const onDeleteClick = (codigo) => {
    if (window.confirm('¿Eliminar producto de forma permanente?')) {
      productService.remove(codigo);
      reload();
    }
  };
  */
  //

  //
  // REFACTORIZAR 'onSave'
  //
  const onSave = (data) => {
    try {
      // REFACTOR: Usar la lógica externa, pasando las dependencias
      window.AdminProductosLogic.onSaveLogic(data, editing, productService);
      
      // La lógica de estado de React se mantiene aquí
      setShowForm(false);
      setEditing(null);
      reload();
    } catch (e) {
      alert(e.message || 'Error al guardar');
    }
  };
  // LÓGICA ORIGINAL ELIMINADA:
  /*
  const onSave = (data) => {
    try {
      if (editing) {
        productService.update(editing.codigo, data);
      } else {
        productService.create(data);
      }
      setShowForm(false);
      setEditing(null);
      reload();
    } catch (e) {
      alert(e.message || 'Error al guardar');
    }
  };
  */
  //

  //
  // REFACTORIZAR 'statusPill'
  //
  const statusPill = (estado) => {
    // REFACTOR: Usar la lógica externa
    const c = window.AdminProductosLogic.getStatusPillColors(estado);
    return (
      <span style={{ background: c.bg, color: c.fg, padding: '4px 8px', borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{estado}</span>
    );
  };
  // LÓGICA ORIGINAL ELIMINADA:
  /*
  const statusPill = (estado) => {
    const colors = {
      disponible: { bg: '#e9ffe8', fg: '#0f5d1d' },
      agotado: { bg: '#fff5f5', fg: '#9b2c2c' },
      descontinuado: { bg: '#f5f5f5', fg: '#4a4a4a' },
    };
    const c = colors[estado] || { bg: '#f5f5f5', fg: '#4a4a4a' };
    return (
      <span style={{ background: c.bg, color: c.fg, padding: '4px 8px', borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{estado}</span>
    );
  };
  */
  //

  return (
    <div className="admin-container">
      {/* ...La barra lateral <nav> no cambia... */}
      <nav className="admin-sidebar">
        <div className="admin-logo">
          <h2 style={{ margin: 0, fontFamily: "'Pacifico', cursive" }}>Pastelería Mil Sabores</h2>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>Panel Administrador</p>
        </div>
        <ul className="admin-nav">
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin-productos" className="active">Productos</Link></li>
          <li><Link to="/admin-productos-criticos">Críticos</Link></li>
          <li><Link to="/admin-usuarios">Usuarios</Link></li>
          <li><Link to="/admin-boletas">Boletas</Link></li>
          <li><Link to="/admin-reportes">Reportes</Link></li>
          <li><Link to="/admin-perfil">Perfil</Link></li>
        </ul>
      </nav>
      
      <main className="admin-content">
        {/* ...El <header> no cambia... */}
        <div className="admin-header">
          <div>
            <h1>Gestión de Productos</h1>
            <p>Administra el catálogo de productos de la pastelería</p>
          </div>
          <div className="admin-actions">
            <button onClick={onCreateClick} className="admin-btn">Nuevo Producto</button>
            <Link to="/" className="btn-principal">🏠 Ir al Sitio</Link>
          </div>
        </div>

        {showForm && (
          <ProductoForm initial={editing} onCancel={() => { setShowForm(false); setEditing(null); }} onSave={onSave} />
        )}
        
        {/* ...Los <filters> no cambian... */}
        <div className="admin-filters">
          <input type="text" placeholder="Buscar productos..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="disponible">Disponibles</option>
            <option value="agotado">Agotados</option>
            <option value="descontinuado">Descontinuados</option>
          </select>
        </div>
        
        <div className="admin-table">
          <table>
            <thead>
              {/* ...El <thead> no cambia... */}
              <tr>
                <th>Código</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/*
              //
              // REFACTORIZAR LLAMADAS EN EL RENDER
              //
              */}
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#7c3a2d' }}>No hay productos</td>
                </tr>
              ) : paged.map((p) => (
                <tr key={p.codigo}>
                  <td>{p.codigo}</td>
                  <td>
                    {/* REFACTOR: Llamar a la lógica externa */}
                    {p.img ? <img src={window.AdminProductosLogic.resolveImg(p.img)} alt={p.nombre} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} /> : <span style={{ opacity: .6 }}>Sin imagen</span>}
                  </td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>
                    {/* REFACTOR: Llamar a la lógica externa */}
                    {window.AdminProductosLogic.CLP(p.descuento ? Math.round(Number(p.precio) * (1 - Number(p.descuento)/100)) : p.precio)}
                  </td>
                  <td>{p.stock ?? 0}</td>
                  <td>{statusPill(p.estado)}</td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="admin-action-btn is-edit" onClick={() => onEditClick(p)}>Editar</button>
                      <button type="button" className="admin-action-btn is-delete" onClick={() => onDeleteClick(p.codigo)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* ...La <pagination> no cambia... */}
        <div className="admin-pagination" id="pagination" style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
          <button disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="admin-btn-secondary">Anterior</button>
          <span>Página {currentPage} de {totalPages}</span>
          <button disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="admin-btn-secondary">Siguiente</button>
        </div>
      </main>
    </div>
  );
}