/**
 * 🧾 Archivo de lógica pura para el componente Login.
 * Ubicación sugerida: src/utils/Login.logic.js  
 * * Este archivo debe ser importado en el componente React antes de su uso .
 */

(function () {
  // Evitar redeclaración de funciones globales  
  if (window.LoginLogic) {
    return;
  }

  // Contenedor de la lógica del componente  
  window.LoginLogic = {};

  /**
   * 💬  
   * Maneja el envío del formulario de login (handleSubmit).
   * Carga usuarios desde localStorage, valida las credenciales,
   * guarda la sesión, dispara un evento de 'auth-changed' y
   * redirige al usuario.
   *
   * @param {Event} e - El evento del formulario (para e.preventDefault()).
   * @param {string} email - El email ingresado por el usuario.
   * @param {string} password - La contraseña ingresada por el usuario.
   * @param {object} location - El objeto 'location' de react-router-dom.
   * @param {function} navigate - La función 'navigate' de react-router-dom.
   * @param {function} setMsg - El 'setter' de estado de React para mostrar mensajes.
   */
  window.LoginLogic.handleLoginSubmit = function (
    e,
    email,
    password,
    location,
    navigate,
    setMsg
  ) {
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
})();