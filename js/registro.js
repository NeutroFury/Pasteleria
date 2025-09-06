function validarFormulario() {
  let errores = [];
  let mensajeDescuento = "";

  let nombre = document.getElementById("nombre").value.trim();
  let email = document.getElementById("email").value.trim();
  let edad = parseInt(document.getElementById("edad").value);
  let clave1 = document.getElementById("clave1").value;
  let clave2 = document.getElementById("clave2").value;

  // Validar nombre
  if (nombre === "") {
    errores.push("El nombre no puede estar vacío.");
  }

  // Validar correo
  if (!email.includes("@")) {
    errores.push("El correo electrónico no es válido.");
  }

  // Validar edad
  if (isNaN(edad) || edad <= 0) {
    errores.push("Ingrese una edad válida.");
  } else if (edad >= 50) {
    mensajeDescuento = `<div class="mi-alerta-descuento">Obtuviste un 50% de descuento</div>`;
  }

  // Validar contraseña
  if (clave1.length < 6) {
    errores.push("La contraseña debe tener al menos 6 caracteres.");
  }

  // Confirmar contraseña
  if (clave1 !== clave2) {
    errores.push("Las contraseñas no coinciden.");
  }

  // Mostrar mensajes
  let mensajesDiv = document.getElementById("mensajes");
  mensajesDiv.innerHTML = "";

  if (errores.length > 0) {
    mensajesDiv.innerHTML = `<div class="mi-alerta-error"><ul><li>${errores.join("</li><li>")}</li></ul></div>`;
  } else {
    mensajesDiv.innerHTML = `${mensajeDescuento}<div class="mi-alerta-exito ">✅ Registro exitoso</div>`;
  }
}

// Catálogo de productos de ejemplo
const productos = [
  { codigo: "TC001", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Chocolate", precio: "45.000", descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales" },
  { codigo: "TC002", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Frutas", precio: "50.000", descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones." },
  { codigo: "TT001", categoria: "Tortas Circulares", nombre: "Torta Circular de Vainilla", precio: "40.000", descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión." },
  { codigo: "TT002", categoria: "Tortas Circulares", nombre: "Torta Circular de Manjar", precio: "42.000", descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos." },
  { codigo: "PI001", categoria: "Postres Individuales", nombre: "Mousse de Chocolate", precio: "5.000", descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate." },
  { codigo: "PI002", categoria: "Postres Individuales", nombre: "Tiramisú Clásico", precio: "5.500", descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida." },
  { codigo: "PSA001", categoria: "Productos Sin Azúcar", nombre: "Torta Sin Azúcar de Naranja ", precio: "48.000", descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables." },
  { codigo: "PSA002", categoria: "Productos Sin Azúcar", nombre: "Cheesecake Sin Azúcar", precio: "47.000", descripcion: "Suave y cremoso, este cheesecake es una opción perfecta paradisfrutar sin culpa." },
  { codigo: "PT001", categoria: "Pastelería Tradicional", nombre: "Empanada de Manzana", precio: "3.000", descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda." },
  { codigo: "PI002", categoria: "Pastelería Tradicional", nombre: "Tarta de Santiago", precio: "6.000", descripcion: "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos." },
  { codigo: "PG001", categoria: "Productos Sin Gluten", nombre: "Brownie Sin Gluten", precio: "4.000", descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor." },
  { codigo: "PG002", categoria: "Productos Sin Gluten", nombre: "Pan Sin Gluten ", precio: "3.500", descripcion: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquiercomida." },
  { codigo: "PG001", categoria: "Productos Vegana", nombre: "Torta Vegana de Chocolate", precio: "50.000", descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos." },
  { codigo: "PV002", categoria: "Productos Vegana", nombre: "Galletas Veganas de Avena ", precio: "4.500", descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano." },
  { codigo: "TE001", categoria: "Tortas Especiales", nombre: "Torta Especial de Cumpleaños", precio: "55.000", descripcion: " Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos." },
  { codigo: "TE002", categoria: "Tortas Especiales", nombre: "Torta Especial de Boda", precio: "60.000", descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda."}
];

// Función para mostrar el catálogo completo
function mostrarCatalogo(productosMostrados = productos) {
  const catalogoDiv = document.getElementById("catalogo");
  if (!catalogoDiv) return;
  catalogoDiv.innerHTML = productosMostrados.map(producto => `
    <div class="producto">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <span>Precio: $${producto.precio}</span>
    </div>
  `).join("");
}

// Función para filtrar productos por nombre
function filtrarProductos(nombre) {
  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(nombre.toLowerCase()));
  mostrarCatalogo(filtrados);
}

// Puedes llamar mostrarCatalogo() al cargar la página o desde un botón
// Ejemplo: window.onload = () => mostrarCatalogo();
// Para filtrar, puedes usar filtrarProductos('chocolate')


