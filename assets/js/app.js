// ===== MENSAJE DINÁMICO EN MENÚ (MOUSEOVER/MOUSEOUT) ===== //
// Selección de Enlaces del menú y Header
const enlacesMenu = document.querySelectorAll('.nav-link');
const header = document.querySelector('header');

// Barra de mensajes
const barraMensaje = document.createElement('div');
barraMensaje.className = 'text-center py-2 fw-bold barra-interactiva';
header.appendChild(barraMensaje);

// Asignar eventos a cada enlace del menú
enlacesMenu.forEach(enlace => {
    // Evento al pasar el cursor
    enlace.addEventListener('mouseover', () => {
        const textoEnlace = enlace.textContent.trim();

        if (textoEnlace === 'Inicio') {
            barraMensaje.textContent = 'Vuelve a la página principal para ver nuestras novedades.';
        } else if (textoEnlace === 'Productos destacados') {
            barraMensaje.textContent = 'Descubre los juegos más populares del momento.';
        } else if (textoEnlace === 'Catálogo') {
            barraMensaje.textContent = 'Explora nuestras categorías: consolas, juegos y accesorios.';
        } else if (textoEnlace === 'Contacto') {
            barraMensaje.textContent = 'Revisa nuestras plataformas de contacto.';
        }
    });

    // Evento al quitar el cursor
    enlace.addEventListener('mouseout', () => {
        barraMensaje.textContent = '';
    });
});


// ===== CARGA DINÁMICA DE PRODUCTOS CON FETCH API ===== //
// Variable global para guardar los productos y luego filtrarlos
let catalogoGlobal = [];

// Elemento contenedor principal de productos
const contenedorProductos = document.getElementById('contenedor-productos');

// Función principal asíncrona (async/await) para obtener datos del JSON
const cargarProductos = async () => {
    // Estado visual de "Cargando" (Spinner de Bootstrap)
    contenedorProductos.innerHTML = `
        <div class="col-12 text-center mt-5">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 fw-bold mensajeCarga">
                Cargando catálogo de juegos...
            </p>
        </div>
    `;

    // Configurar tiempo máximo de espera (Timeout de 5 segundos)
    const controlador = new AbortController();
    const idEspera = setTimeout(() => controlador.abort(), 5000);

    try {
        // Petición Fetch usando async/await y el controlador de tiempo
        const respuesta = await fetch('./data/productos.json', { signal: controlador.signal });
        
        // Limpiar el timeout si el servidor responde a tiempo
        clearTimeout(idEspera);

        if (!respuesta.ok) {
            throw new Error('Error al cargar los productos.');
        }

        // Parsear el JSON
        const datos = await respuesta.json();
        catalogoGlobal = datos;
        
        // Renderizar los productos
        renderizarProductos(catalogoGlobal);

    } catch (error) {
        console.error('Hubo un problema con la petición Fetch:', error);
        
        // Definir mensaje de error dependiendo si fue por Timeout o por Red
        const mensajeError = error.name === 'AbortError'
            ? 'El tiempo de espera se ha agotado. Verifica tu conexión.'
            : 'Lo sentimos, no se ha podido cargar el catálogo de productos.';

        contenedorProductos.innerHTML = `
            <div class="col-12 text-center mt-5">
                <p class="text-danger fw-bold fs-5">${mensajeError}</p>
            </div>
        `;
    }
};

// Función que recorre el arreglo de datos y crea dinámicamente los elementos en el DOM (Inserción Segura)
const renderizarProductos = (productos) => {
    // Vaciar contenedor antes de inyectar
    contenedorProductos.textContent = '';

    productos.forEach(producto => {
        // Formatear precio a CLP
        const precioFormateado = producto.precio.toLocaleString('es-CL');

        // Contenedor principal de la columna
        const columna = document.createElement('div');
        columna.className = 'col-12 col-md-6 col-lg-4 col-xl-3';

        // Etiqueta <article> para la tarjeta
        const tarjeta = document.createElement('article');
        tarjeta.className = 'card h-100 shadow-sm';

        // Imagen de la tarjeta
        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.alt = `Portada videojuego ${producto.titulo}`
        imagen.className = 'card-img-top';
        imagen.setAttribute('loading', 'lazy');

        // Cuerpo de la tarjeta
        const cuerpoTarjeta = document.createElement('div');
        cuerpoTarjeta.className = 'card-body d-flex flex-column';

        // Título producto
        const titulo = document.createElement('h3');
        titulo.className = 'card-title text-center';
        titulo.textContent = producto.titulo;

        // Descripción producto
        const descripcion = document.createElement('p');
        descripcion.className = 'card-text mb-4';
        descripcion.textContent = producto.descripcion;

        // Precio producto
        const precio = document.createElement('p');
        precio.className = 'card-text precio-card fw-bold text-center fs-5 mt-auto';
        precio.textContent = `Precio: $${precioFormateado}`;

        // Botón Añadir al carrito
        const btnCarrito = document.createElement('button');
        btnCarrito.className = 'btn btn-carrito w-100 fw-bold rounded-3';
        btnCarrito.textContent = 'Añadir al carrito';

        // Armar estructura
        cuerpoTarjeta.appendChild(titulo);
        cuerpoTarjeta.appendChild(descripcion);
        cuerpoTarjeta.appendChild(precio);
        cuerpoTarjeta.appendChild(btnCarrito);

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(cuerpoTarjeta);

        columna.appendChild(tarjeta);

        // Añadir elemento al contenedor principal
        contenedorProductos.appendChild(columna);

        // Añadir al carrito
        configurarBotonCarrito(btnCarrito, cuerpoTarjeta, producto);
    });
};


// ===== BARRA DE BÚSQUEDA (SUBMIT) ===== //
const formBusqueda = document.getElementById('form-busqueda');
const inputBusqueda = document.getElementById('input-busqueda');
const seccionProductos = document.getElementById('productos');

formBusqueda.addEventListener('submit', (evento) => {
    // Evitar que la página se recargue
    evento.preventDefault(); 
    
    // Limpiar la búsqueda (minúsculas y quitar espacios en blanco)
    const terminoBusqueda = inputBusqueda.value.toLowerCase().trim();
    
    // Filtrar el catálogo global buscando coincidencias en el título
    const productosFiltrados = catalogoGlobal.filter(producto => 
        producto.titulo.toLowerCase().includes(terminoBusqueda)
    );

    // Renderizar solo los productos que coinciden
    renderizarProductos(productosFiltrados);

    // Validar si el arreglo quedó vacío para mostrar un mensaje amigable
    if (productosFiltrados.length === 0) {
        contenedorProductos.innerHTML = `
            <p class="text-center w-100 mt-5 fs-4 alerta-busqueda">
                No se encontraron juegos para "${terminoBusqueda}".
            </p>
        `;
    }

    // Desplazamiento automático hacia la sección de resultados
    seccionProductos.scrollIntoView({ behavior: 'smooth' });

    // Limpiar la barra de búsqueda
    formBusqueda.reset();
});


// ===== CARRITO DE COMPRAS ===== //
// Inicializar el carrito buscando datos previos en localStorage
let carrito = JSON.parse(localStorage.getItem('carritoTeenGames')) || [];

// Función para añadir un producto al carrito (Evento Click)
const configurarBotonCarrito = (boton, contenedor, producto) => {
    boton.addEventListener('click', () => {
        // Alerta visual en la tarjeta
        if (!contenedor.querySelector('.alerta-carrito')) {
            const mensajeAviso = document.createElement('div');
            mensajeAviso.className = 'alerta-carrito alert p-2 mt-2 mb-0 text-center fw-bold';
            mensajeAviso.textContent = '¡Añadido a tu carrito!';
            contenedor.appendChild(mensajeAviso);

            setTimeout(() => {
                mensajeAviso.remove();
            }, 3000);
        }

        // Agregar producto al arreglo y guardar en LocalStorage
        carrito.push(producto);
        localStorage.setItem('carritoTeenGames', JSON.stringify(carrito));

        // Actualizar ventana del Modal
        actualizarModalCarrito();
    });
};

// Función para manipular el DOM del Modal de Resumen de compras
const actualizarModalCarrito = () => {
    const cuerpoCarrito = document.getElementById('cuerpo-carrito');
    const contadorCarrito = document.getElementById('contador-carrito');
    const totalCarrito = document.getElementById('total-carrito');

    // Actualizar número del ícono del carrito en la barra de navegación
    contadorCarrito.textContent = carrito.length;

    // Limpiar contenido anterior del modal
    cuerpoCarrito.innerHTML = '';

    if (carrito.length === 0) {
        cuerpoCarrito.innerHTML = '<p class="text-center mt-3">Tu carrito está vacío.</p>';
        totalCarrito.textContent = '0';
        return;
    }

    let total = 0;

    // Recorrer arreglo del carrito para crear/eliminar elementos
    carrito.forEach((item, index) => {
        // Sumar total
        total += item.precio;

        // Crear nodo para el resumen del producto
        const filaProducto = document.createElement('div');
        filaProducto.className =
            'd-flex justify-content-between align-item-center \
             mb-3 border-bottom pb-2 border-secondary';
        
        filaProducto.innerHTML = `
            <div>
                <h6 class="mb-0 fw-bold">${item.titulo}</h6>
            </div>
            <div class="d-flex align-items-center gap-3">
                <span class="fw-bold">
                    $${item.precio.toLocaleString('es-CL')}
                </span>
                <button 
                    class="btn btn-sm btn-danger fw-bold btn-eliminar" 
                    data-indice="${index}"
                >
                    X
                </button>
            </div>
        `;

        cuerpoCarrito.appendChild(filaProducto);
    });

    // Actualizar total en el Pie del Modal
    totalCarrito.textContent = total.toLocaleString('es-CL');

    // Asignar evento de eliminar a los botones generados
    const botonesEliminar = cuerpoCarrito.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            const indice = evento.target.getAttribute('data-indice');
            // Eliminar 1 elemento en la posición del índice
            carrito.splice(indice, 1);
            // Actualizar LocalStorage y el modal
            localStorage.setItem('carritoTeenGames', JSON.stringify(carrito));
            actualizarModalCarrito();
        });
    });
};


// ===== ENVIO FORMULARIO DE CONTACTO (SUBMIT) ===== //
const formulario = document.getElementById('form-contacto');
const inputNombre = document.getElementById('form-nombre');
const inputCorreo = document.getElementById('form-correo');
const inputMensaje = document.getElementById('form-mensaje');

// Función genérica para pintar el input verde (válido) o rojo (inválido)
const validarCampo = (input, condicion) => {
    if (condicion) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        return true;
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        return false;
    }
};

// Eventos en tiempo real (se ejecutan con cada pulsación de tecla)
inputNombre.addEventListener('input', () => {
    const largoNombre = inputNombre.value.trim().length;
    validarCampo(inputNombre, largoNombre >= 3 && largoNombre <= 30);
});

inputCorreo.addEventListener('input', () => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validarCampo(inputCorreo, regexCorreo.test(inputCorreo.value.trim()));
});

inputMensaje.addEventListener('input', () => {
    const largoMensaje = inputMensaje.value.trim().length;
    validarCampo(inputMensaje, largoMensaje >= 10 && largoMensaje <= 200);
});

// Evento Submit
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    // Re-evaluar todos los campos al momento de enviar
    const largoNombre = inputNombre.value.trim().length;
    const nombreValido = validarCampo(inputNombre, largoNombre >= 3 && largoNombre <= 30);
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const correoValido = validarCampo(inputCorreo, regexCorreo.test(inputCorreo.value.trim()));
    const largoMensaje = inputMensaje.value.trim().length;
    const mensajeValido = validarCampo(inputMensaje, largoMensaje >= 10 && largoMensaje <= 200);

    // Si todos los campos cumplen las reglas, procedemos con éxito
    if (nombreValido && correoValido && mensajeValido) {
        
        // Limpiar alertas previas si existían
        const alertaPrevia = document.getElementById('alerta-contacto');
        if (alertaPrevia) alertaPrevia.remove();

        // Creamos la alerta de éxito general
        const contenedorAlerta = document.createElement('div');
        contenedorAlerta.id = 'alerta-contacto';
        contenedorAlerta.className = 'alert alert-success mt-3 text-center';
        contenedorAlerta.textContent = `
            ¡Gracias por contactarnos, ${inputNombre.value.trim()}! 
            Pronto responderemos a tu correo ${inputCorreo.value.trim()}.
        `;
        
        formulario.appendChild(contenedorAlerta);
        
        // Resetear el formulario y quitar los bordes verdes
        formulario.reset();
        inputNombre.classList.remove('is-valid');
        inputCorreo.classList.remove('is-valid');
        inputMensaje.classList.remove('is-valid');

        // Desaparecer mensaje de éxito
        setTimeout(() => {
            contenedorAlerta.remove();
        }, 10000);
    }
});


// ===== INICIALIZADOR DE LA APLICACIÓN ===== //
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarModalCarrito(); 
});
