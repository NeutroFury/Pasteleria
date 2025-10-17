document.addEventListener("DOMContentLoaded", () => {
  // Función para formatear números al estilo chileno
  function formatoChileno(numero) {
    return numero.toLocaleString('es-CL');
  }

  // Lista de productos
  const productos = [
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
    { codigo: "TE002", categoria: "Tortas Especiales", nombre: "Torta Especial de Boda", precio: 60000, descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.", img: "img/Pastel_15.png" },
  ];

  const gridProductos = document.getElementById("gridProductos");

  // Resolver href de detalle a partir de la imagen
  function obtenerHrefDetalle(producto) {
    const ruta = producto.img || '';
    const nombreArchivo = ruta.split('/').pop().toLowerCase();
    if (nombreArchivo.startsWith('pastel_')) {
      const match = nombreArchivo.match(/^pastel_(\d+)\.png$/);
      if (match) {
        return `pastel${match[1]}.html`;
      }
    }
    if (nombreArchivo === 'cheesecake.png') {
      return 'pastelcheesecake.html';
    }
    // Fallback
    return 'productos.html';
  }

  // Función para renderizar los productos
  function renderProductos() {
    productos.forEach((producto) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("producto");
      productDiv.setAttribute("data-id", producto.codigo);

      const hrefDetalle = obtenerHrefDetalle(producto);

      productDiv.innerHTML = `
        <a href="${hrefDetalle}" class="producto-link">
          <img src="${producto.img}" alt="${producto.nombre}" class="producto-img" />
        </a>
        <h3 class="producto-nombre">${producto.nombre}</h3>
        <p class="producto-desc">${producto.descripcion}</p>
        <span class="producto-precio">$${formatoChileno(producto.precio)}</span>
        <button class="producto-btn">Añadir al carrito</button>
      `;

      // Añadir producto al grid
      gridProductos.appendChild(productDiv);

      // Evento para añadir al carrito
      const addButton = productDiv.querySelector(".producto-btn");
      addButton.addEventListener("click", () => addToCart(producto));
    });
  }

  // Función para agregar un producto al carrito
  function addToCart(product) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const productoExistente = carrito.find((item) => item.codigo === product.codigo);

    if (productoExistente) {
      // Si el producto ya está en el carrito, aumentamos la cantidad
      productoExistente.cantidad += 1;
    } else {
      // Si no, lo añadimos al carrito
      carrito.push({ ...product, cantidad: 1 });
    }

    // Guardamos el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    updateCartCount(); // Actualizamos el contador del carrito
  }

  // Función para actualizar el contador del carrito
  function updateCartCount() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const cartLink = document.querySelector(".cart");
    const cartCount = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    cartLink.textContent = `🛒 Carrito (${cartCount})`;
  }

  // Renderizamos los productos
  renderProductos();
  updateCartCount(); // Actualizamos el contador del carrito al cargar la página
});