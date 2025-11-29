// ============================================
// CARRITO DE COMPRAS SIMPLE - PASTELERÍA MIL SABORES
// ============================================

// Lista de productos de la pastelería (versión simplificada)
const productos = [
  { id: 1, nombre: "Torta Cuadrada de Chocolate", precio: 45000, categoria: "Tortas Cuadradas" },
  { id: 2, nombre: "Torta Cuadrada de Frutas", precio: 50000, categoria: "Tortas Cuadradas" },
  { id: 3, nombre: "Torta Circular de Vainilla", precio: 40000, categoria: "Tortas Circulares" },
  { id: 4, nombre: "Torta Circular de Manjar", precio: 42000, categoria: "Tortas Circulares" },
  { id: 5, nombre: "Mousse de Chocolate", precio: 5000, categoria: "Postres Individuales" },
  { id: 6, nombre: "Tiramisú Clásico", precio: 5500, categoria: "Postres Individuales" },
  { id: 7, nombre: "Cheesecake Sin Azúcar", precio: 47000, categoria: "Productos Sin Azúcar" },
  { id: 8, nombre: "Empanada de Manzana", precio: 3000, categoria: "Pastelería Tradicional" },
  { id: 9, nombre: "Brownie Sin Gluten", precio: 4000, categoria: "Productos Sin Gluten" },
  { id: 10, nombre: "Torta Vegana de Chocolate", precio: 50000, categoria: "Productos Veganos" },
  { id: 11, nombre: "Torta Santiago", precio: 6000, categoria: "Pastelería Tradicional"},
  { id: 12, nombre: "Torta Sin Azúcar de Naranja", precio: 7000, categoria: "Productos Sin Azúcar" },
  { id: 13, nombre: "Galletas Veganas de Avena", precio: 4500, categoria: "Productos Veganos" },
  { id: 14, nombre: "Torta Especial de Cumpleaños", precio: 55000, categoria: "Tortas Especiales" },
  { id: 15, nombre: "Torta Especial de Boda", precio: 60000, categoria: "Tortas Especiales"},
  { id: 16, nombre: "Pan Sin Gluten", precio: 3500, categoria: "Productos Sin Gluten" }
];

// ============================================
// VARIABLES GLOBALES
// ============================================

// Obtener el carrito del localStorage o crear uno vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Lista de productos filtrados (copia de todos los productos)
let productosFiltrados = [...productos];

// ============================================
// INICIAR CUANDO CARGA LA PÁGINA
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está logueado
  const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  if (!loggedIn) {
    // Si no está logueado, redirigir al login
    alert("⚠️ Debes iniciar sesión para acceder al carrito");
    window.location.href = "login.html";
    return;
  }

  // Si está logueado, inicializar el carrito
  mostrarCategorias();
  mostrarProductos(productosFiltrados);
  mostrarCarrito();

  // Botón para limpiar todo el carrito
  const btnLimpiar = document.getElementById("btnLimpiar");
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", limpiarCarrito);
  }
});

// ============================================
// MOSTRAR CATEGORÍAS EN UN SELECT (DROPDOWN)
// ============================================
function mostrarCategorias() {
  const select = document.getElementById("filtroCategoria");
  if (!select) return;

  // Obtener todas las categorías únicas de los productos
  const categorias = ["Todos", ...new Set(productos.map(p => p.categoria))];

  // Limpiar el select y agregar las opciones
  select.innerHTML = "";
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  // Escuchar cuando cambie la categoría seleccionada
  select.addEventListener("change", (e) => {
    const categoria = e.target.value;
    
    // Filtrar productos según la categoría seleccionada
    productosFiltrados = (categoria === "Todos")
      ? [...productos]  // Si es "Todos", mostrar todos
      : productos.filter(p => p.categoria === categoria);  // Si no, filtrar por categoría

    // Mostrar los productos filtrados
    mostrarProductos(productosFiltrados);
  });
}

// ============================================
// MOSTRAR PRODUCTOS FILTRADOS EN PANTALLA
// ============================================
function mostrarProductos(lista) {
  const contenedor = document.getElementById("listaProductos");
  if (!contenedor) return;

  // Limpiar el contenedor
  contenedor.innerHTML = "";

  // Si no hay productos, mostrar mensaje
  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No hay productos en esta categoría.</p>";
    return;
  }

  // Crear una tarjeta mejorada para cada producto
  lista.forEach(producto => {
    const item = document.createElement("div");
    item.classList.add("item-producto");
    
    // Crear el HTML mejorado del producto
    item.innerHTML = `
      <strong>${producto.nombre}</strong>
      <div class="categoria">Categoría: ${producto.categoria}</div>
      <div class="precio">Precio: $${producto.precio.toLocaleString("es-CL")}</div>
      <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
    `;
    
    contenedor.appendChild(item);
  });
}

// ============================================
// AGREGAR PRODUCTOS AL CARRITO
// ============================================
function agregarAlCarrito(id) {
  // Buscar el producto en la lista
  const producto = productos.find(p => p.id === id);
  
  // Verificar si ya existe en el carrito
  const existe = carrito.find(p => p.id === id);

  if (existe) {
    // Si ya existe, verificar límite de 5 unidades
    if (existe.cantidad >= 5) {
      alert("⚠️ No puedes agregar más de 5 unidades de este producto.");
      return;
    }
    // Si no ha llegado al límite, aumentar la cantidad
    existe.cantidad++;
  } else {
    // Si no existe, agregarlo al carrito con cantidad 1
    carrito.push({ ...producto, cantidad: 1 });
  }

  // Guardar en localStorage y actualizar la vista
  guardarCarrito();
}

// ============================================
// MOSTRAR CARRITO CON PRODUCTOS Y TOTAL
// ============================================
function mostrarCarrito() {
  const contenedor = document.getElementById("carrito");
  const totalElemento = document.getElementById("total");
  
  if (!contenedor) return;

  // Limpiar el contenedor
  contenedor.innerHTML = "";

  // Si el carrito está vacío
  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío.</p>";
    if (totalElemento) totalElemento.textContent = "Total: $0";
    return;
  }

  let total = 0;

  // Crear una tarjeta simple para cada producto en el carrito (como el ejemplo del profesor)
  carrito.forEach(producto => {
    const item = document.createElement("div");
    item.classList.add("item-carrito");
    
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;
    
    item.innerHTML = `
      <strong>${producto.nombre}</strong><br>
      Precio: $${producto.precio.toLocaleString("es-CL")} x ${producto.cantidad} = $${subtotal.toLocaleString("es-CL")}<br>
      <div class="carrito-cantidad">
        <button onclick="disminuir(${producto.id})" ${producto.cantidad <= 1 ? 'disabled' : ''}>-</button>
        <span>${producto.cantidad}</span>
        <button onclick="aumentar(${producto.id})" ${producto.cantidad >= 5 ? 'disabled' : ''}>+</button>
      </div>
    `;
    
    contenedor.appendChild(item);
  });

  // Mostrar el total
  if (totalElemento) {
    totalElemento.textContent = `Total: $${total.toLocaleString("es-CL")}`;
  }
}

// ============================================
// AUMENTAR CANTIDAD DE UN PRODUCTO
// ============================================
function aumentar(id) {
  const producto = carrito.find(p => p.id === id);
  
  if (producto && producto.cantidad < 5) {
    // Si no ha llegado al límite de 5, aumentar
    producto.cantidad++;
  } else {
    // Si ya llegó al límite, mostrar mensaje
    alert("⚠️ Máximo 5 unidades por producto.");
  }
  
  // Guardar y actualizar
  guardarCarrito();
}

// ============================================
// DISMINUIR CANTIDAD DE UN PRODUCTO
// ============================================
function disminuir(id) {
  const producto = carrito.find(p => p.id === id);
  
  if (producto) {
    // Disminuir la cantidad
    producto.cantidad--;
    
    // Si la cantidad llega a 0, eliminar del carrito
    if (producto.cantidad <= 0) {
      carrito = carrito.filter(p => p.id !== id);
    }
  }
  
  // Guardar y actualizar
  guardarCarrito();
}

// ============================================
// LIMPIAR TODO EL CARRITO
// ============================================
function limpiarCarrito() {
  carrito = [];
  guardarCarrito();
}

// ============================================
// GUARDAR CARRITO EN LOCALSTORAGE
// ============================================
function guardarCarrito() {
  // Guardar en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
  
  // Actualizar la vista del carrito
  mostrarCarrito();
}
