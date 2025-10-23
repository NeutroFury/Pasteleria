import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';

export default function AdminUsuarios() {

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
          <div>
            <Link to="/admin-nuevo-usuario" className="btn-principal">Nuevo Usuario</Link>
            <Link to="/" className="btn-principal">🏠 Ir al Sitio</Link>
          </div>
        </div>
        
        <div className="admin-filters">
          <input type="text" id="searchInput" placeholder="Buscar usuarios..." />
          <select id="statusFilter">
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
          <select id="typeFilter">
            <option value="">Todos los tipos</option>
            <option value="cliente">Clientes</option>
            <option value="admin">Administradores</option>
          </select>
        </div>
        
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
            <tbody id="usersTableBody">
              {/* Los usuarios se cargarán dinámicamente */}
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