import {Link, NavLink} from 'react-router-dom';

export default function Header() {
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
            {/* <li><a href="index.html">Home</a></li> */}
            <NavLink to="/">Home</NavLink>
            {/* <li><a href="productos.html">Productos</a></li> */}
            <NavLink to="/productos">Productos</NavLink>
            {/* <li><a href="nosotros.html">Nosotros</a></li> */}
            <NavLink to="/nosotros">Nosotros</NavLink>
            {/* <li><a href="contacto.html">Contacto</a></li> */}
            <NavLink to="/contacto">Contacto</NavLink>
            {/* <li><a href="blogs.html">Blog</a></li> */}
            <NavLink to="/blogs">Blog</NavLink>
          </ul>
        </nav>

        <nav>
          <ul className="login_register">
            {/* Mostrar "Iniciar sesión" y "Registrar usuario" si el usuario no está logueado */}
            {/* <li id="loginLink"><a href="login.html">Iniciar sesión</a></li> */}
            <NavLink to="/login">Iniciar sesión</NavLink>
            <li id="registerLink">
              {/* <a href="registro.html">Registrar usuario</a> */}
            <NavLink to="/registro">Registrar usuario</NavLink>
            </li>

            {/* Mostrar "Cerrar sesión" y "Carrito" si el usuario está logueado */}
            <li id="logoutLink" style={{ display: "none" }}>
              <a href="javascript:void(0)" id="logoutLink">Cerrar sesión</a>
            </li>
            <li id="cartLink" style={{ display: "none" }}>
              <a href="carrito.html" className="cart">🛒 Carrito (0)</a>
            </li>
          </ul>
        </nav>

        {/* Mostrar el nombre del usuario si está logueado */}
        <div
          id="userInfo"
          style={{ display: "none", fontSize: "1.2rem", color: "#7c3a2d" }}
        >
          <span>Bienvenid@, <span id="userEmail"></span></span>
        </div>
      </header>
      </>
    )};