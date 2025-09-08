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

        productDiv.innerHTML = `
          <img src="${producto.img}" alt="${producto.nombre}" class="carrito-img" />
          <div class="carrito-info">
            <h2 class="carrito-nombre">${producto.nombre}</h2>
            <p class="carrito-desc">${producto.descripcion}</p>
          </div>
          <div class="carrito-precio">$${producto.precio}</div>
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

    // Calcular el total
    const total = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
    cartTotalContainer.innerHTML = `<p>Total: $${total}</p>`;
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
    if (coupon === "DESCUENTO10") {
      const total = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
      const discountedTotal = total * 0.9; // Aplica el 10% de descuento
      cartTotalContainer.innerHTML = `<p>Total con descuento: $${discountedTotal.toFixed(2)}</p>`;
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