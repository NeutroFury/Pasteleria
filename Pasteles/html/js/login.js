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
      // Calcular si hoy es su cumpleaños y es estudiante Duoc
      const hoy = new Date();
      let freeCakeEligibleToday = false;
      const isDuocStudent = !!usuario.email && usuario.email.endsWith("@duocuc.cl");
      if (isDuocStudent && usuario.fechaNacimiento) {
        const [anioN, mesN, diaN] = usuario.fechaNacimiento.split("-");
        if (hoy.getDate() === parseInt(diaN, 10) && (hoy.getMonth() + 1) === parseInt(mesN, 10)) {
          freeCakeEligibleToday = true;
        }
      }

      // Guardar sesion con todos los flags
      localStorage.setItem("loggedIn", JSON.stringify({
        nombre: usuario.nombre,
        email: usuario.email,
        hasLifetime10: !!usuario.hasLifetime10,
        isDuocStudent,
        fechaNacimiento: usuario.fechaNacimiento || null,
        freeCakeEligibleToday
      }));
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
