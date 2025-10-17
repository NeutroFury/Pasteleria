document.addEventListener("DOMContentLoaded", () => {
  // Exponer función global para cambiar imagen principal usada por onmouseover en miniaturas
  window.cambiarImagen = function (src) {
    const principal = document.getElementById('imgPrincipal');
    if (principal && src) {
      principal.src = src;
    }
  };

  // Asegurar cabecera compatible con main.js y cargarlo
  (function ensureHeaderAndMain() {
    try {
      const loginUl = document.querySelector('ul.login_register');
      if (loginUl) {
        // Identificar lis existentes por href
        const lis = Array.from(loginUl.querySelectorAll('li'));
        const findLiByHref = (hrefEndsWith) => lis.find(li => li.querySelector(`a[href$="${hrefEndsWith}"]`));

        const liLogin = findLiByHref('login.html');
        const liRegistro = findLiByHref('registro.html');
        const liCarrito = findLiByHref('carrito.html');

        // Crear enlaces faltantes si no existen
        if (!liLogin) {
          const li = document.createElement('li');
          li.id = 'loginLink';
          const a = document.createElement('a');
          a.href = 'login.html';
          a.textContent = 'Iniciar sesión';
          li.appendChild(a);
          loginUl.appendChild(li);
        } else {
          liLogin.id = 'loginLink';
        }

        if (!liRegistro) {
          const li = document.createElement('li');
          li.id = 'registerLink';
          const a = document.createElement('a');
          a.href = 'registro.html';
          a.textContent = 'Registrar usuario';
          li.appendChild(a);
          loginUl.appendChild(li);
        } else {
          liRegistro.id = 'registerLink';
        }

        if (liCarrito) liCarrito.id = 'cartLink';

        // Crear logout si no existe
        if (!loginUl.querySelector('#logoutLink')) {
          const liLogout = document.createElement('li');
          liLogout.id = 'logoutLink';
          liLogout.style.display = 'none';
          const a = document.createElement('a');
          a.href = 'javascript:void(0)';
          a.id = 'logoutLink';
          a.textContent = 'Cerrar sesión';
          liLogout.appendChild(a);
          loginUl.appendChild(liLogout);
        }

        // Crear contenedor de usuario si falta
        if (!document.getElementById('userInfo')) {
          const header = document.querySelector('header');
          if (header) {
            const div = document.createElement('div');
            div.id = 'userInfo';
            div.style.display = 'none';
            const p = document.createElement('p');
            const span = document.createElement('span');
            span.id = 'userEmail';
            p.appendChild(span);
            div.appendChild(p);
            header.appendChild(div);
          }
        }
      }

      // Aplicar lógica de sesión directamente aquí para evitar problemas de timing
      const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
      const loginLink = document.getElementById("loginLink");
      const registerLink = document.getElementById("registerLink");
      const logoutLink = document.getElementById("logoutLink");
      const cartLink = document.getElementById("cartLink");
      const userInfo = document.getElementById("userInfo");
      const userName = document.getElementById("userEmail");

      if (loggedIn) {
        // Si el usuario está logueado, ocultamos los enlaces "Iniciar sesión" y "Registrar usuario"
        if (loginLink) loginLink.style.display = "none";
        if (registerLink) registerLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "block"; // Mostrar "Cerrar sesión"
        if (cartLink) cartLink.style.display = "block"; // Mostrar "Carrito"
        if (userInfo) userInfo.style.display = "block"; // Mostrar la información del usuario
        if (userName) userName.textContent = loggedIn.nombre; // Mostrar el nombre del usuario
      } else {
        // Si no está logueado, mostramos los enlaces "Iniciar sesión" y "Registrar usuario"
        if (loginLink) loginLink.style.display = "block";
        if (registerLink) registerLink.style.display = "block";
        if (logoutLink) logoutLink.style.display = "none";
        if (cartLink) cartLink.style.display = "none";
        if (userInfo) userInfo.style.display = "none"; // Ocultar la información del usuario
      }

      // Lógica para cerrar sesión
      if (logoutLink) {
        logoutLink.addEventListener("click", () => {
          localStorage.removeItem("loggedIn"); // Solo borrar la sesión del usuario
          window.location.href = "login.html"; // Redirigir a login después de cerrar sesión
        });
      }
    } catch (e) {
      console.error('No se pudo preparar el header:', e);
    }
  })();

  const form = document.querySelector(".producto-form");
  if (!form) return;

  function parsePrecio(texto) {
    if (!texto) return 0;
    const limpio = texto.replace(/\$/g, '').replace(/\./g, '').replace(/\s/g, '');
    const numero = parseInt(limpio, 10);
    return isNaN(numero) ? 0 : numero;
  }

  function formatoChileno(numero) {
    return numero.toLocaleString('es-CL');
  }

  function updateCartCount() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const cartLink = document.querySelector(".cart");
    if (!cartLink) return;
    const cartCount = carrito.reduce((total, producto) => total + (producto.cantidad || 0), 0);
    cartLink.textContent = `🛒 Carrito (${cartCount})`;
  }

  // Reemplazar selector de cantidad por input numérico sin límite superior
  (function normalizeCantidadControl() {
    const selector = document.getElementById('cantidad');
    if (selector && selector.tagName.toLowerCase() === 'select') {
      const value = parseInt(selector.value || '1', 10) || 1;
      const input = document.createElement('input');
      input.type = 'number';
      input.id = 'cantidad';
      input.className = selector.className;
      input.style.cssText = selector.getAttribute('style') || '';
      input.min = '1';
      input.step = '1';
      input.value = String(value);
      selector.parentNode.replaceChild(input, selector);
    }
  })();

  // Hacer clic en productos relacionados navegable según imagen
  (function enableRelatedNavigation() {
    const grid = document.querySelector('.productos-relacionados-grid');
    if (!grid) return;

    function resolverHrefDesdeSrc(src) {
      if (!src) return null;
      const nombre = src.split('/').pop().toLowerCase();
      // pastel_#.png o pastel-#.png o Pastel_#.png
      const m = nombre.match(/pastel[_-]?(\d+)\.png/i);
      if (m) return `pastel${m[1]}.html`;
      if (nombre.includes('cheesecake')) return 'pastelcheesecake.html';
      return null;
    }

    grid.querySelectorAll('img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        const href = resolverHrefDesdeSrc(img.getAttribute('src'));
        if (href) window.location.href = href;
      });
    });
  })();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.querySelector(".titulo-producto")?.textContent?.trim() || "Producto";
    const precioTexto = document.querySelector(".producto-precio")?.textContent?.trim() || "$0";
    const precio = parsePrecio(precioTexto);
    const descripcion = document.querySelector(".producto-descripcion")?.textContent?.trim() || "";
    const img = document.getElementById("imgPrincipal")?.getAttribute("src") || "";
    const cantidad = parseInt(document.getElementById("cantidad")?.value || "1", 10) || 1;

    const archivo = (window.location.pathname.split('/').pop() || '').toLowerCase();
    const codigoBase = archivo.replace('.html', '').toUpperCase();
    const codigo = `DETAIL_${codigoBase}`;

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carrito.find((item) => item.codigo === codigo);

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({ codigo, categoria: "Detalles", nombre, precio, descripcion, img, cantidad });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    updateCartCount();

    // Retroalimentación simple
    const boton = form.querySelector("button[type='submit']");
    if (boton) {
      const textoOriginal = boton.textContent;
      boton.textContent = "Añadido ✔";
      boton.disabled = true;
      setTimeout(() => {
        boton.textContent = textoOriginal;
        boton.disabled = false;
      }, 1200);
    }
  });

  updateCartCount();
});


