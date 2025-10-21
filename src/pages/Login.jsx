import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================
// SISTEMA DE LOGIN - PASTELERÍA MIL SABORES
// ============================================

export default function Login() {
  // 1. Estados para los campos del formulario y el mensaje de error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  // Hook para la navegación
  const navigate = useNavigate();

  // 2. Lógica de redirección inicial si ya está logueado (similar a DOMContentLoaded)
  useEffect(() => {
    // Obtener información de sesión del localStorage
    const loggedIn = localStorage.getItem("loggedIn");

    // Si ya hay una sesión, redirigir al home
    if (loggedIn) {
      // Usar navigate en lugar de window.location.href
      navigate("/"); 
    }
  }, [navigate]); // Dependencia: navigate (para buenas prácticas de React)

  // 3. Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar la recarga de página por el formulario

    // Limpiar el error anterior
    setError(false);

    // Obtener usuarios registrados del localStorage
    // Asumimos que 'usuarios' es un array de objetos con { email, password, nombre }
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar usuario con email y contraseña correctos
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
      // Login exitoso: crear sesión y redirigir
      const sessionData = { nombre: usuario.nombre, email: usuario.email };
      localStorage.setItem("loggedIn", JSON.stringify(sessionData));
      
      // Redirigir al home (o donde necesites, 'index.html' se convierte en '/')
      navigate("/"); 
    } else {
      // Login fallido: mostrar mensaje de error
      setError(true);
    }
  };

  return(
    <>
      <main>
        <div className="login-container">
          <h2>Iniciar Sesión</h2>
          {/* 4. Usar onSubmit y enlazar inputs con onChange y value */}
          <form id="formLogin" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Correo electrónico</label>
              <input 
                type="email" 
                id="login-email" 
                required 
                value={email} // Estado enlazado
                onChange={(e) => setEmail(e.target.value)} // Actualizar estado
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-clave">Contraseña</label>
              <input 
                type="password" 
                id="login-clave" 
                required 
                value={password} // Estado enlazado
                onChange={(e) => setPassword(e.target.value)} // Actualizar estado
              />
            </div>
            <button type="submit" className="colorBoton1">
              Ingresar
            </button>
          </form>
          {/* 5. Mostrar el mensaje de error condicionalmente basado en el estado 'error' */}
          {error && (
            <div id="error-msg" style={{ color: "red", display: "block" }}>
              <p>Correo o contraseña incorrectos</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}