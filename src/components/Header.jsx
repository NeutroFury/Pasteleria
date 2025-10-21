import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// Función para obtener los datos del usuario logueado desde localStorage
const getLoggedInUser = () => {
  const loggedIn = localStorage.getItem("loggedIn");
  // Devuelve el objeto del usuario o null si no hay sesión
  return loggedIn ? JSON.parse(loggedIn) : null;
};

export default function Header() {
  // 1. Estado para almacenar la información del usuario
  const [user, setUser] = useState(getLoggedInUser()); const navigate = useNavigate();

  // 2. useEffect para re-verificar la sesión al montar el componente (y quizás si cambia el storage)
  useEffect(() => {
    // Esto asegura que si la sesión se establece/elimina en otra pestaña, este componente se actualice.
    const handleStorageChange = () => {
      setUser(getLoggedInUser());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup: remover el listener al desmontar el componente
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 3. Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Eliminar la sesión del localStorage
    localStorage.removeItem("loggedIn"); 
    // Opcional: Eliminar el carrito al cerrar sesión
    // localStorage.removeItem("carrito"); 
    
    // Limpiar el estado del usuario para forzar la re-renderización y mostrar los enlaces de login
    setUser(null); 
    
    // Redirigir a la página de inicio de sesión o a Home (asumiendo que /login es la ruta)
    navigate("/login"); 
  };

  // 4. Renderizado Condicional de los enlaces de autenticación
  const authLinks = user ? (
    // ESTADO LOGUEADO
    <ul className="login_register">
      {/* Información del Usuario (reemplaza userInfo y userEmail) */}
      <div id="userInfo" style={{ fontSize: "1.2rem", color: "#7c3a2d", marginRight: "15px" }}>
        <span>¡Hola, <span id="userEmail">{user.nombre}</span>!</span>
      </div>
      
      {/* Enlace al Carrito */}
      <NavLink to="/carrito" className="cart">🛒 Carrito (0)</NavLink>
      
      {/* Enlace de Cerrar Sesión */}
      {/* Usamos un <a> simple o una NavLink con un manejador onClick, no una ruta real */}
      <a 
        href="#" 
        onClick={handleLogout} 
        style={{ cursor: 'pointer', marginLeft: '10px', color: '#7c3a2d' }}
      >
        Cerrar sesión
      </a>
    </ul>
  ) : (
    // ESTADO NO LOGUEADO
    <ul className="login_register">
      {/* Iniciar Sesión */}
      <NavLink to="/login">Iniciar sesión</NavLink>
      
      {/* Registrar Usuario */}
      <NavLink to="/registro">Registrar usuario</NavLink>
      
      {/* Enlace al Carrito (Visible o no, depende de si permites compras sin login) */}
      {/* Lo dejamos oculto si no está logueado, según tu JS original, o lo muestras si permites Guest Checkout */}
      {/* Por simplicidad, mantenemos la visibilidad de Carrito solo para usuarios logueados, quitándolo de este bloque */}
    </ul>
  );


  return (
    <>
      <header>
        <div className="logo">
          <img
            src="img/Logo emprendimiento reposteria beige.png"
            alt="Logo Pastelería"
            className="logo-img"
          />
          <h2 className="estiloEncabezado">Pastelería Mil Sabores</h2>
        </div>

        <nav>
          <ul className="lista"> 
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/productos">Productos</NavLink>
            <NavLink to="/nosotros">Nosotros</NavLink>
            <NavLink to="/contacto">Contacto</NavLink>
            <NavLink to="/blogs">Blog</NavLink>
          </ul>
        </nav>

        {/* 5. Insertar el bloque de navegación condicional */}
        <nav>
            {authLinks}
        </nav>

        {/* NOTA: Eliminamos el div#userInfo duplicado del final ya que ahora se gestiona dentro de authLinks */}
      </header>
    </>
  );
}