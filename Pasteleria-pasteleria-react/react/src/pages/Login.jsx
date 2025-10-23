import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg('');

    // Cargar usuarios (si existen) desde localStorage
    let usuarios = [];
    try {
      const raw = localStorage.getItem('usuarios');
      usuarios = raw ? JSON.parse(raw) : [];
    } catch {
      usuarios = [];
    }

    // Validar contra usuarios guardados; si no hay, permitir login para pruebas
    let usuarioOk = null;
    if (Array.isArray(usuarios) && usuarios.length > 0) {
      usuarioOk = usuarios.find(
        (u) =>
          u?.email?.toLowerCase?.() === email.toLowerCase() &&
          u?.password === password
      );
      if (!usuarioOk) {
        setMsg('Correo o contraseña incorrectos.');
        return;
      }
    }

    const nombre = usuarioOk?.nombre || email.split('@')[0] || 'Usuario';

    // Guardar sesión
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', nombre);
    localStorage.setItem('userEmail', email);

    // Notificar al Header (sin cambiar estilos)
    window.dispatchEvent(new Event('auth-changed'));

    // Redirigir a la ruta previa o al inicio
    const to = location.state?.from || '/';
    navigate(to);
  };

  return (
    <main>
      <div className="login-container">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="email@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div id="mensajes">
            {msg && <div className="mi-alerta-error">{msg}</div>}
          </div>

          <button type="submit" className="colorBoton1">Ingresar</button>
        </form>
      </div>
    </main>
  );
}