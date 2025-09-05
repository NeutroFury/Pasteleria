function validarFormulario() {
  let errores = [];
  let mensajeDescuento = "";

  let nombre = document.getElementById("nombre").value.trim();
  let email = document.getElementById("email").value.trim();
  let edad = parseInt(document.getElementById("edad").value);
  let clave1 = document.getElementById("clave1").value;
  let clave2 = document.getElementById("clave2").value;

  // Validar nombre
  if (nombre === "") {
    errores.push("El nombre no puede estar vacío.");
  }

  // Validar correo
  if (!email.includes("@")) {
    errores.push("El correo electrónico no es válido.");
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

  if (errores.length > 0) {
    mensajesDiv.innerHTML = `<div class="mi-alerta-error"><ul><li>${errores.join("</li><li>")}</li></ul></div>`;
  } else {
    mensajesDiv.innerHTML = `${mensajeDescuento}<div class="mi-alerta-exito ">✅ Registro exitoso</div>`;
  }
}
