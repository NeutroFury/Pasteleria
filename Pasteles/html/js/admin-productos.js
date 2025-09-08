document.addEventListener("DOMContentLoaded", () => {
  let allProducts = [];
  let filteredProducts = [];
  
  // Función para cargar productos desde productos.js
  function loadProducts() {
    // Simular carga de productos (en una app real vendría de una base de datos)
    allProducts = [
      { codigo: "TC001", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Chocolate", precio: 45000, descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales", img: "img/Pastel_1.png" },
      { codigo: "TC002", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Frutas", precio: 50000, descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.", img: "img/Pastel_2.png" },
      { codigo: "TT001", categoria: "Tortas Circulares", nombre: "Torta Circular de Vainilla", precio: 40000, descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.", img: "img/Pastel_3.png" },
      { codigo: "TT002", categoria: "Tortas Circulares", nombre: "Torta Circular de Manjar", precio: 42000, descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.", img: "img/Pastel_4.png" },
      { codigo: "PI001", categoria: "Postres Individuales", nombre: "Mousse de Chocolate", precio: 5000, descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.", img: "img/Pastel_5.png" },
      { codigo: "PI002", categoria: "Postres Individuales", nombre: "Tiramisú Clásico", precio: 5500, descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.", img: "img/Pastel_6.png" },
      { codigo: "PSA001", categoria: "Productos Sin Azúcar", nombre: "Torta Sin Azúcar de Naranja", precio: 48000, descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.", img: "img/Pastel_7.png" },
      { codigo: "PSA002", categoria: "Productos Sin Azúcar", nombre: "Cheesecake Sin Azúcar", precio: 47000, descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.", img: "img/cheesecake.png" },
      { codigo: "PT001", categoria: "Pastelería Tradicional", nombre: "Empanada de Manzana", precio: 3000, descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.", img: "img/Pastel_8.png" },
      { codigo: "PT002", categoria: "Pastelería Tradicional", nombre: "Tarta de Santiago", precio: 6000, descripcion: "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.", img: "img/Pastel_9.png" },
      { codigo: "PG001", categoria: "Productos Sin Gluten", nombre: "Brownie Sin Gluten", precio: 4000, descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.", img: "img/Pastel_10.png" },
      { codigo: "PG002", categoria: "Productos Sin Gluten", nombre: "Pan Sin Gluten", precio: 3500, descripcion: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.", img: "img/Pastel_11.png" },
      { codigo: "PV001", categoria: "Productos Veganos", nombre: "Torta Vegana de Chocolate", precio: 50000, descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.", img: "img/Pastel_12.png" },
      { codigo: "PV002", categoria: "Productos Veganos", nombre: "Galletas Veganas de Avena", precio: 4500, descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.", img: "img/Pastel_13.png" },
      { codigo: "TE001", categoria: "Tortas Especiales", nombre: "Torta Especial de Cumpleaños", precio: 55000, descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.", img: "img/Pastel_14.png" },
      { codigo: "TE002", categoria: "Tortas Especiales", nombre: "Torta Especial de Boda", precio: 60000, descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.", img: "img/Pastel_15.png" }
    ];
    
    filteredProducts = [...allProducts];
    renderProducts();
  }
  
  // Función para formatear números al estilo chileno
  function formatoChileno(numero) {
    return numero.toLocaleString('es-CL');
  }
  
  // Función para renderizar productos en la tabla
  function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    
    if (!tbody) {
      console.error('No se encontró el elemento productsTableBody');
      return;
    }
    
    tbody.innerHTML = '';
    
    if (filteredProducts.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
            No hay productos registrados
          </td>
        </tr>
      `;
      return;
    }
    
    filteredProducts.forEach((producto, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><img src="${producto.img}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" onerror="this.src='img/Pastel_1.png'"></td>
        <td>${producto.nombre}</td>
        <td>${producto.categoria}</td>
        <td>$${formatoChileno(producto.precio)}</td>
        <td>${Math.floor(Math.random() * 50) + 10}</td>
        <td><span class="status-badge status-active">Disponible</span></td>
        <td>
          <button class="btn-action btn-view" onclick="viewProduct('${producto.codigo}')">Ver</button>
          <button class="btn-action btn-edit" onclick="editProduct('${producto.codigo}')">Editar</button>
          <button class="btn-action btn-delete" onclick="deleteProduct('${producto.codigo}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Función para ver producto
  window.viewProduct = function(codigo) {
    const producto = allProducts.find(p => p.codigo === codigo);
    if (producto) {
      alert(`Información del producto:\n\nCódigo: ${producto.codigo}\nNombre: ${producto.nombre}\nCategoría: ${producto.categoria}\nPrecio: $${formatoChileno(producto.precio)}\nDescripción: ${producto.descripcion}`);
    }
  };
  
  // Función para editar producto
  window.editProduct = function(codigo) {
    const producto = allProducts.find(p => p.codigo === codigo);
    if (producto) {
      alert(`Editando producto: ${producto.nombre}\n\nEsta funcionalidad se implementará en la siguiente versión.`);
    }
  };
  
  // Función para eliminar producto
  window.deleteProduct = function(codigo) {
    const producto = allProducts.find(p => p.codigo === codigo);
    if (producto) {
      if (confirm(`¿Estás seguro de que quieres eliminar el producto "${producto.nombre}"?`)) {
        // En una app real, aquí eliminarías de la base de datos
        const index = allProducts.findIndex(p => p.codigo === codigo);
        if (index !== -1) {
          allProducts.splice(index, 1);
          filteredProducts = [...allProducts];
          renderProducts();
          alert('Producto eliminado exitosamente');
        }
      }
    }
  };
  
  // Función para configurar filtros
  function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => {
        applyFilters();
      });
    }
    
    if (statusFilter) {
      statusFilter.addEventListener('change', () => {
        applyFilters();
      });
    }
    
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        applyFilters();
      });
    }
  }
  
  // Función para aplicar todos los filtros
  function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    
    let filtered = [...allProducts];
    
    // Filtro por categoría
    if (categoryFilter && categoryFilter.value) {
      const category = categoryFilter.value;
      filtered = filtered.filter(producto => producto.categoria === category);
    }
    
    // Filtro por estado
    if (statusFilter && statusFilter.value) {
      const status = statusFilter.value;
      filtered = filtered.filter(producto => producto.estado === status);
    }
    
    // Filtro por búsqueda
    if (searchInput && searchInput.value.trim()) {
      const searchTerm = searchInput.value.toLowerCase().trim();
      filtered = filtered.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm) ||
        producto.descripcion.toLowerCase().includes(searchTerm) ||
        producto.categoria.toLowerCase().includes(searchTerm)
      );
    }
    
    filteredProducts = filtered;
    currentPage = 1;
    renderProducts();
    renderPagination();
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
    // La navegación funciona directamente con href
    console.log('Navegación configurada - enlaces funcionando normalmente');
  }
  
  // Funciones globales simplificadas
  window.changePage = function(page) {
    currentPage = page;
    renderProducts();
    renderPagination();
  };
  
  window.viewProduct = function(codigo) {
    const producto = allProducts.find(p => p.codigo === codigo);
    if (producto) {
      alert(`Producto: ${producto.nombre}\nCategoría: ${producto.categoria}\nPrecio: $${formatoChileno(producto.precio)}`);
    }
  };
  
  window.editProduct = function(codigo) {
    alert(`Editar producto ${codigo} - Funcionalidad próximamente disponible`);
  };
  
  window.deleteProduct = function(codigo) {
    const producto = allProducts.find(p => p.codigo === codigo);
    if (!producto) {
      alert('Producto no encontrado');
      return;
    }
    
    if (confirm(`¿Estás seguro de que quieres eliminar el producto "${producto.nombre}" (${codigo})?`)) {
      // Eliminar producto del array
      const productIndex = allProducts.findIndex(p => p.codigo === codigo);
      if (productIndex > -1) {
        allProducts.splice(productIndex, 1);
        
        // Guardar en localStorage
        localStorage.setItem("productos", JSON.stringify(allProducts));
        
        // Recargar la tabla
        renderProducts();
        renderPagination();
        
        alert(`Producto "${producto.nombre}" eliminado exitosamente`);
      }
    }
  };

  // Inicializar
  if (checkAdminAuth()) {
    loadProducts();
    setupFilters();
    setupNavigation();
  }
});
