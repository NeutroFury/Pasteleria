document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-clave");
  const errorMsg = document.getElementById("error-msg");

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevenir el envío del formulario por defecto

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Obtener la lista de usuarios de localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar al usuario con el correo y contraseña ingresados
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
      // Si el usuario existe, lo guardamos como "loggeado" en localStorage
      localStorage.setItem("loggedIn", JSON.stringify({ nombre: usuario.nombre, email: usuario.email }));
      window.location.href = "index.html"; // Redirigir al home
    } else {
      // Si no coincide el usuario, mostrar error
      errorMsg.style.display = "block";
    }
  });

  // Verificar si el usuario ya está logueado
  const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  if (loggedIn) {
    window.location.href = "index.html"; // Redirigir al home si ya está logueado
  }
});
