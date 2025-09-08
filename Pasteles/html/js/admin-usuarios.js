document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  const itemsPerPage = 10;
  let allUsers = [];
  let filteredUsers = [];
  
  // Función para cargar usuarios desde localStorage
  function loadUsers() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    
    // Si no hay usuarios, crear algunos de ejemplo
    if (usuarios.length === 0) {
      usuarios = [
        {
          nombre: "María González",
          email: "maria.gonzalez@email.com",
          hasLifetime10: true,
          isDuocStudent: false,
          fechaNacimiento: "1990-05-15"
        },
        {
          nombre: "Carlos Rodríguez",
          email: "carlos.rodriguez@duocuc.cl",
          hasLifetime10: false,
          isDuocStudent: true,
          fechaNacimiento: "1995-12-03"
        },
        {
          nombre: "Ana Martínez",
          email: "ana.martinez@email.com",
          hasLifetime10: true,
          isDuocStudent: false,
          fechaNacimiento: "1988-08-22"
        },
        {
          nombre: "Pedro Silva",
          email: "pedro.silva@duocuc.cl",
          hasLifetime10: false,
          isDuocStudent: true,
          fechaNacimiento: "1992-03-10"
        },
        {
          nombre: "Laura Fernández",
          email: "laura.fernandez@email.com",
          hasLifetime10: false,
          isDuocStudent: false,
          fechaNacimiento: "1991-11-28"
        }
      ];
      
      // Guardar usuarios de ejemplo
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
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
  window.deleteUser = function(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.nombre}"?`)) {
        // Eliminar usuario del localStorage
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const userIndex = usuarios.findIndex(u => u.email === user.email);
        
        if (userIndex !== -1) {
          usuarios.splice(userIndex, 1);
          localStorage.setItem("usuarios", JSON.stringify(usuarios));
          
          // Recargar la lista
          loadUsers();
          alert('Usuario eliminado exitosamente');
        }
      }
    }
  };
  
  // Función para filtrar usuarios
  function setupFilters() {
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.querySelector('input[placeholder="Buscar usuario..."]');
    
    if (statusFilter) {
      statusFilter.addEventListener('change', () => {
        const status = statusFilter.value;
        
        if (status === 'all') {
          filteredUsers = [...allUsers];
        } else if (status === 'active') {
          filteredUsers = allUsers.filter(user => user.estado === 'Activo');
        } else if (status === 'inactive') {
          filteredUsers = allUsers.filter(user => user.estado === 'Inactivo');
        }
        
        currentPage = 1;
        renderUsers();
        renderPagination();
      });
    }
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        filteredUsers = allUsers.filter(user => 
          user.nombre.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
        
        currentPage = 1;
        renderUsers();
        renderPagination();
      });
    }
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
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${id}?`)) {
      alert(`Usuario ${id} eliminado`);
    }
  };

  // Inicializar
  if (checkAdminAuth()) {
    loadUsers();
    setupFilters();
    setupNavigation();
  }
});
