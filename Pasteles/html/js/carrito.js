document.addEventListener("DOMContentLoaded", () => {
  // Obtener el carrito de productos desde localStorage
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  // Función para renderizar los productos en el carrito
  function renderCarrito() {
    // Limpiar el contenedor del carrito
    cartItemsContainer.innerHTML = "";

    if (carrito.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="carrito-vacio">
          <p>🛒 Tu carrito está vacío</p>
          <p style="font-size: 1rem; margin-top: 1rem; color: #8b5a3c;">
            ¡Agrega algunos productos deliciosos!
          </p>
        </div>
      `;
    } else {
      carrito.forEach((producto, index) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("carrito-item");

        const subtotal = producto.precio * producto.cantidad;

        productDiv.innerHTML = `
          <img src="${producto.img}" alt="${producto.nombre}" class="carrito-img" />
          <div class="carrito-info">
            <h2 class="carrito-nombre">${producto.nombre}</h2>
            <p class="carrito-desc">${producto.descripcion}</p>
            <div class="carrito-precio-detalle">
              <span>Precio unitario: $${formatoChileno(producto.precio)}</span>
              <span>Cantidad: ${producto.cantidad}</span>
              <span class="subtotal">Subtotal: $${formatoChileno(subtotal)}</span>
            </div>
          </div>
          <div class="carrito-cantidad">
            <button class="carrito-btn decrease" data-index="${index}">-</button>
            <input type="number" value="${producto.cantidad}" min="1" class="carrito-input" data-index="${index}" />
            <button class="carrito-btn increase" data-index="${index}">+</button>
          </div>
          <button class="carrito-btn remove" data-index="${index}">Eliminar</button>
        `;

        cartItemsContainer.appendChild(productDiv);
      });
    }

    // Calcular resumen detallado
    renderResumenDetallado();
  }

  // Función para formatear números al estilo chileno
  function formatoChileno(numero) {
    return numero.toLocaleString('es-CL');
  }

  // Función para renderizar el resumen detallado del carrito
  function renderResumenDetallado() {
    const subtotal = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
    const { amount: descuento, label: etiquetaDescuento } = calcularDescuento();
    const subtotalConDescuento = subtotal - descuento;
    const impuesto = subtotalConDescuento * 0.19; // IVA 19% sobre el subtotal con descuento
    const total = subtotalConDescuento + impuesto;
    const hayTortaGratis = carrito.some(p => p.codigo === 'BIRTHDAY_CAKE_FREE');

    cartTotalContainer.innerHTML = `
      <div class="resumen-detallado">
        <h3>Resumen de tu compra</h3>
        <div class="resumen-linea">
          <span>Subtotal (${carrito.length} ${carrito.length === 1 ? 'producto' : 'productos'}):</span>
          <span>$${formatoChileno(Math.round(subtotal))}</span>
        </div>
        ${descuento > 0 ? `
        <div class="resumen-linea descuento">
          <span>Descuento aplicado — ${etiquetaDescuento}:</span>
          <span>-$${formatoChileno(Math.round(descuento))}</span>
        </div>
        ` : ''}
        ${hayTortaGratis ? `
        <div class="resumen-linea">
          <span>Beneficio aplicado:</span>
          <span>Torta de cumpleaños gratis (Duoc)</span>
        </div>
        ` : ''}
        <div class="resumen-linea">
          <span>IVA (19%):</span>
          <span>$${formatoChileno(Math.round(impuesto))}</span>
        </div>
        <div class="resumen-linea total">
          <span><strong>Total a pagar:</strong></span>
          <span><strong>$${formatoChileno(Math.round(total))}</strong></span>
        </div>
      </div>
    `;
  }

  // Función para calcular descuentos
  function calcularDescuento() {
    const subtotal = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);

    // Descuento de por vida para usuarios registrados con FELICES50
    const session = JSON.parse(localStorage.getItem("loggedIn")) || null;
    const tieneDescuentoDePorVida = session && session.hasLifetime10 === true;
    const descuentoDePorVida = tieneDescuentoDePorVida ? subtotal * 0.1 : 0; // 10% permanente
    const etiquetaDePorVida = tieneDescuentoDePorVida ? '10% de por vida (FELICES50)' : '';

    return { amount: descuentoDePorVida, label: etiquetaDePorVida || '—' };
  }

  // Actualizar cantidad
  function updateQuantity(index, cantidad) {
    carrito[index].cantidad = cantidad;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  }

  // Eliminar producto
  function removeItem(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  }

  // (Cupón eliminado; el descuento se aplica automáticamente si corresponde)

  // Función para manejar los eventos de cantidad y eliminar productos
  function handleCartActions(e) {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("increase")) {
      updateQuantity(index, carrito[index].cantidad + 1);
    } else if (e.target.classList.contains("decrease") && carrito[index].cantidad > 1) {
      updateQuantity(index, carrito[index].cantidad - 1);
    } else if (e.target.classList.contains("remove")) {
      removeItem(index);
    }
  }

  // Manejar la compra
  checkoutBtn.addEventListener("click", () => {
    if (carrito.length > 0) {
      localStorage.removeItem("carrito"); // Limpiar carrito después de la compra
      renderCarrito(); // Volver a renderizar el carrito vacío
    }
  });

  // (Sin botón de cupón)

  // Escuchar cambios en las cantidades
  cartItemsContainer.addEventListener("input", (e) => {
    if (e.target.classList.contains("carrito-input")) {
      const index = e.target.dataset.index;
      const cantidad = parseInt(e.target.value);
      if (cantidad > 0) {
        updateQuantity(index, cantidad);
      }
    }
  });

  // Escuchar clics en los botones de aumentar, disminuir y eliminar
  cartItemsContainer.addEventListener("click", handleCartActions);

  // Renderizar el carrito al cargar la página
  renderCarrito();
  
  // Agregar automáticamente torta gratis si corresponde (una vez por día)
  try {
    const session = JSON.parse(localStorage.getItem("loggedIn")) || null;
    const todayKey = new Date().toISOString().slice(0,10); // YYYY-MM-DD
    const grantKey = `freeCakeGranted_${todayKey}`;
    const yaAgregadaHoy = localStorage.getItem(grantKey) === '1';
    if (session && session.freeCakeEligibleToday && !yaAgregadaHoy) {
      // Verificar si ya existe un item gratis hoy en el carrito
      let carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
      const existeGratis = carritoActual.some(p => p.codigo === 'BIRTHDAY_CAKE_FREE');
      if (!existeGratis) {
        const itemGratis = {
          codigo: 'BIRTHDAY_CAKE_FREE',
          categoria: 'Promociones',
          nombre: 'Torta de cumpleaños (gratis)',
          precio: 0,
          descripcion: 'Beneficio por cumpleaños para estudiantes Duoc',
          img: 'img/Pastel_14.png',
          cantidad: 1
        };
        carritoActual.push(itemGratis);
        localStorage.setItem("carrito", JSON.stringify(carritoActual));
        localStorage.setItem(grantKey, '1');
        carrito = carritoActual;
        renderCarrito();
      }
    }
  } catch (e) {
    console.error('No se pudo evaluar beneficio de torta gratis:', e);
  }
});