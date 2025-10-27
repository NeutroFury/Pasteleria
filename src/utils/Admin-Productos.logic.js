// 1️⃣ AdminProductos.logic.js
// Lógica pura para AdminProductos y sus sub-componentes.
//  

(function() {
  // Evita la redeclaración de funciones globales  
  if (window.AdminProductosLogic) {
    return;
  }

  // Define el namespace global para la lógica  
  window.AdminProductosLogic = {};

  /**
   * Formatea un número a moneda CLP (Peso Chileno).
   *  
   * @param {number | string} n - El número a formatear.
   * @returns {string} - El número formateado como CLP.
   */
  window.AdminProductosLogic.CLP = function(n) {
    if (n == null) {
      return (0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
    }
    var num = Number(n);
    if (isNaN(num)) {
      return 'NaN';
    }
    return num.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
  };

  /**
   * Valida el formulario de producto. Devuelve un mensaje de error si es inválido,
   * o null si es válido.
   *  
   * @param {object} form - El objeto del formulario.
   * @returns {string | null} - Mensaje de error o null.
   */
  window.AdminProductosLogic.validateProductoForm = function(form) {
    if (!form || !form.codigo || !form.nombre || !form.categoria ||
        !form.codigo.trim() || !form.nombre.trim() || !form.categoria.trim()) {
      return 'Completa al menos: código, nombre y categoría';
    }
    if (isNaN(Number(form.precio)) || Number(form.precio) < 0) {
      return 'Precio inválido';
    }
    return null; // Es válido
  };

  /**
   * Resuelve la ruta de una imagen, añadiendo el PUBLIC_URL si es necesario.
   *  
   * @param {string} src - La ruta de la imagen original.
   * @returns {string} - La ruta resuelta.
   */
  window.AdminProductosLogic.resolveImg = function(src) {
    if (!src) return '';
    // Si es URL absoluta o data-uri, no hacer nada
    if (/^https?:\/\//i.test(src) || /^data:/i.test(src)) return src;
    
    var s = String(src).replace(/^\/+/, ''); // Quita slashes al inicio
    
    // Simula process.env.PUBLIC_URL para el entorno de testing
    var publicUrl = (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) ? process.env.PUBLIC_URL : '';
    var prefix = publicUrl.replace(/\/$/, ''); // Quita slash al final
    
    return prefix ? (prefix + '/' + s) : ('/' + s);
  };

  /**
   * Obtiene los colores de fondo (bg) y texto (fg) para un estado de producto.
   *  
   * @param {string} estado - "disponible", "agotado" o "descontinuado".
   * @returns {object} - { bg, fg }
   */
  window.AdminProductosLogic.getStatusPillColors = function(estado) {
    var colors = {
      disponible: { bg: '#e9ffe8', fg: '#0f5d1d' },
      agotado: { bg: '#fff5f5', fg: '#9b2c2c' },
      descontinuado: { bg: '#f5f5f5', fg: '#4a4a4a' },
    };
    // Devuelve colores por defecto si el estado no se encuentra
    return colors[estado] || { bg: '#f5f5f5', fg: '#4a4a4a' };
  };

  /**
   * Extrae y ordena las categorías únicas de una lista de items.
   * Lógica del useMemo [categorias].
   *  
   * @param {Array<object>} items - Lista de productos.
   * @returns {Array<string>} - Lista de categorías únicas ordenadas.
   */
  window.AdminProductosLogic.getCategorias = function(items) {
    if (!items || items.length === 0) return [];
      var categorias = items
        .map(function(i) { return i.categoria; })
        .filter(function(c) { return c !== null && c !== undefined; });
      var categoriasSet = new Set(categorias);
    return Array.from(categoriasSet).sort();
  };

  /**
   * Filtra la lista de productos basado en búsqueda, categoría y estado.
   * Lógica del useMemo [filtered].
   *  
   * @param {Array<object>} items - Lista de productos.
   * @param {string} search - Término de búsqueda.
   * @param {string} category - Categoría seleccionada.
   * @param {string} status - Estado seleccionado.
   * @returns {Array<object>} - Lista de productos filtrados.
   */
  window.AdminProductosLogic.filterItems = function(items, search, category, status) {
    var q = String(search || '').toLowerCase().trim();
    var allItems = items || [];

    return allItems.filter(function(p) {
      // Lógica de búsqueda
      var okSearch = !q ||
        (p.codigo && p.codigo.toLowerCase().includes(q)) ||
        (p.nombre && p.nombre.toLowerCase().includes(q)) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(q));
      
      // Lógica de filtros
      var okCategory = !category || p.categoria === category;
      var okStatus = !status || p.estado === status;
      
      return okSearch && okCategory && okStatus;
    });
  };

  /**
   * Lógica para guardar (crear o actualizar) un producto.
   * Requiere un mock de 'productService'.
   *  
   * @param {object} data - Datos del producto.
   * @param {object | null} editing - El producto que se está editando, o null si es nuevo.
   * @param {object} productService - Mock del servicio de productos (debe tener .create y .update).
   * @throws {Error} - Lanza error si productService falla o es inválido.
   */
  window.AdminProductosLogic.onSaveLogic = function(data, editing, productService) {
    if (!productService || typeof productService.create !== 'function' || typeof productService.update !== 'function') {
      throw new Error('productService no es válido o le faltan métodos');
    }
    
    if (editing) {
      productService.update(editing.codigo, data);
    } else {
      productService.create(data);
    }
  };

  /**
   * Lógica para eliminar un producto.
   * Requiere mocks de 'window.confirm' y 'productService'.
   *  
   * @param {string} codigo - Código del producto a eliminar.
   * @param {function} confirmFn - Mock de window.confirm (debe retornar true o false).
   * @param {object} productService - Mock del servicio de productos (debe tener .remove).
   * @returns {boolean} - true si se eliminó, false si no.
   * @throws {Error} - Lanza error si productService falla o es inválido.
   */
  window.AdminProductosLogic.onDeleteLogic = function(codigo, confirmFn, productService) {
    if (confirmFn('¿Eliminar producto de forma permanente?')) {
      if (!productService || typeof productService.remove !== 'function') {
        throw new Error('productService no es válido o le falta el método remove');
      }
      productService.remove(codigo);
      return true; // Eliminado
    }
    return false; // No confirmado
  };

})();