document.addEventListener("DOMContentLoaded", () => {
  // Función para mostrar vista previa de imagen
  function setupImagePreview() {
    const imageInput = document.getElementById('imagen');
    const imagePreview = document.getElementById('image-preview');
    
    if (imageInput && imagePreview) {
      imageInput.addEventListener('input', () => {
        const imageUrl = imageInput.value.trim();
        
        if (imageUrl) {
          imagePreview.innerHTML = `<img src="${imageUrl}" alt="Vista previa" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-text\\'>Imagen no encontrada</div>'">`;
        } else {
          imagePreview.innerHTML = '<div class="image-preview-text">Vista previa de la imagen</div>';
        }
      });
    }
  }
  
  // Función para validar formulario
  function validateForm(formData) {
    const errors = [];
    
    if (!formData.codigo.trim()) {
      errors.push('El código del producto es requerido');
    } else if (!/^[A-Z]{2}\d{3}$/.test(formData.codigo.trim())) {
      errors.push('El código debe tener el formato: 2 letras seguidas de 3 números (ej: TC001)');
    }
    
    if (!formData.categoria) {
      errors.push('La categoría es requerida');
    }
    
    if (!formData.nombre.trim()) {
      errors.push('El nombre del producto es requerido');
    }
    
    if (!formData.descripcion.trim()) {
      errors.push('La descripción es requerida');
    }
    
    if (!formData.precio || formData.precio <= 0) {
      errors.push('El precio debe ser mayor a 0');
    }
    
    if (!formData.imagen.trim()) {
      errors.push('La URL de la imagen es requerida');
    }
    
    return errors;
  }
  
  // Función para generar código automático
  function generateCode() {
    const categoria = document.getElementById('categoria').value;
    if (!categoria) return '';
    
    const categoriaCodes = {
      'Tortas Cuadradas': 'TC',
      'Tortas Circulares': 'TT',
      'Postres Individuales': 'PI',
      'Productos Sin Azúcar': 'PSA',
      'Pastelería Tradicional': 'PT',
      'Productos Sin Gluten': 'PG',
      'Productos Veganos': 'PV',
      'Tortas Especiales': 'TE'
    };
    
    const prefix = categoriaCodes[categoria] || 'PR';
    const randomNumber = Math.floor(Math.random() * 900) + 100; // 100-999
    return prefix + randomNumber;
  }
  
  // Función para configurar generación automática de código
  function setupAutoCodeGeneration() {
    const categoriaSelect = document.getElementById('categoria');
    const codigoInput = document.getElementById('codigo');
    
    if (categoriaSelect && codigoInput) {
      categoriaSelect.addEventListener('change', () => {
        if (!codigoInput.value.trim()) {
          codigoInput.value = generateCode();
        }
      });
    }
  }
  
  // Función para crear producto
  function createProduct(formData) {
    // En una app real, aquí guardarías en la base de datos
    // Por ahora, simulamos guardando en localStorage
    const productos = JSON.parse(localStorage.getItem("productos_admin")) || [];
    
    // Verificar si el código ya existe
    const codigoExists = productos.some(producto => producto.codigo === formData.codigo);
    if (codigoExists) {
      throw new Error('El código del producto ya existe');
    }
    
    // Crear nuevo producto
    const newProduct = {
      codigo: formData.codigo.trim().toUpperCase(),
      categoria: formData.categoria,
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      precio: parseInt(formData.precio),
      img: formData.imagen.trim(),
      stock: parseInt(formData.stock) || 0,
      estado: formData.estado,
      ingredientes: formData.ingredientes.trim(),
      fechaCreacion: new Date().toISOString()
    };
    
    productos.push(newProduct);
    localStorage.setItem("productos_admin", JSON.stringify(productos));
    
    return newProduct;
  }
  
  // Función para mostrar alertas
  function showAlert(type, message) {
    const successAlert = document.getElementById('success-alert');
    const errorAlert = document.getElementById('error-alert');
    
    // Ocultar todas las alertas
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    
    // Mostrar la alerta correspondiente
    if (type === 'success') {
      successAlert.textContent = message;
      successAlert.style.display = 'block';
    } else {
      errorAlert.textContent = message;
      errorAlert.style.display = 'block';
    }
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
      successAlert.style.display = 'none';
      errorAlert.style.display = 'none';
    }, 5000);
  }
  
  // Función para formatear números
  function formatoChileno(numero) {
    return numero.toLocaleString('es-CL');
  }
  
  // Función para manejar envío del formulario
  function setupFormSubmission() {
    const form = document.getElementById('new-product-form');
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Recopilar datos del formulario
        const formData = {
          codigo: document.getElementById('codigo').value,
          categoria: document.getElementById('categoria').value,
          nombre: document.getElementById('nombre').value,
          descripcion: document.getElementById('descripcion').value,
          precio: document.getElementById('precio').value,
          imagen: document.getElementById('imagen').value,
          stock: document.getElementById('stock').value,
          estado: document.getElementById('estado').value,
          ingredientes: document.getElementById('ingredientes').value
        };
        
        try {
          // Validar formulario
          const errors = validateForm(formData);
          if (errors.length > 0) {
            throw new Error(errors.join('\n'));
          }
          
          // Crear producto
          const newProduct = createProduct(formData);
          
          // Mostrar éxito
          showAlert('success', `✅ Producto "${newProduct.nombre}" creado exitosamente\nCódigo: ${newProduct.codigo}\nPrecio: $${formatoChileno(newProduct.precio)}`);
          
          // Limpiar formulario
          form.reset();
          document.getElementById('image-preview').innerHTML = '<div class="image-preview-text">Vista previa de la imagen</div>';
          
          // Redirigir después de 3 segundos
          setTimeout(() => {
            window.location.href = 'admin-productos.html';
          }, 3000);
          
        } catch (error) {
          showAlert('error', `❌ ${error.message}`);
        }
      });
    }
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
  
  // Función para configurar navegación
  function setupNavigation() {
    // Los enlaces ahora son enlaces normales, no necesitan JavaScript especial
    console.log('Navegación configurada - enlaces funcionando normalmente');
  }
  
  // Inicializar
  if (checkAdminAuth()) {
    setupImagePreview();
    setupAutoCodeGeneration();
    setupFormSubmission();
    setupNavigation();
  }
});
