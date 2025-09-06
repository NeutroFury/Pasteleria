function validarLogin() {
  let email = document.getElementById("login-email").value.trim();
  let clave = document.getElementById("login-clave").value;
  let mensajes = [];

  if (!email.includes("@")) {
    mensajes.push("El correo electrónico no es válido.");
  }
  if (clave.length < 6) {
    mensajes.push("La contraseña debe tener al menos 6 caracteres.");
  }

  let mensajesDiv = document.getElementById("login-mensajes");
  mensajesDiv.innerHTML = "";

  if (mensajes.length > 0) {
    mensajesDiv.innerHTML = `<div class="mi-alerta-error"><ul><li>${mensajes.join(
      "</li><li>"
    )}</li></ul></div>`;
  } else {
    mensajesDiv.innerHTML = `<div class="mi-alerta-exito">✅ Login exitoso</div>`;
    setTimeout(function() {
      window.location.href = "index.html";
    }, 1000);
  }
}