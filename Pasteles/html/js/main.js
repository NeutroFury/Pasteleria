document.addEventListener("DOMContentLoaded", () => {
  // Verificar si hay un usuario logueado
  const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const logoutLink = document.getElementById("logoutLink");
  const cartLink = document.getElementById("cartLink");
  const userInfo = document.getElementById("userInfo");
  const userName = document.getElementById("userEmail");

  if (loggedIn) {
    // Si el usuario está logueado, ocultamos los enlaces "Iniciar sesión" y "Registrar usuario"
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    logoutLink.style.display = "block"; // Mostrar "Cerrar sesión"
    cartLink.style.display = "block"; // Mostrar "Carrito"
    userInfo.style.display = "block"; // Mostrar la información del usuario
    userName.textContent = loggedIn.nombre; // Mostrar el nombre del usuario
  } else {
    // Si no está logueado, mostramos los enlaces "Iniciar sesión" y "Registrar usuario"
    loginLink.style.display = "block";
    registerLink.style.display = "block";
    logoutLink.style.display = "none";
    cartLink.style.display = "none";
    userInfo.style.display = "none"; // Ocultar la información del usuario
  }

  // Lógica para cerrar sesión
  document.getElementById("logoutLink")?.addEventListener("click", () => {
    localStorage.clear(); // Limpiar todos los datos almacenados en localStorage
    window.location.href = "login.html"; // Redirigir a login después de cerrar sesión
  });
});
