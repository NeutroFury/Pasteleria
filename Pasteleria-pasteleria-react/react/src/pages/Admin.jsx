import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';

export default function Admin() {
  useEffect(() => {
    // Añade clase al body para ocultar header/footer desde CSS
    document.body.classList.add('no-layout');
    return () => {
      document.body.classList.remove('no-layout');
    };
  }, []);

  return (
    <div className="admin-container">
      <nav className="admin-sidebar">
        <div className="admin-logo">
          <h2 style={{ margin: 0, fontFamily: "'Pacifico', cursive" }}>Pastelería Mil Sabores</h2>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>Panel Administrador</p>
        </div>

        <ul className="admin-nav">
          <li><Link to="/admin" className="active">Dashboard</Link></li>
          <li><Link to="/admin-productos">Productos</Link></li>
          <li><Link to="/admin-usuarios">Usuarios</Link></li>
        </ul>
      </nav>

      <main className="admin-content">
        <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Dashboard</h1>
            <p>¡HOLA Administrador!</p>
          </div>
          <div>
            <Link to="/" className="btn-principal">🏠 Ir al Sitio</Link>
          </div>
        </div>

        <div className="admin-stats" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="admin-stat-card">
            <h3 id="total-products">0</h3>
            <p>Productos Totales</p>
          </div>
          <div className="admin-stat-card">
            <h3 id="total-users">0</h3>
            <p>Usuarios Registrados</p>
          </div>
          <div className="admin-stat-card">
            <h3 id="total-orders">0</h3>
            <p>Pedidos Totales</p>
          </div>
          <div className="admin-stat-card">
            <h3 id="total-revenue">$0</h3>
            <p>Ingresos Totales</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ color: '#7c3a2d', marginBottom: '1rem' }}>Bienvenido al Panel de Administración</h3>
          <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
            Desde aquí puedes gestionar productos, usuarios, pedidos y más.
            <br />Selecciona una opción del menú lateral para comenzar.
          </p>
        </div>
      </main>
    </div>
  );
}
