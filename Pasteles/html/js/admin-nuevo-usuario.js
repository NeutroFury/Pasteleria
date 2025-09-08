document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('userForm');
  
  // Función para configurar navegación
  function setupNavigation() {
    // Los enlaces ahora son enlaces normales, no necesitan JavaScript especial
    console.log('Navegación configurada - enlaces funcionando normalmente');
  }
  
  // Función para verificar autenticación de administrador
  function checkAdminAuth() {
    const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
    
    if (!loggedIn) {
      alert('Debes iniciar sesión para acceder al panel de administrador');
      window.location.href = 'login.html';
      return false;
    }
    
    return true;
  }
  
  // Función para generar ID único
  function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }
  
  // Función para validar formulario
  function validateForm(formData) {
    const errors = [];
    
    if (!formData.nombre.trim()) {
      errors.push('El nombre es requerido');
    }
    
    if (!formData.email.trim()) {
      errors.push('El email es requerido');
    } else if (!formData.email.includes('@')) {
      errors.push('El email no es válido');
    }
    
    if (!formData.password.trim()) {
      errors.push('La contraseña es requerida');
    } else if (formData.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.push('Las contraseñas no coinciden');
    }
    
    if (!formData.tipoUsuario) {
      errors.push('El tipo de usuario es requerido');
    }
    
    return errors;
  }
  
  // Función para crear usuario
  function createUser(formData) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    
    // Verificar si el email ya existe
    const emailExists = usuarios.some(user => user.email === formData.email);
    if (emailExists) {
      throw new Error('Ya existe un usuario con este email');
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = {
      id: generateId(),
      nombre: formData.nombre.trim(),
      email: formData.email.trim(),
      clave: formData.password,
      edad: formData.edad || null,
      telefono: formData.telefono || '',
      direccion: formData.direccion || '',
      fechaNacimiento: formData.fechaNacimiento || null,
      tipoUsuario: formData.tipoUsuario,
      fechaRegistro: new Date().toISOString().split('T')[0],
      isDuocStudent: formData.email.endsWith('@duocuc.cl'),
      hasLifetime10: formData.codigoDescuento === 'FELICES50',
      freeCakeEligibleToday: false
    };
    
    // Agregar usuario a la lista
    usuarios.push(nuevoUsuario);
    
    // Guardar en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    
    return nuevoUsuario;
  }
  
  // Manejar envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    try {
      // Obtener datos del formulario
      const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirm-password').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        tipoUsuario: document.getElementById('tipoUsuario').value,
        codigoDescuento: document.getElementById('codigoDescuento').value,
        edad: null // No hay campo de edad en el formulario simplificado
      };
      
      // Validar formulario
      const errors = validateForm(formData);
      if (errors.length > 0) {
        alert('Errores en el formulario:\n' + errors.join('\n'));
        return;
      }
      
      // Crear usuario
      const usuario = createUser(formData);
      
      // Mostrar éxito
      alert(`Usuario "${usuario.nombre}" creado exitosamente!`);
      
      // Redirigir a la lista de usuarios
      window.location.href = 'admin-usuarios.html';
      
    } catch (error) {
      alert('Error al crear usuario: ' + error.message);
    }
  });
  
  // Inicializar
  if (checkAdminAuth()) {
    setupNavigation();
  }
});