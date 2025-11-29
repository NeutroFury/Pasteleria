// --------------------------------------------------
// Lógica Pura para el Componente: Ofertas
// --------------------------------------------------

// Evita la redeclaración si el script se carga varias veces  
window.OfertasLogic = window.OfertasLogic || {};

/**
 * Resuelve la ruta de una imagen, añadiendo el PUBLIC_URL si es necesario.
 * Maneja URLs absolutas (http, https) y data-uris.
 * @param {string} src - La ruta de la imagen original.
 * @returns {string} - La ruta de la imagen resuelta.
 */
window.OfertasLogic.resolveImg = function (src) {
  if (!src) return '';
  // Si ya es una URL absoluta o data URI, la retorna tal cual.
  if (/^https?:\/\//i.test(src) || /^data:/i.test(src)) return src;

  // Limpia slashes al inicio
  const s = String(src).replace(/^\/+/, '');
  // Obtiene el PUBLIC_URL y limpia slashes al final
  const prefix = (process.env.PUBLIC_URL || '').replace(/\/$/, '');

  return `${prefix}/${s}` || `/${s}`;
};

/**
 * Formatea un número como moneda Chilena (CLP) sin decimales.
 * @param {number|string} n - El número a formatear.
 * @returns {string} - El número formateado como CLP (ej: $1.234).
 */
window.OfertasLogic.CLP = function (n) {
  var num = Number(n);
  // Maneja NaN, null, undefined
  if (isNaN(num) || n == null) {
    return '$0';
  }
  return num.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
};

/**
 * Calcula el precio final de un producto aplicando un descuento.
 * @param {object} p - El producto (debe tener .precio y .descuento).
 * @returns {number} - El precio con el descuento aplicado.
 */
window.OfertasLogic.precioConDescuento = function (p) {
  if (!p) return 0;
  const base = Number(p.precio) || 0;
  const d = Number(p.descuento) || 0;
  // Retorna el precio base si el descuento es 0 o negativo
  return d > 0 ? Math.round(base * (1 - d / 100)) : base;
};

/**
 * Lógica para agregar un producto al carrito de compras.
 * Maneja el estado de login, el localStorage y los límites de cantidad.
 * @param {string} codigo - El código del producto a agregar.
 * @param {Array} ofertas - El listado actual de ofertas (usado para encontrar el producto).
 * @returns {string} - Un código de resultado para facilitar las pruebas ('added_successfully', 'redirect_login', 'product_not_found', 'limit_exceeded').
 */
window.OfertasLogic.agregarAlCarrito = function (codigo, ofertas) {
  // 1. Verificar si el usuario está logueado
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    // Redirección si no está logueado (omitida en entorno de pruebas)
    if (window && window.location && !window.__TEST_ENV__) {
      try { window.location.href = '/login'; } catch (e) { /* noop */ }
    }
    return 'redirect_login'; // Retorno para testing
  }

  // 2. Encontrar el producto en la lista de ofertas
  const p = (ofertas || []).find((x) => x.codigo === codigo);
  if (!p) {
    console.error("Producto no encontrado en la lista de ofertas:", codigo);
    return 'product_not_found'; // Retorno para testing
  }

  // 3. Cargar carrito desde localStorage
  let carrito = [];
  try {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  } catch {
    carrito = [];
  }
  if (!Array.isArray(carrito)) carrito = [];

  // 4. Lógica de agregar/actualizar
  const existe = carrito.find((x) => x.codigo === codigo);
  // Se usa la función de lógica pura para obtener el precio final
  const precioFinal = window.OfertasLogic.precioConDescuento(p);

  if (existe) {
    // Si ya existe en el carrito
    const cantidadActual = Number(existe.cantidad) || 1;
    if (cantidadActual >= 5) {
      alert(" ⚠️  No puedes agregar más de 5 unidades de este producto.");
      return 'limit_exceeded'; // Retorno para testing
    }
    
    // Asegurar que el precio esté actualizado si la oferta cambió
    if (Number(existe.precio) !== precioFinal) {
      existe.precio = precioFinal;
    }
    existe.cantidad = cantidadActual + 1;
  } else {
    // Si es un producto nuevo
    carrito.push({
      codigo: p.codigo,
      nombre: p.nombre,
      precio: precioFinal,
      img: p.img,
      categoria: p.categoria,
      cantidad: 1,
    });
  }

  // 5. Guardar y notificar
  localStorage.setItem("carrito", JSON.stringify(carrito));
  // Dispara evento para actualizar otros componentes (ej: Navbar)
  window.dispatchEvent(new Event("carrito-changed"));
  return 'added_successfully'; // Retorno para testing
};