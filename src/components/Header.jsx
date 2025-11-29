import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const [userName, setUserName] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLogged(true);
        try {
          const me = await api.me();
          setUserName(me?.nombre || me?.username || localStorage.getItem('userName') || '');
        } catch {
          setUserName(localStorage.getItem('userName') || '');
        }
      } else {
        setIsLogged(localStorage.getItem('isLoggedIn') === 'true');
        setUserName(localStorage.getItem('userName') || '');
      }
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

  // Contador de productos en el carrito
  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const cart = await api.getCart();
          if (Array.isArray(cart?.items)) {
            const total = cart.items.reduce((s, it) => s + (Number(it.cantidad || it.quantity || it.qty) || 0), 0);
            setCartCount(total);
            return;
          }
        } catch {
          // fallback to localStorage
        }
      }
      try {
        const raw = localStorage.getItem('carrito');
        const arr = raw ? JSON.parse(raw) : [];
        if (Array.isArray(arr)) {
          const total = arr.reduce((sum, it) => sum + (Number(it.cantidad) || 1), 0);
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };
    loadCart();
    const onChanged = () => loadCart();
    window.addEventListener('carrito-changed', onChanged);
    window.addEventListener('storage', onChanged);
    return () => {
      window.removeEventListener('carrito-changed', onChanged);
      window.removeEventListener('storage', onChanged);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-changed'));
  };

  return (
    <header>
      <div className="logo">
  <img src={`${(process.env.PUBLIC_URL || '').replace(/\/$/,'')}/img/Logo emprendimiento reposteria beige.png`} alt="Logo Pastelería" className="logo-img" />
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
              <li id="cartLink">
                <NavLink to="/carrito" className="cart" aria-label={`Carrito con ${cartCount} productos`}>
                  🛒 Carrito
                  <span className="cart-badge" aria-hidden="true">{cartCount}</span>
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: '#7c3a2d' }}>Bienvenido {userName}</span>
              </li>
              <li>
                <NavLink to="/carrito" className="cart" aria-label={`Carrito con ${cartCount} productos`}>
                  🛒 Carrito
                  <span className="cart-badge" aria-hidden="true">{cartCount}</span>
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-header">
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
