import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header(/* props si los tienes */) {
  const [isLogged, setIsLogged] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadAuth = () => {
      setIsLogged(localStorage.getItem('isLoggedIn') === 'true');
      setUserName(localStorage.getItem('userName') || '');
    };
    loadAuth();
    const onStorage = () => loadAuth();
    const onAuthChanged = () => loadAuth();
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth-changed', onAuthChanged);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-changed', onAuthChanged);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event('auth-changed'));
  };

  return (
    <header>
      <div className="logo">
        <img src="/img/Logo emprendimiento reposteria beige.png" alt="Logo Pastelería" className="logo-img" />
        <h2 className="estiloEncabezado">Pastelería Mil Sabores</h2>
      </div>

      <nav>
        <ul className="lista">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/productos">Productos</NavLink></li>
          <li><NavLink to="/ofertas">Ofertas</NavLink></li>
          <li><NavLink to="/nosotros">Nosotros</NavLink></li>
          <li><NavLink to="/contacto">Contacto</NavLink></li>
          <li><NavLink to="/blogs">Blog</NavLink></li>
          <li><NavLink to="/admin">Admin</NavLink></li>
        </ul>
      </nav>

      <nav>
        <ul className="login_register">
          {!isLogged ? (
            <>
              <li><NavLink to="/login">Iniciar sesión</NavLink></li>
              <li><NavLink to="/registro">Registrar usuario</NavLink></li>
              <li id="cartLink"><NavLink to="/carrito" className="cart">🛒 Carrito (0)</NavLink></li>
            </>
          ) : (
            <>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#7c3a2d' }}>Bienvenido {userName}</span>
              </li>
              <li>
                <NavLink to="/carrito" className="cart">🛒 Carrito</NavLink>
              </li>
              <li>
                <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #7c3a2d', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>
                  Cerrar sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
