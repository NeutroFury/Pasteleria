document.addEventListener("DOMContentLoaded", () => {
  const formRegistro = document.getElementById("formRegistro");
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-clave");
  const errorMsg = document.getElementById("error-msg");

  // Obtener los elementos del formulario
  const nombreInput = document.getElementById("nombre");
  const edadInput = document.getElementById("edad");
  const clave1Input = document.getElementById("clave1");
  const clave2Input = document.getElementById("clave2");
  const codigoInput = document.getElementById("codigo");
  const fechaNacimientoInput = document.getElementById("fechaNacimiento");
  const mensajesDiv = document.getElementById("mensajes");

  // Si ya existe un array de usuarios en localStorage, lo obtenemos
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevenir el envío del formulario por defecto

    // Obtener los valores del formulario
    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const edad = parseInt(edadInput.value);
    const clave1 = clave1Input.value.trim();
    const clave2 = clave2Input.value.trim();
    const codigo = codigoInput.value.trim();
    const fechaNacimiento = fechaNacimientoInput.value;

    // Variables para los mensajes
    let errores = [];
    let mensajeDescuento = "";
    let mensajeCorreo = "";

    // Validar nombre
    if (nombre === "") {
      errores.push("El nombre no puede estar vacío.");
    }

    // Validar email
    if (!email.includes("@")) {
      errores.push("El correo electrónico no es válido.");
    } else if (email.endsWith("@duocuc.cl")) {
      // Verificar si hoy es el cumpleaños
      if (fechaNacimiento) {
        let hoy = new Date();
        let [anio, mes, dia] = fechaNacimiento.split("-");
        if (hoy.getDate() === parseInt(dia, 10) && (hoy.getMonth() + 1) === parseInt(mes, 10)) {
          mensajeCorreo = `<div class="mi-alerta-exito">🎂 ¡Feliz cumpleaños! Como estudiante de Duoc, ¡tienes una torta gratis!</div>`;
        } else {
          mensajeCorreo = `<div class="mi-alerta-exito">✅ Bienvenido, estudiante de Duoc UC</div>`;
        }
      } else {
        mensajeCorreo = `<div class="mi-alerta-exito">✅ Bienvenido, estudiante de Duoc UC</div>`;
      }
    } else if (email.endsWith("@profesor.duoc.cl")) {
      mensajeCorreo = `<div class="mi-alerta-exito">✅ Bienvenido, profesor de Duoc UC</div>`;
    }

    // Validar edad
    if (isNaN(edad) || edad <= 0) {
      errores.push("Ingrese una edad válida.");
    } else if (edad >= 50) {
      mensajeDescuento = `<div class="mi-alerta-descuento">Obtuviste un 50% de descuento</div>`;
    }

    // Validar contraseña
    if (clave1.length < 6) {
      errores.push("La contraseña debe tener al menos 6 caracteres.");
    }

    // Confirmar contraseña
    if (clave1 !== clave2) {
      errores.push("Las contraseñas no coinciden.");
    }

    // Mostrar mensajes
    mensajesDiv.innerHTML = "";

    // Validar código de descuento
    if (codigo.toUpperCase() === "FELICES50") {
      mensajeDescuento += `<div class="mi-alerta-descuento">¡Obtuviste un 10% de descuento de por vida!</div>`;
    }

    if (errores.length > 0) {
      mensajesDiv.innerHTML = `<div class="mi-alerta-error"><ul><li>${errores.join(
        "</li><li>"
      )}</li></ul></div>`;
    } else {
      mensajesDiv.innerHTML = `${mensajeCorreo}${mensajeDescuento}<div class="mi-alerta-exito ">✅ Registro exitoso</div>`;

      // Agregar el nuevo usuario a la lista de usuarios y guardarlo en localStorage
      usuarios.push({ nombre, email, password: clave1 });  // Ahora se guarda también el nombre
      localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Guardar en localStorage

      // Mostrar los usuarios registrados en la consola
      console.log("Usuarios registrados: ", usuarios);

      // Guardar el estado de sesión con el nombre en localStorage
      localStorage.setItem("loggedIn", JSON.stringify({ nombre, email }));

      // Redirigir al login después de 15 segundos
      setTimeout(function () {
        window.location.href = "login.html";
      }, 5000);
    }
  });
});
