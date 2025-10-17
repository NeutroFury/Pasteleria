document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  const itemsPerPage = 10;
  let allUsers = [];
  let filteredUsers = [];
  
  // Función para cargar usuarios desde localStorage
  function loadUsers() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    
    // Asegurar que siempre exista el usuario admin con la contraseña correcta
    const adminExists = usuarios.some(user => user.email === "admin@admin.com");
    if (!adminExists) {
      usuarios.unshift({
        nombre: "admin",
        email: "admin@admin.com",
        clave: "asdasd",
        hasLifetime10: false,
        isDuocStudent: false,
        fechaNacimiento: null
      });
      
      // Guardar usuarios con admin incluido
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    } else {
      // Si el admin existe pero no tiene la contraseña correcta, actualizarla
      const adminIndex = usuarios.findIndex(user => user.email === "admin@admin.com");
      if (adminIndex > -1) {
        usuarios[adminIndex].clave = "asdasd";
        usuarios[adminIndex].password = "asdasd"; // También actualizar el campo password por compatibilidad
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
      }
    }
    
    // Convertir usuarios a formato de tabla con IDs y fechas simuladas
    allUsers = usuarios.map((user, index) => ({
      id: index + 1,
      nombre: user.nombre || 'Sin nombre',
      email: user.email || 'Sin email',
      fechaRegistro: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CL'),
      estado: 'Activo',
      beneficios: getUserBenefits(user),
      hasLifetime10: user.hasLifetime10 || false,
      isDuocStudent: user.isDuocStudent || false,
      fechaNacimiento: user.fechaNacimiento || null
    }));
    
    filteredUsers = [...allUsers];
    renderUsers();
    renderPagination();
  }
  
  // Función para obtener beneficios del usuario
  function getUserBenefits(user) {
    const benefits = [];
    
    if (user.hasLifetime10) {
      benefits.push('10% de por vida');
    }
    
    if (user.isDuocStudent && user.fechaNacimiento) {
      const hoy = new Date();
      const [anio, mes, dia] = user.fechaNacimiento.split('-');
      if (hoy.getDate() === parseInt(dia, 10) && (hoy.getMonth() + 1) === parseInt(mes, 10)) {
        benefits.push('Torta gratis hoy');
      } else {
        benefits.push('Torta gratis en cumpleaños');
      }
    }
    
    if (user.edad && user.edad >= 50) {
      benefits.push('50% descuento');
    }
    
    return benefits.length > 0 ? benefits.join(', ') : 'Ninguno';
  }
  
  // Función para renderizar usuarios en la tabla
  function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const usersToShow = filteredUsers.slice(startIndex, endIndex);
    
    if (!tbody) {
      console.error('No se encontró el elemento usersTableBody');
      return;
    }
    
    tbody.innerHTML = '';
    
    if (usersToShow.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
            No hay usuarios registrados
          </td>
        </tr>
      `;
      return;
    }
    
    usersToShow.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td>Cliente</td>
        <td><span class="status-badge status-active">${user.estado}</span></td>
        <td>${user.fechaRegistro}</td>
        <td>
          <button class="btn-action btn-view" onclick="viewUser(${user.id})">Ver</button>
          <button class="btn-action btn-edit" onclick="editUser(${user.id})">Editar</button>
          <button class="btn-action btn-delete" onclick="deleteUser(${user.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Función para renderizar paginación
  function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }
    
    let paginationHTML = '';
    
    // Botón anterior
    paginationHTML += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">‹</button>`;
    
    // Números de página
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        paginationHTML += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        paginationHTML += '<span>...</span>';
      }
    }
    
    // Botón siguiente
    paginationHTML += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">›</button>`;
    
    pagination.innerHTML = paginationHTML;
  }
  
  // Función para cambiar página
  window.changePage = function(page) {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      renderUsers();
      renderPagination();
    }
  };
  
  // Función para ver usuario
  window.viewUser = function(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      alert(`Información del usuario:\n\nNombre: ${user.nombre}\nEmail: ${user.email}\nFecha de registro: ${user.fechaRegistro}\nEstado: ${user.estado}\nBeneficios: ${user.beneficios}`);
    }
  };
  
  // Función para editar usuario
  window.editUser = function(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      // En una app real, aquí abrirías un modal o página de edición
      alert(`Editando usuario: ${user.nombre}\n\nEsta funcionalidad se implementará en la siguiente versión.`);
    }
  };
  
  // Función para eliminar usuario
  
  // Función para filtrar usuarios
  function setupFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (statusFilter) {
      statusFilter.addEventListener('change', () => {
        applyFilters();
      });
    }
    
    if (typeFilter) {
      typeFilter.addEventListener('change', () => {
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
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('searchInput');
    
    let filtered = [...allUsers];
    
    // Filtro por estado
    if (statusFilter && statusFilter.value) {
      const status = statusFilter.value;
      if (status === 'activo') {
        filtered = filtered.filter(user => user.estado === 'Activo');
      } else if (status === 'inactivo') {
        filtered = filtered.filter(user => user.estado === 'Inactivo');
      }
    }
    
    // Filtro por tipo
    if (typeFilter && typeFilter.value) {
      const type = typeFilter.value;
      if (type === 'cliente') {
        filtered = filtered.filter(user => user.email !== 'admin@test.com');
      } else if (type === 'admin') {
        filtered = filtered.filter(user => user.email === 'admin@test.com');
      }
    }
    
    // Filtro por búsqueda
    if (searchInput && searchInput.value.trim()) {
      const searchTerm = searchInput.value.toLowerCase().trim();
      filtered = filtered.filter(user => 
        user.nombre.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    filteredUsers = filtered;
    currentPage = 1;
    renderUsers();
    renderPagination();
  }
  
  // Función para configurar navegación
  function setupNavigation() {
    // Los enlaces ahora son enlaces normales, no necesitan JavaScript especial
    // La navegación funciona directamente con href
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
  
  // Funciones globales simplificadas
  window.changePage = function(page) {
    currentPage = page;
    renderUsers();
    renderPagination();
  };
  
  window.viewUser = function(id) {
    const user = allUsers.find(u => u.id === id);
    if (user) {
      alert(`Usuario: ${user.nombre}\nEmail: ${user.email}`);
    }
  };
  
  window.editUser = function(id) {
    alert(`Editar usuario ${id} - Funcionalidad próximamente disponible`);
  };
  
  window.deleteUser = function(id) {
    const user = allUsers.find(u => u.id === id);
    if (!user) {
      alert('Usuario no encontrado');
      return;
    }
    
    // No permitir eliminar al usuario admin
    if (user.email === "admin@admin.com") {
      alert('No se puede eliminar al usuario administrador');
      return;
    }
    
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.nombre}" (${user.email})?`)) {
      // Eliminar usuario del array
      const userIndex = allUsers.findIndex(u => u.id === id);
      if (userIndex > -1) {
        allUsers.splice(userIndex, 1);
        
        // Guardar en localStorage
        localStorage.setItem("usuarios", JSON.stringify(allUsers));
        
        // Recargar la tabla
        renderUsers();
        renderPagination();
        
        alert(`Usuario "${user.nombre}" eliminado exitosamente`);
      }
    }
  };

  // Inicializar
  if (checkAdminAuth()) {
    loadUsers();
    setupFilters();
    setupNavigation();
  }
});
