function irA(pagina) {
    if (pagina === "inicio") {
        window.location.href = "../index.html";
    }
    else if (pagina === "productos") {
        window.location.href = "productos.html";
    }
    else if (pagina === "servicios") {
        window.location.href = "servicios.html";
    }
    else if (pagina === "contacto") {
        window.location.href = "contacto.html";
    }
}

// ------- Carrito -------
let cantidad = 0;
let total = 0;
const itemsCarrito = []; // { boton, nombre, detalle, precio }

const contador =
    document.getElementById("contador");
const carritoLista =
    document.getElementById("carritoLista");
const carritoTotalEl =
    document.getElementById("carritoTotal");
const btnFinalizar =
    document.getElementById("btnFinalizar");

// Número de WhatsApp del negocio (mismo que en Contacto)
const WHATSAPP_NEGOCIO = "5492993291631";
// TODO: reemplazar por el alias o CBU real para transferencias
const ALIAS_TRANSFERENCIA = "ALIAS.PENDIENTE";

function formatearPrecio(numero) {
    return "$" + numero.toLocaleString("es-AR");
}

// A cada botón "agregar" le asigno el precio y el detalle de esa opción,
// leyendo el texto del <strong> correspondiente (ej: "$55.900 (10kg)")
document.querySelectorAll(".opcion-precio").forEach(opcion => {
    const strong = opcion.querySelector("strong");
    const boton = opcion.querySelector(".agregar");
    if (!strong || !boton) return;

    const textoPrecio = strong.textContent.trim();
    const match = textoPrecio.match(/[\d.]+/);
    const precio = match
        ? parseInt(match[0].replace(/\./g, ""), 10)
        : 0;

    boton.dataset.precio = precio;
    boton.dataset.detalle = textoPrecio;
});

function actualizarCarritoUI() {
    if (contador) {
        contador.textContent = cantidad;
    }
    if (carritoTotalEl) {
        carritoTotalEl.textContent = formatearPrecio(total);
    }
    if (btnFinalizar) {
        btnFinalizar.disabled = cantidad === 0;
    }
    if (!carritoLista) return;

    if (itemsCarrito.length === 0) {
        carritoLista.innerHTML =
            '<p class="carrito-vacio">Tu carrito está vacío 🐾</p>';
        return;
    }

    carritoLista.innerHTML = "";
    itemsCarrito.forEach((item, indice) => {
        const fila = document.createElement("div");
        fila.className = "carrito-item";
        fila.innerHTML =
            '<div class="carrito-item-info">' +
                "<strong>" + item.nombre + "</strong>" +
                "<span>" + item.detalle + "</span>" +
            "</div>" +
            '<div class="carrito-item-precio">' +
                formatearPrecio(item.precio) +
            "</div>";
        carritoLista.appendChild(fila);
    });
}

const botonesAgregar =
    document.querySelectorAll(".agregar");
botonesAgregar.forEach(boton => {
    boton.addEventListener("click", () => {
        const yaAgregado =
            boton.classList.contains("agregado");
        const precio = parseInt(boton.dataset.precio, 10) || 0;

        if (yaAgregado) {
            cantidad--;
            total -= precio;
            boton.classList.remove("agregado");
            boton.textContent = "+";

            const indice = itemsCarrito.findIndex(item => item.boton === boton);
            if (indice !== -1) {
                itemsCarrito.splice(indice, 1);
            }
        } else {
            cantidad++;
            total += precio;
            boton.classList.add("agregado");
            boton.textContent = "✓";

            const articulo = boton.closest(".producto");
            const nombre = articulo
                ? articulo.querySelector("h3").textContent.trim()
                : "Producto";

            itemsCarrito.push({
                boton: boton,
                nombre: nombre,
                detalle: boton.dataset.detalle || "",
                precio: precio
            });
        }

        actualizarCarritoUI();
    });
});

function mostrarCarrito() {
    const panel = document.getElementById("carritoPanel");
    if (!panel) return;
    actualizarCarritoUI();
    panel.classList.toggle("abierto");
}

// Cierra el panel del carrito si se hace click afuera
document.addEventListener("click", (evento) => {
    const wrapper = document.querySelector(".carrito-wrapper");
    const panel = document.getElementById("carritoPanel");
    if (!wrapper || !panel) return;
    if (!wrapper.contains(evento.target)) {
        panel.classList.remove("abierto");
    }
});

if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
        if (itemsCarrito.length === 0) return;

        let mensaje = "Hola! Quiero hacer este pedido:%0A%0A";
        itemsCarrito.forEach(item => {
            mensaje += "• " + item.nombre + " - " + item.detalle + "%0A";
        });
        mensaje += "%0ATotal: " + formatearPrecio(total) + "%0A%0A";
        mensaje += "Quisiera coordinar el pago por transferencia (alias: " + ALIAS_TRANSFERENCIA + ").";

        const url = "https://wa.me/" + WHATSAPP_NEGOCIO + "?text=" + mensaje;
        window.open(url, "_blank");
    });
}

// ------- Zoom de imágenes -------
const imagenesProducto =
    document.querySelectorAll(".producto-imagen");
imagenesProducto.forEach(imagen => {
    imagen.addEventListener("click", () => {
        imagen.classList.toggle("zoom");
    });
});

// ------- Filtro por categoría -------
const categorias =
    document.querySelectorAll(".categoria");
const productos =
    document.querySelectorAll(".producto");
categorias.forEach(categoria => {
    categoria.addEventListener("click", () => {
        categorias.forEach(item => {
            item.classList.remove("activa");
        });
        categoria.classList.add("activa");
        const seleccion =
            categoria.dataset.categoria;
        productos.forEach(producto => {
            const tipo =
                producto.dataset.categoria;

            if (
                seleccion === "todos" ||
                seleccion === tipo
            ) {
                producto.style.display = "";
            }
            else {
                producto.style.display = "none";
            }
        });
    });
});

// ------- Buscador -------
const buscador =
    document.getElementById("buscador");

if (buscador) {
    buscador.addEventListener("input", () => {

        const texto =
            buscador.value.toLowerCase();
        productos.forEach(producto => {

            const nombre =
                producto
                    .querySelector("h3")
                    .textContent
                    .toLowerCase();
            if (nombre.includes(texto)) {
                producto.style.display = "";
            }
            else {
                producto.style.display = "none";
            }
        });
    });
}

// ------- Formulario de contacto -------
const formulario =
    document.getElementById("formulario");

if (formulario) {
    formulario.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();
            const nombre =
                document.getElementById("nombre").value;
            const respuesta =
                document.getElementById("respuesta");
            respuesta.textContent =
                "¡Gracias, " +
                nombre +
                "! 🐾 Recibimos tu mensaje.";
            formulario.reset();
        }
    )
}