export default function Registro() {
    return(
        <>
            <main>
      <div class="login-container">
        <h2>Registrar Usuario</h2>
        <form id="formRegistro">
          <div class="form-group">
            <label for="nombre">Nombre completo</label>
            <input type="text" id="nombre" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="register-email">Correo electrónico</label>
            <input type="email" id="register-email" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="edad">Edad</label>
            <input type="number" id="edad" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="clave1">Contraseña</label>
            <input type="password" id="clave1" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="clave2">Confirmar contraseña</label>
            <input type="password" id="clave2" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="codigo">Código de descuento (Opcional)</label>
            <input type="text" id="codigo" class="form-control" />
          </div>

          <div class="form-group">
            <label for="fechaNacimiento">Fecha de nacimiento (Opcional)</label>
            <input type="date" id="fechaNacimiento" class="form-control" />
          </div>

          <button type="submit" class="colorBoton1">
            Registrarse
          </button>
        </form>

        {/* <!-- Mensajes de error y éxito --> */}
        <div id="mensajes"></div>
      </div>
    </main>
        </>
    )
}