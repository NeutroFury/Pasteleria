import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';

export default function AdminProductos() {
  return (
    <div className="admin-container">
      <nav className="admin-sidebar">
        <div className="admin-logo">
          <h2 style={{ margin: 0, fontFamily: "'Pacifico', cursive" }}>Pastelería Mil Sabores</h2>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>Panel Administrador</p>
        </div>
        
        <ul className="admin-nav">
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin-productos" className="active">Productos</Link></li>
          <li><Link to="/admin-usuarios">Usuarios</Link></li>
        </ul>
      </nav>
      
      <main className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Gestión de Productos</h1>
            <p>Administra el catálogo de productos de la pastelería</p>
          </div>
          <div>
            <Link to="/admin-nuevo-producto" className="btn-principal">Nuevo Producto</Link>
            <Link to="/" className="btn-principal">🏠 Ir al Sitio</Link>
          </div>
        </div>
        
        <div className="admin-filters">
          <input type="text" id="searchInput" placeholder="Buscar productos..." />
          <select id="categoryFilter">
            <option value="">Todas las categorías</option>
            <option value="pasteles">Pasteles</option>
            <option value="tortas">Tortas</option>
            <option value="postres">Postres</option>
            <option value="especiales">Especiales</option>
          </select>
          <select id="statusFilter">
            <option value="">Todos los estados</option>
            <option value="disponible">Disponibles</option>
            <option value="agotado">Agotados</option>
            <option value="descontinuado">Descontinuados</option>
          </select>
        </div>
        
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="productsTableBody">
              {/* Los productos se cargarán dinámicamente */}
            </tbody>
          </table>
        </div>
        
        <div className="admin-pagination" id="pagination">
          {/* La paginación se generará dinámicamente */}
        </div>
      </main>
    </div>
  );
}