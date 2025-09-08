document.addEventListener("DOMContentLoaded", () => {
  // Obtener el carrito de productos desde localStorage
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const couponBtn = document.querySelector(".carrito-cupon-btn");
  const couponInput = document.querySelector(".carrito-cupon-input");

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
              <span>Precio unitario: $${producto.precio}</span>
              <span>Cantidad: ${producto.cantidad}</span>
              <span class="subtotal">Subtotal: $${subtotal}</span>
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

  // Función para renderizar el resumen detallado del carrito
  function renderResumenDetallado() {
    const subtotal = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
    const impuesto = subtotal * 0.19; // IVA 19%
    const descuento = calcularDescuento();
    const total = subtotal + impuesto - descuento;

    cartTotalContainer.innerHTML = `
      <div class="resumen-detallado">
        <h3>Resumen de tu compra</h3>
        <div class="resumen-linea">
          <span>Subtotal (${carrito.length} ${carrito.length === 1 ? 'producto' : 'productos'}):</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="resumen-linea">
          <span>IVA (19%):</span>
          <span>$${impuesto.toFixed(2)}</span>
        </div>
        ${descuento > 0 ? `
        <div class="resumen-linea descuento">
          <span>Descuento aplicado:</span>
          <span>-$${descuento.toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="resumen-linea total">
          <span><strong>Total a pagar:</strong></span>
          <span><strong>$${total.toFixed(2)}</strong></span>
        </div>
      </div>
    `;
  }

  // Función para calcular descuentos
  function calcularDescuento() {
    const coupon = couponInput ? couponInput.value.trim().toUpperCase() : '';
    const subtotal = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
    
    if (coupon === "DESCUENTO10") {
      return subtotal * 0.1; // 10% de descuento
    } else if (coupon === "BIENVENIDO") {
      return 5000; // Descuento fijo de $5.000
    }
    return 0;
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

  // Función para aplicar cupones de descuento
  function applyDiscount() {
    const coupon = couponInput.value.trim().toUpperCase();
    if (coupon === "DESCUENTO10" || coupon === "BIENVENIDO") {
      renderResumenDetallado(); // Re-renderizar con el descuento aplicado
      couponInput.style.borderColor = "#28a745";
      couponInput.style.backgroundColor = "#d4edda";
    } else if (coupon !== "") {
      couponInput.style.borderColor = "#dc3545";
      couponInput.style.backgroundColor = "#f8d7da";
      alert("Cupón no válido. Prueba con: DESCUENTO10 o BIENVENIDO");
    }
  }

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

  // Aplicar descuento
  couponBtn.addEventListener("click", applyDiscount);

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
});