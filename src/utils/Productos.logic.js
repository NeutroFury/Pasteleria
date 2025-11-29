// =================================================================
// Lógica Pura para el Componente: Productos
// Ubicación: /src/utils/Productos.logic.js
// =================================================================

// Se ancla al objeto window para disponibilidad global en la app y en las pruebas (Karma/Jasmine)
window.ProductosLogic = {
  /**
   * Resuelve la ruta de una imagen, prefijándola con la PUBLIC_URL si es relativa.
   * Maneja URLs absolutas, data-URIs y rutas relativas.
   * @param {string} src - La ruta de la imagen original.
   * @param {string} publicUrl - El valor de process.env.PUBLIC_URL.
   * @returns {string} La ruta de la imagen resuelta.
   */

  resolveImg: function (src, publicUrl) {
    if (!src) return '';
    // Si ya es una URL absoluta (http, https) o un data URI (data:), no hacer nada.
    if (/^https?:\/\//i.test(src) || /^data:/i.test(src)) return src;

    // Limpia barras inclinadas al inicio de la ruta relativa
    const s = String(src).replace(/^\/+/, '');
    // Limpia barras inclinadas al final de la PUBLIC_URL
    const prefix = (publicUrl || '').replace(/\/$/, '');
    
    return `${prefix}/${s}` || `/${s}`;
  },

  /**
   * Formatea un número como moneda chilena (CLP).
   * @param {number} n - El número a formatear.
   * @returns {string} El número formateado como CLP (ej: $10.000).
   */
  CLP: function (n) {
    const num = Number(n) || 0;
    return num.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });
  },

  /**
   * Calcula el precio final de un producto aplicando un descuento (si existe).
   * @param {object} p - El objeto producto, debe tener { precio: number, descuento: number }.
   * @returns {number} El precio final (base o con descuento aplicado).
   */
  precioConDescuento: function (p) {
    if (!p) return 0;
    const base = Number(p.precio) || 0;
    const d = Number(p.descuento) || 0;
    // Si el descuento es > 0, aplica el cálculo; de lo contrario, devuelve el precio base.
    return d > 0 ? Math.round(base * (1 - d / 100)) : base;
  },

  /**
   * Lógica para agregar un producto al carrito (manejado en localStorage).
   * Esta función depende de recibir el estado 'productos' actual desde el componente.
   * También depende de variables globales (localStorage, window, alert, Event) que serán
   * 'mockeadas' (simuladas) en el entorno de pruebas.
   * @param {string} codigo - El código del producto a agregar.
   * @param {Array} productos - El listado completo de productos (del estado del componente).
   */

  agregarAlCarrito: function (codigo, productos) {
    // 1. Verificar sesión
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      // Redirige al login si no hay sesión (omitido en entorno de pruebas)
      if (window && window.location && !window.__TEST_ENV__) {
        try { window.location.href = '/login'; } catch (e) { /* noop */ }
      }
      return 'redirect_login';
    }

    const producto = (productos || []).find((p) => p.codigo === codigo);
    if (!producto) return;

    // 2. Obtener carrito de localStorage
    let carrito;
    try {
      const raw = localStorage.getItem("carrito");
      carrito = raw ? JSON.parse(raw) : [];
    } catch {
      carrito = [];
    }
    if (!Array.isArray(carrito)) carrito = [];

    // 3. Buscar si el producto ya existe
    const existe = carrito.find((p) => p.codigo === codigo);
    if (existe) {
      // 3a. Límite de 5 unidades
      if ((Number(existe.cantidad) || 1) >= 5) {
        alert(" ⚠️  No puedes agregar más de 5 unidades de este producto.");
        return;
      }
      
      // 3b. Asegurar precio vigente (aplicar descuento si corresponde)
      // Llama a la función 'hermana' dentro del mismo objeto
      const pf = window.ProductosLogic.precioConDescuento(producto);
      if (Number(existe.precio) !== pf) {
        existe.precio = pf;
      }
      existe.cantidad = (Number(existe.cantidad) || 1) + 1;
    } else {
      // 3c. Agregar producto nuevo
      carrito.push({
        codigo: producto.codigo,
        nombre: producto.nombre,
        // Llama a la función 'hermana' dentro del mismo objeto
        precio: window.ProductosLogic.precioConDescuento(producto),
        img: producto.img,
        categoria: producto.categoria,
        cantidad: 1,
      });
    }

    // 4. Guardar carrito
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    // 5. Notificar a otros componentes (ej: el header)
    window.dispatchEvent(new Event("carrito-changed"));
  }
};