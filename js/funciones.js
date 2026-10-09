const productos = [
    { id: 1, nombre: "Luz de Naranjo", familia: "Cítrico · Floral", descripcion: "Azahar, neroli y madera de naranjo.", imagen: "perfume1.avif", precios: { 30: 88, 50: 145, 100: 248 } },
    { id: 2, nombre: "Sal de Jardín", familia: "Marino · Aromático", descripcion: "Brisa salina, higo verde y almizcle.", imagen: "perfume2.avif", precios: { 30: 92, 50: 152, 100: 258 } },
    { id: 3, nombre: "Rosa de Abril", familia: "Floral · Empolvado", descripcion: "Rosa centifolia, iris y piel cálida.", imagen: "perfume3.avif", precios: { 30: 96, 50: 158, 100: 268 } },
    { id: 4, nombre: "Sombra de Higo", familia: "Verde · Amaderado", descripcion: "Hojas de higuera, cedro y leche de savia.", imagen: "perfume4.avif", precios: { 30: 84, 50: 139, 100: 238 } },
    { id: 5, nombre: "Ámbar Sereno", familia: "Ambarado · Especiado", descripcion: "Ámbar suave, azafrán y vainilla oscura.", imagen: "perfume5.avif", precios: { 30: 98, 50: 164, 100: 278 } },
    { id: 6, nombre: "Patio de Lluvia", familia: "Acuático · Floral", descripcion: "Pétalos húmedos, té blanco y piedra fría.", imagen: "perfume6.avif", precios: { 30: 86, 50: 142, 100: 242 } },
    { id: 7, nombre: "Madera de Luna", familia: "Amaderado · Oriental", descripcion: "Sándalo cremoso, incienso y haba tonka.", imagen: "perfume7.avif", precios: { 30: 99, 50: 169, 100: 288 } },
    { id: 8, nombre: "Jazmín Quieto", familia: "Floral · Luminoso", descripcion: "Jazmín de noche, bergamota y almizcle.", imagen: "perfume8.avif", precios: { 30: 91, 50: 149, 100: 252 } },
    { id: 9, nombre: "Tierra Dorada", familia: "Especiado · Amaderado", descripcion: "Pimienta rosa, vetiver y tierra al sol.", imagen: "perfume9.avif", precios: { 30: 94, 50: 156, 100: 264 } },
    { id: 10, nombre: "Mar en Calma", familia: "Marino · Ambarado", descripcion: "Sal marina, lavanda y maderas claras.", imagen: "perfume10.avif", precios: { 30: 102, 50: 172, 100: 294 } }
];

const tamanos = [30, 50, 100];
const formatoPrecio = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2
});
const productosContainer = document.getElementById("products");
const itemsCarrito = document.getElementById("cart-items");
const botonCarrito = document.getElementById("toggle-cart");
const carritoPanel = document.getElementById("cart");
const botonCerrarCarrito = document.getElementById("cerrar-carrito");
const veloCarrito = document.getElementById("velo-carrito");
const contador = document.getElementById("contador");
const totalCarrito = document.getElementById("cart-total");
const avisoReserva = document.getElementById("aviso-reserva");
const seleccionReserva = document.getElementById("perfume-reserva");

function cargarCarrito() {
    try {
        const guardado = localStorage.getItem("carritoProductos");
        if (!guardado) return [];

        const lineas = JSON.parse(guardado);
        if (!Array.isArray(lineas)) {
            throw new TypeError("El carrito guardado no tiene un formato válido.");
        }

        return lineas.reduce((carrito, linea) => {
            const producto = productos.find(item => item.id === Number(linea.id));
            const tamano = tamanos.includes(Number(linea.tamano)) ? Number(linea.tamano) : 30;
            const cantidad = Number(linea.cantidad);

            if (!producto || !Number.isInteger(cantidad) || cantidad < 1) {
                console.warn("Se ha omitido una línea no válida del carrito guardado.", linea);
                return carrito;
            }

            const existente = carrito.find(item => item.id === producto.id && item.tamano === tamano);
            if (existente) {
                existente.cantidad += cantidad;
            } else {
                carrito.push({ id: producto.id, tamano, cantidad });
            }
            return carrito;
        }, []);
    } catch (error) {
        console.error("No se pudo recuperar el carrito guardado; se iniciará una cesta vacía.", error);
        return [];
    }
}

let carritoProductos = cargarCarrito();
let audioContext;
let gananciaAmbiente;
let temporizadorSuspension;
let intervaloMelodia;

function obtenerProducto(id) {
    return productos.find(producto => producto.id === Number(id));
}

function crearTarjetas() {
    productosContainer.innerHTML = productos.map(producto => `
        <article class="producto">
            <div class="producto-foto">
                <span class="producto-numero">NOA · ${String(producto.id).padStart(2, "0")}</span>
                <img src="img/imgavifparfum/${producto.imagen}" alt="Frasco de ${producto.nombre}" loading="lazy">
            </div>
            <div class="producto-info">
                <p class="producto-tipo">${producto.familia}</p>
                <h3>${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <div class="producto-compra">
                    <label for="tamano-${producto.id}">Tamaño de ${producto.nombre}</label>
                    <select id="tamano-${producto.id}" class="selector-tamano" data-id="${producto.id}" aria-label="Tamaño de ${producto.nombre}">
                        ${tamanos.map(tamano => `<option value="${tamano}">${tamano} ml</option>`).join("")}
                    </select>
                    <p class="precio" id="precio-${producto.id}">${formatoPrecio.format(producto.precios[30])}</p>
                    <button class="addProducto" data-id="${producto.id}" type="button" aria-label="Añadir ${producto.nombre} de 30 ml a la cesta">+</button>
                </div>
            </div>
        </article>
    `).join("");

    seleccionReserva.insertAdjacentHTML("beforeend", productos.map(producto =>
        `<option value="${producto.id}">${producto.nombre}</option>`
    ).join(""));
}

function guardarCarrito() {
    try {
        localStorage.setItem("carritoProductos", JSON.stringify(carritoProductos));
        localStorage.setItem("numeroProductos", String(carritoProductos.reduce((total, linea) => total + linea.cantidad, 0)));
    } catch (error) {
        console.error("No se pudo guardar el carrito en este navegador.", error);
    }
}

function actualizarCarrito() {
    const cantidadTotal = carritoProductos.reduce((total, linea) => total + linea.cantidad, 0);
    const precioTotal = carritoProductos.reduce((total, linea) => {
        const producto = obtenerProducto(linea.id);
        return total + producto.precios[linea.tamano] * linea.cantidad;
    }, 0);

    contador.textContent = String(cantidadTotal);
    botonCarrito.setAttribute("aria-label", `Abrir cesta, ${cantidadTotal} ${cantidadTotal === 1 ? "artículo" : "artículos"}`);
    itemsCarrito.innerHTML = carritoProductos.map(linea => {
        const producto = obtenerProducto(linea.id);
        return `
            <article class="cart-item">
                <div class="cart-item-cantidad" aria-label="Cantidad">
                    <button type="button" data-id="${producto.id}" data-tamano="${linea.tamano}" data-cambio="-1" aria-label="Quitar una unidad de ${producto.nombre}">${linea.cantidad === 1 ? "×" : "−"}</button>
                    <span>${linea.cantidad}</span>
                    <button type="button" data-id="${producto.id}" data-tamano="${linea.tamano}" data-cambio="1" aria-label="Añadir una unidad de ${producto.nombre}">+</button>
                </div>
                <div>
                    <h3>${producto.nombre}</h3>
                    <small>${linea.tamano} ml · ${formatoPrecio.format(producto.precios[linea.tamano])} / unidad</small>
                </div>
                <strong>${formatoPrecio.format(producto.precios[linea.tamano] * linea.cantidad)}</strong>
            </article>
        `;
    }).join("");

    document.getElementById("carrito-vacio").hidden = carritoProductos.length > 0;
    totalCarrito.innerHTML = `Total <strong>${formatoPrecio.format(precioTotal)}</strong>`;
}

function cambiarLineaCarrito(id, tamano, cambio) {
    const linea = carritoProductos.find(item => item.id === id && item.tamano === tamano);
    if (!linea) return;

    linea.cantidad += cambio;
    if (linea.cantidad <= 0) {
        carritoProductos = carritoProductos.filter(item => item !== linea);
    }
    guardarCarrito();
    actualizarCarrito();
}

function abrirCarrito() {
    carritoPanel.classList.add("open");
    carritoPanel.setAttribute("aria-hidden", "false");
    botonCarrito.setAttribute("aria-expanded", "true");
    veloCarrito.hidden = false;
    document.body.classList.add("carrito-abierto");
    botonCerrarCarrito.focus();
}

function cerrarCarrito() {
    carritoPanel.classList.remove("open");
    carritoPanel.setAttribute("aria-hidden", "true");
    botonCarrito.setAttribute("aria-expanded", "false");
    veloCarrito.hidden = true;
    document.body.classList.remove("carrito-abierto");
    botonCarrito.focus();
}

function crearAudioAmbiente(contexto) {
    const salida = contexto.createGain();
    salida.gain.value = 0;
    salida.connect(contexto.destination);

    return salida;
}

function tocarNotaPiano(contexto, salida, frecuencia, inicio, duracion, volumen) {
    [1, 2, 3].forEach((armonica, indice) => {
        const oscilador = contexto.createOscillator();
        const envolvente = contexto.createGain();
        const amplitud = volumen / (armonica * armonica);
        const fin = inicio + duracion;

        oscilador.type = "sine";
        oscilador.frequency.value = frecuencia * armonica;
        envolvente.gain.setValueAtTime(0.001, inicio);
        envolvente.gain.linearRampToValueAtTime(amplitud, inicio + 0.035);
        envolvente.gain.exponentialRampToValueAtTime(0.001, fin);
        oscilador.connect(envolvente);
        envolvente.connect(salida);
        oscilador.start(inicio);
        oscilador.stop(fin + 0.02);
    });
}

function iniciarMelodia(contexto, salida) {
    const acordes = [
        [130.81, 196, 261.63, 329.63],
        [174.61, 261.63, 349.23, 440],
        [110, 164.81, 220, 261.63],
        [98, 146.83, 196, 293.66]
    ];
    const melodia = [
        523.25, null, 659.25, 587.33, 523.25, null, 392, null,
        440, null, 523.25, 587.33, 659.25, null, 587.33, null,
        523.25, null, 440, 392, 440, null, 523.25, null,
        587.33, null, 523.25, 440, 392, null, 440, null
    ];
    const paso = 0.9;
    let pulso = 0;

    clearInterval(intervaloMelodia);
    intervaloMelodia = setInterval(() => {
        if (contexto.state !== "running") return;

        const ahora = contexto.currentTime + 0.04;
        const acorde = acordes[Math.floor(pulso / 8) % acordes.length];
        const notaAcompanamiento = acorde[pulso % acorde.length];
        tocarNotaPiano(contexto, salida, notaAcompanamiento, ahora, 1.65, 0.12);

        const notaMelodia = melodia[pulso % melodia.length];
        if (notaMelodia) {
            tocarNotaPiano(contexto, salida, notaMelodia, ahora, 1.8, 0.075);
        }
        pulso += 1;
    }, paso * 1000);
}

async function alternarAmbiente() {
    const botonSonido = document.getElementById("toggle-sonido");
    const textoSonido = document.getElementById("texto-sonido");
    const activar = botonSonido.getAttribute("aria-pressed") !== "true";

    if (!window.AudioContext) {
        textoSonido.textContent = "Audio no disponible";
        console.error("Este navegador no admite Web Audio API.");
        return;
    }

    try {
        if (!audioContext) {
            audioContext = new AudioContext();
            gananciaAmbiente = crearAudioAmbiente(audioContext);
        }
        clearTimeout(temporizadorSuspension);
        await audioContext.resume();
        const ahora = audioContext.currentTime;
        gananciaAmbiente.gain.cancelScheduledValues(ahora);
        gananciaAmbiente.gain.setTargetAtTime(activar ? 1 : 0, ahora, 0.7);
        if (activar) {
            iniciarMelodia(audioContext, gananciaAmbiente);
        } else {
            clearInterval(intervaloMelodia);
        }
        botonSonido.setAttribute("aria-pressed", String(activar));
        textoSonido.textContent = activar ? "Ambiente activado" : "Activar ambiente";

        if (!activar) {
            temporizadorSuspension = setTimeout(() => audioContext.suspend(), 2400);
        }
    } catch (error) {
        textoSonido.textContent = "Audio no disponible";
        console.error("No se pudo iniciar el ambiente sonoro.", error);
    }
}

function elegirFondoFloral() {
    const imagenes = ["campodelavanda.avif", "fondo.avif", "rosa.avif"];
    const imagen = imagenes[Math.floor(Math.random() * imagenes.length)];
    document.querySelector(".hero").style.setProperty("--hero-image", `url("../img/imgavifparfum/${imagen}")`);
}

function activarMovimientoRetrato() {
    const retrato = document.getElementById("retrato-noa");
    if (!retrato || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let objetivoX = 0;
    let objetivoY = 0;
    let posicionX = 0;
    let posicionY = 0;
    let animacionPendiente = false;

    function animar() {
        posicionX += (objetivoX - posicionX) * 0.12;
        posicionY += (objetivoY - posicionY) * 0.12;
        retrato.style.setProperty("--px", posicionX.toFixed(4));
        retrato.style.setProperty("--py", posicionY.toFixed(4));

        if (Math.abs(objetivoX - posicionX) > 0.001 || Math.abs(objetivoY - posicionY) > 0.001) {
            requestAnimationFrame(animar);
        } else {
            posicionX = objetivoX;
            posicionY = objetivoY;
            retrato.style.setProperty("--px", posicionX.toFixed(4));
            retrato.style.setProperty("--py", posicionY.toFixed(4));
            animacionPendiente = false;
        }
    }

    function apuntar(evento) {
        const limites = retrato.getBoundingClientRect();
        objetivoX = Math.max(-1, Math.min(1, (evento.clientX - (limites.left + limites.width / 2)) / (limites.width / 2)));
        objetivoY = Math.max(-1, Math.min(1, (evento.clientY - (limites.top + limites.height / 2)) / (limites.height / 2)));

        if (!animacionPendiente) {
            animacionPendiente = true;
            requestAnimationFrame(animar);
        }
    }

    retrato.addEventListener("pointermove", apuntar, { passive: true });
    retrato.addEventListener("pointerdown", apuntar, { passive: true });
    retrato.addEventListener("pointerleave", () => {
        objetivoX = 0;
        objetivoY = 0;
        if (!animacionPendiente) {
            animacionPendiente = true;
            requestAnimationFrame(animar);
        }
    });
}

productosContainer.addEventListener("change", evento => {
    if (!evento.target.matches(".selector-tamano")) return;
    const id = Number(evento.target.dataset.id);
    const tamano = Number(evento.target.value);
    const producto = obtenerProducto(id);
    document.getElementById(`precio-${id}`).textContent = formatoPrecio.format(producto.precios[tamano]);
    productosContainer.querySelector(`.addProducto[data-id="${id}"]`).setAttribute(
        "aria-label",
        `Añadir ${producto.nombre} de ${tamano} ml a la cesta`
    );
});

productosContainer.addEventListener("click", evento => {
    const boton = evento.target.closest(".addProducto");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const tamano = Number(productosContainer.querySelector(`#tamano-${id}`).value);
    const linea = carritoProductos.find(item => item.id === id && item.tamano === tamano);
    if (linea) {
        linea.cantidad += 1;
    } else {
        carritoProductos.push({ id, tamano, cantidad: 1 });
    }
    guardarCarrito();
    actualizarCarrito();
    botonCarrito.setAttribute("aria-label", "Artículo añadido. " + botonCarrito.getAttribute("aria-label"));
});

itemsCarrito.addEventListener("click", evento => {
    const boton = evento.target.closest("button[data-cambio]");
    if (!boton) return;
    cambiarLineaCarrito(Number(boton.dataset.id), Number(boton.dataset.tamano), Number(boton.dataset.cambio));
});

botonCarrito.addEventListener("click", abrirCarrito);
botonCerrarCarrito.addEventListener("click", cerrarCarrito);
veloCarrito.addEventListener("click", cerrarCarrito);
document.addEventListener("keydown", evento => {
    if (evento.key === "Escape" && carritoPanel.classList.contains("open")) cerrarCarrito();
});
document.getElementById("enlace-reserva-carrito").addEventListener("click", cerrarCarrito);
document.getElementById("toggle-sonido").addEventListener("click", alternarAmbiente);

document.getElementById("formulario-reserva").addEventListener("submit", evento => {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const producto = obtenerProducto(datos.get("perfume"));
    avisoReserva.textContent = `Gracias, ${datos.get("nombre")}. Hemos preparado tu solicitud para ${producto.nombre} de ${datos.get("tamano")} ml. Al ser una demostración, no se envía ni se guardan tus datos.`;
    avisoReserva.classList.add("reserva-ok");
    evento.currentTarget.reset();
});

elegirFondoFloral();
crearTarjetas();
actualizarCarrito();
activarMovimientoRetrato();
