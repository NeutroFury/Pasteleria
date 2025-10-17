export default function Login() {
    return(
        <>
        <main>
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form id="formLogin">
        <div className="form-group">
          <label htmlFor="login-email">Correo electrónico</label>
          <input type="email" id="login-email" required="" />
        </div>
        <div className="form-group">
          <label htmlFor="login-clave">Contraseña</label>
          <input type="password" id="login-clave" required="" />
        </div>
        <button type="submit" className="colorBoton1">
          Ingresar
        </button>
      </form>
      <div id="error-msg" style={{ color: "red", display: "none" }}>
        <p>Correo o contraseña incorrectos</p>
      </div>
    </div>
  </main>
        </>
    )
}