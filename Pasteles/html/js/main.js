document.addEventListener("DOMContentLoaded", () => {
  // Asegurar que siempre exista el usuario admin con la contraseña correcta
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const adminIndex = usuarios.findIndex(user => user.email === "admin@admin.com");
  
  if (adminIndex > -1) {
    // Actualizar el admin existente - manejar diferentes formatos
    usuarios[adminIndex].clave = "asdasd";
    usuarios[adminIndex].password = "asdasd";
    usuarios[adminIndex].nombre = "admin";
    usuarios[adminIndex].hasLifetime10 = false;
    usuarios[adminIndex].isDuocStudent = false;
    usuarios[adminIndex].fechaNacimiento = null;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  } else {
    // Crear admin si no existe
    usuarios.unshift({
      nombre: "admin",
      email: "admin@admin.com",
      clave: "asdasd",
      password: "asdasd",
      hasLifetime10: false,
      isDuocStudent: false,
      fechaNacimiento: null
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  // Verificar si hay un usuario logueado
  const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const logoutLink = document.getElementById("logoutLink");
  const cartLink = document.getElementById("cartLink");
  const adminLink = document.getElementById("adminLink");
  const userInfo = document.getElementById("userInfo");
  const userName = document.getElementById("userEmail");

  if (loggedIn) {
    // Si el usuario está logueado, ocultamos los enlaces "Iniciar sesión" y "Registrar usuario"
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    logoutLink.style.display = "block"; // Mostrar "Cerrar sesión"
    cartLink.style.display = "block"; // Mostrar "Carrito"
    adminLink.style.display = "block"; // Mostrar "Admin"
    userInfo.style.display = "block"; // Mostrar la información del usuario
    userName.textContent = loggedIn.nombre; // Mostrar el nombre del usuario
  } else {
    // Si no está logueado, mostramos los enlaces "Iniciar sesión" y "Registrar usuario"
    loginLink.style.display = "block";
    registerLink.style.display = "block";
    logoutLink.style.display = "none";
    cartLink.style.display = "none";
    adminLink.style.display = "none";
    userInfo.style.display = "none"; // Ocultar la información del usuario
  }

  // Lógica para cerrar sesión
  document.getElementById("logoutLink")?.addEventListener("click", () => {
    // Solo borrar los datos de sesión, mantener el carrito y otros datos
    localStorage.removeItem("loggedIn"); // Solo borrar la sesión del usuario
    window.location.href = "login.html"; // Redirigir a login después de cerrar sesión
  });
});