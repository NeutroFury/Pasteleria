document.addEventListener("DOMContentLoaded", () => {
  console.log('Admin.js cargado correctamente');
  
  // Función para actualizar estadísticas del dashboard
  function updateDashboardStats() {
    console.log('Actualizando estadísticas del dashboard...');
    
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    console.log('Usuarios encontrados:', usuarios.length);
    console.log('Carrito encontrado:', carrito.length);
    
    // Contar productos (simulado - en una app real vendría de una base de datos)
    const totalProducts = 15; // Número de productos en productos.js
    
    // Contar usuarios registrados
    const totalUsers = usuarios.length;
    
    // Simular pedidos (en una app real vendría de una base de datos)
    const totalOrders = Math.floor(Math.random() * 100) + 50;
    
    // Calcular ingresos simulados
    const totalRevenue = usuarios.length * 25000; // Estimación basada en usuarios
    
    console.log('Estadísticas calculadas:', {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue
    });
    
    // Actualizar elementos del DOM
    const productsEl = document.getElementById("total-products");
    const usersEl = document.getElementById("total-users");
    const ordersEl = document.getElementById("total-orders");
    const revenueEl = document.getElementById("total-revenue");
    
    if (productsEl) productsEl.textContent = totalProducts;
    if (usersEl) usersEl.textContent = totalUsers;
    if (ordersEl) ordersEl.textContent = totalOrders;
    if (revenueEl) revenueEl.textContent = `$${totalRevenue.toLocaleString('es-CL')}`;
    
    console.log('Estadísticas actualizadas en el DOM');
  }
  
  // Función para manejar navegación del sidebar
  function setupNavigation() {
    // Los enlaces ahora son enlaces normales, no necesitan JavaScript especial
    // La navegación funciona directamente con href
    console.log('Navegación configurada - enlaces funcionando normalmente');
  }
  
  // Función para manejar notificaciones (simplificada)
  function setupNotifications() {
    // Notificaciones removidas por simplicidad
  }
  
  // Función para verificar autenticación de administrador
  function checkAdminAuth() {
    const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
    
    if (!loggedIn) {
      alert('Debes iniciar sesión para acceder al panel de administrador');
      window.location.href = 'login.html';
      return false;
    }
    
    // En una app real, aquí verificarías si el usuario tiene permisos de admin
    // Por ahora, permitimos acceso a cualquier usuario logueado
    return true;
  }
  
  // Función para agregar efectos visuales
  function addVisualEffects() {
    // Efecto hover en tarjetas del dashboard
    const dashboardCards = document.querySelectorAll('.admin-stat-card');
    dashboardCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.transition = 'transform 0.3s ease';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }
  
  // Inicializar funciones
  console.log('Iniciando funciones del admin...');
  
  if (checkAdminAuth()) {
    console.log('Autenticación exitosa, ejecutando funciones...');
    updateDashboardStats();
    setupNavigation();
    setupNotifications();
    addVisualEffects();
    console.log('Todas las funciones ejecutadas correctamente');
  } else {
    console.log('Autenticación fallida');
  }
});
