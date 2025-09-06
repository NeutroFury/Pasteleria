function validarFormulario() {
  let errores = [];
  let mensajeDescuento = "";
  let mensajeCorreo = "";

  let nombre = document.getElementById("nombre").value.trim();
  let email = document.getElementById("email").value.trim();
  let edad = parseInt(document.getElementById("edad").value);
  let clave1 = document.getElementById("clave1").value;
  let clave2 = document.getElementById("clave2").value;
  let codigo = document.getElementById("codigo").value.trim();
  let fechaNacimiento = document.getElementById("fechaNacimiento").value;

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
      if (
        hoy.getDate() === parseInt(dia, 10) &&
        (hoy.getMonth() + 1) === parseInt(mes, 10)
      ) {
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
  let mensajesDiv = document.getElementById("mensajes");
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
    setTimeout(function() {
      window.location.href = "index.html";
    }, 15000);
  }
}