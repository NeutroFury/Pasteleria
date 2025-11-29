// =================================================================
// 1️⃣  Checkout.logic.js (Lógica pura)
// Archivo de lógica pura para el componente Checkout.
// Colocar en /src/utils/Checkout.logic.js
// =================================================================

(function (window) {
    // Import api service if available (bundler will include it)
    try {
        // require may not be available in the bundler environment; attempt to use global import
        // eslint-disable-next-line no-undef
        // if api was bundled as module, it can be accessed via window.api
        // otherwise attempt to read from module system (some bundlers expose 'require')
        if (typeof window.api === 'undefined') {
            try {
                // eslint-disable-next-line no-undef
                const maybe = require && require('../services/api') ? require('../services/api').default : null;
                if (maybe) window.api = maybe;
            } catch {}
        }
    } catch {}
    /**
     * Evita la redeclaración de la lógica si el script se carga múltiples veces,
     * previniendo errores en Karma.
     */
    if (window.CheckoutLogic) {
        return;
    }

    /**
     * Contenedor para toda la lógica del componente Checkout.
     */
    window.CheckoutLogic = {
        /**
         * Carga el carrito desde localStorage al montar el componente.
         * Maneja errores de parsing de JSON o datos malformados.
         * @param {function} setCarrito - El setter de estado de React para 'carrito'.
         */
        cargarCarrito: function (setCarrito) {
            try {
                const raw = localStorage.getItem("carrito");
                const arr = raw ? JSON.parse(raw) : [];
                // Asegura que el estado siempre sea un array
                setCarrito(Array.isArray(arr) ? arr : []);
            } catch {
                setCarrito([]);
            }
        },

        /**
         * Formatea un número a la moneda local (Peso Chileno).
         * @param {number|string} n - El número a formatear.
         * @returns {string} - El número formateado como CLP (e.g., "$1.000").
         */
        CLP: function (n) {
                // Manejo especial para null y undefined
                if (n === null || n === undefined) {
                    return '$0';
                }
                const num = Number(n);
                if (isNaN(num)) {
                    return '$0';
                }
                return num.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
                maximumFractionDigits: 0,
            });
        },

        /**
         * Calcula el total de la compra basado en los items del carrito.
         * @param {Array<Object>} carrito - El array de items del carrito.
         * @returns {number} - El total numérico de la compra.
         */
        calcularTotal: function (carrito) {
            // Verifica que 'carrito' sea un array antes de intentar reducirlo
            return (Array.isArray(carrito) ? carrito : []).reduce(
                (sum, it) => sum + (Number(it.precio) || 0) * (Number(it.cantidad) || 1),
                0
            );
        },

        /**
         * Valida los campos del formulario.
         * @param {Object} vals - El objeto 'form' con los valores actuales.
         * @returns {Object} - Un objeto 'errors' (vacío si no hay errores).
         */
        validateFields: function (vals) {
            const err = {};
            const req = ["nombre", "apellidos", "correo", "calle", "region", "comuna"];
            
            // Valida campos requeridos
            req.forEach((k) => {
                if (!String(vals[k] || "").trim()) {
                    err[k] = "Campo obligatorio";
                }
            });
            
            // Valida formato de correo
            if (vals.correo && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(vals.correo)) {
                err.correo = "Correo inválido";
            }
            return err;
        },

        /**
         * Manejador 'onChange' para actualizar el estado del formulario y limpiar errores.
         * @param {Event} e - El evento del input.
         * @param {function} setForm - El setter de estado de React para 'form'.
         * @param {function} setErrors - El setter de estado de React para 'errors'.
         */
        actualizar: function (e, setForm, setErrors) {
            const { name, value } = e.target;
            setForm((f) => ({ ...f, [name]: value }));
            // Limpia el error del campo específico al escribir en él
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        },

        /**
         * Manejador 'onBlur' para marcar un campo como 'tocado'.
         * @param {Event} e - El evento del input.
         * @param {function} setTouched - El setter de estado de React para 'touched'.
         */
        onBlur: function (e, setTouched) {
            const { name } = e.target;
            setTouched((t) => ({ ...t, [name]: true }));
        },

        /**
         * Manejador 'onSubmit' del formulario de pago.
         * Valida, crea la orden y navega a la página de éxito o error.
         * @param {Event} e - El evento del formulario.
         * @param {Object} form - El estado 'form' del componente.
         * @param {Array<Object>} carrito - El estado 'carrito' del componente.
         * @param {number} total - El total calculado.
         * @param {function} navigate - La función 'navigate' de react-router-dom.
         */
        pagar: function (e, form, carrito, total, navigate) {
            e.preventDefault();
            
            // Llama a la función de validación interna
            const err = window.CheckoutLogic.validateFields(form);

            // Armar objeto de orden (siempre se crea, con o sin errores)
            // Se usan funciones nativas (Date) que son seguras en Karma/Jasmine
            const orden = {
                id: `ORD-${Date.now()}`,
                codigo: `ORDER${String(Date.now()).slice(-5)}`,
                nro: `#${new Date().getFullYear()}${String(Date.now()).slice(-4)}`,
                total,
                items: carrito,
                cliente: form,
                fecha: new Date().toISOString(),
            };
            localStorage.setItem("ultima_orden", JSON.stringify(orden));

            // Si faltan datos o el correo es inválido, ir a Pago-mal
            if (Object.keys(err).length > 0) {
                navigate("/pago-mal");
                return; // Detiene la ejecución
            }

            // Si hay token, intentar procesar la orden en backend
            const token = localStorage.getItem('token');
            if (token && window.api && typeof window.api.checkout === 'function') {
                const payload = {
                    cliente: form,
                    items: carrito.map(it => ({ codigo: it.codigo, cantidad: it.cantidad })),
                    total,
                };
                window.api.checkout(payload)
                    .then(() => {
                        // limpiar carrito local y notificar
                        localStorage.setItem("carrito", JSON.stringify([]));
                        window.dispatchEvent(new Event("carrito-changed"));
                        navigate("/pago-bien");
                    })
                    .catch(() => {
                        navigate('/pago-mal');
                    });
                return;
            }

            // Fallback local: Éxito: limpiar carrito y navegar a Pago-bien
            localStorage.setItem("carrito", JSON.stringify([]));
            window.dispatchEvent(new Event("carrito-changed")); // Dispara evento global
            navigate("/pago-bien");
        }
    };

})(window);