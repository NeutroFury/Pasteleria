// ============================================
// CATÁLOGO DE PRODUCTOS - PASTELERÍA MIL SABORES
// ============================================

// Array completo de productos con información detallada
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
  { codigo: "TE002", categoria: "Tortas Especiales", nombre: "Torta Especial de Boda", precio: 60000, descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.", img: "img/Pastel_15.png" } 
];

// Función helper para formatear precios en pesos chilenos
const CLP = (n) => n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

// ============================================
// RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("gridProductos");
  if (!grid) return;

  // Configurar el grid de productos
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(220px, 1fr))";
  grid.style.gap = "16px";

  // Crear tarjetas para cada producto
  productos.forEach(p => {
    const card = document.createElement("div");
    // Estilos de la tarjeta de producto
    card.style.border = "1px solid #f0d9d2";
    card.style.borderRadius = "12px";
    card.style.overflow = "hidden";
    card.style.boxShadow = "0 8px 20px rgba(0,0,0,.06)";
    card.style.display = "flex";
    card.style.flexDirection = "column";

    // Imagen del producto
    const top = document.createElement("img");
    top.src = p.img;
    top.alt = p.nombre;
    top.loading = "lazy";
    top.style.width = "100%";
    top.style.height = "160px";
    top.style.objectFit = "cover";

    // Contenido de la tarjeta
    const body = document.createElement("div");
    body.style.padding = "10px 12px";

    // Título del producto
    const h3 = document.createElement("h3");
    h3.textContent = p.nombre;
    h3.style.margin = "0 0 6px";
    h3.style.color = "#7c3a2d";

    // Descripción del producto
    const desc = document.createElement("p");
    desc.textContent = p.descripcion;
    desc.style.margin = "0 0 10px";
    desc.style.color = "#7c3a2d";
    desc.style.opacity = ".9";

    // Fila con precio y botón
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";

    // Precio formateado
    const precio = document.createElement("strong");
    precio.textContent = CLP(p.precio);
    precio.style.color = "#7c3a2d";

    // Botón para agregar al carrito
    const btn = document.createElement("button");
    btn.textContent = "Agregar";
    btn.style.background = "#d16a8a";
    btn.style.color = "#fff";
    btn.style.border = "0";
    btn.style.borderRadius = "10px";
    btn.style.padding = "8px 12px";
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => agregarAlCarritoDesdeProductos(p.codigo));

    // Ensamblar la tarjeta
    row.appendChild(precio);
    row.appendChild(btn);

    body.appendChild(h3);
    body.appendChild(desc);
    body.appendChild(row);

    card.appendChild(top);
    card.appendChild(body);
    grid.appendChild(card);
  });
});

// ============================================
// FUNCIÓN PARA AGREGAR PRODUCTOS AL CARRITO
// ============================================
function agregarAlCarritoDesdeProductos(codigo) {
  // Verificar que el usuario esté logueado
  const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  if (!loggedIn) {
    alert("⚠️ Debes iniciar sesión para agregar productos al carrito");
    window.location.href = "login.html";
    return;
  }

  // Buscar el producto por su código único
  const producto = productos.find(p => p.codigo === codigo);
  if (!producto) {
    alert("❌ Producto no encontrado");
    return;
  }

  // Obtener carrito actual del localStorage
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
  // Verificar si el producto ya está en el carrito
  const existe = carrito.find(p => p.codigo === codigo);

  if (existe) {
    // Si ya existe, verificar límite de 5 unidades
    if (existe.cantidad >= 5) {
      alert("⚠️ No puedes agregar más de 5 unidades de este producto.");
      return;
    }
    // Incrementar cantidad si no ha llegado al límite
    existe.cantidad++;
  } else {
    // Si no existe, agregarlo al carrito con cantidad 1
    carrito.push({ ...producto, cantidad: 1 });
  }

  // Guardar carrito actualizado en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
  
  // Actualizar contador del carrito en el header
  const contadorCarrito = document.querySelector(".cart");
  if (contadorCarrito) {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contadorCarrito.textContent = `🛒 Carrito (${totalItems})`;
  }
  
  // Mostrar confirmación al usuario
  alert(`✅ ${producto.nombre} agregado al carrito`);
}
