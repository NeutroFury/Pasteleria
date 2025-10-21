import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  
    const [loggedIn, setLoggedIn] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si hay un usuario logueado al cargar el componente
        const userLoggedIn = JSON.parse(localStorage.getItem("loggedIn"));
        setLoggedIn(userLoggedIn);
    }, []);

    const handleLogout = () => {
        // Solo borrar la sesión del usuario, NO todo el localStorage
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("carrito");
        navigate('/login'); // Usar navigate en lugar de window.location
        setLoggedIn(null);
    };

  return (
    <>
      <main>
        {/* Banner principal */}
        <section className="banner">
          <div className="banner-info">
            <h1>TIENDA ONLINE</h1>
            <p>
              Descubre nuestras tortas y productos de repostería para todas las
              ocasiones. ¡Haz tu pedido en línea!
            </p>
            <NavLink to="/productos" className="btn-principal">🍰 Ver productos</NavLink>
          </div>
          <div className="banner-img">
            <img
              src="img/Logo emprendimiento reposteria beige.png"
              alt="Productos destacados"
              width="400"
              height="auto"
            />
          </div>
        </section>

        {/* Grilla de productos destacados */}
        <section className="productos-destacados">
          <h2 className="titulo-productos">Productos destacados</h2>
          <div className="productos-grid">
            <div className="producto">
              <img
                src="img/Pastel_1.png"
                width="200"
                height="200"
                alt="Producto 1"
              />
              <a href="#"><h3>Torta Chocolate</h3></a>
              <p>Bizcocho húmedo, relleno de ganache.</p>
              <span>$45.000</span>
            </div>

            <div className="producto">
              <img
                src="img/Pastel_2.png"
                width="200"
                height="200"
                alt="Producto 2"
              />
              <a href="#"><h3>Torta Cuadrada de Frutas</h3></a>
              <p>
                Una mezcla de frutas frescas y crema chantilly sobre un suave
                bizcocho de vainilla.
              </p>
              <span>$50.000</span>
            </div>

            <div className="producto">
              <img
                src="img/Pastel_3.png"
                width="200"
                height="200"
                alt="Producto 3"
              />
              <a href="#"><h3>Torta Circular de Vainilla</h3></a>
              <p>
                Bizcocho de vainilla clásico relleno con crema pastelera y
                cubierto con un glaseado dulce.
              </p>
              <span>$40.000</span>
            </div>

            <div className="producto">
              <img
                src="img/Pastel_4.png"
                width="200"
                height="200"
                alt="Producto 4"
              />
              <a href="#"><h3>Torta Circular de Manjar</h3></a>
              <p>
                Postre individual cremoso y suave, hecho con chocolate de alta
                calidad.
              </p>
              <span>$42.000</span>
            </div>
          </div>
        </section>
      </main>

    </>
  );
}