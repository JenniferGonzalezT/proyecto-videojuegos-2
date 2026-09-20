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

// Función principal para realizar la petición HTTP y obtener datos del JSON
const cargarProductos = () => {
    fetch('/data/productos.json')
        .then(respuesta => {
            // Manejo de posibles errores de conexión
            if (!respuesta.ok) {
                throw new Error('Error al cargar los productos.')
            }
            return respuesta.json();
        })
        .then(datos => {
            catalogoGlobal = datos;
            renderizarProductos(catalogoGlobal);
        })
        .catch(error => {
            // Captura y gestión centralizada de errores
            console.error('Hubo un problema con la petición Fetch:', error);
            contenedorProductos.innerHTML = 
                '<p class="text-center text-danger"> \
                    Lo sentimos, no se ha podido cargar el catálogo de productos. \
                </p>';
        });
}

// Función que recorre el arreglo de datos y crea dinámicamente los elementos en el DOM
const renderizarProductos = (productos) => {
    // Contenedor vacío antes de inyectar
    contenedorProductos.innerHTML = '';

    productos.forEach(producto => {
        // Formatear precio a CLP
        const precioFormateado = producto.precio.toLocaleString('es-CL');

        // Crear columna
        const columna = document.createElement('div');
        columna.className = 'col-12 col-md-6 col-lg-4 col-xl-3';

        // Crear tarjeta
        columna.innerHTML = `
            <!-- Card -->
            <article class="card h-100 shadow-sm">
                <!-- Imagen -->
                <img
                    src="${producto.imagen}" 
                    alt="Portada videojuego ${producto.titulo}"
                    class="card-img-top"
                    loading="lazy"
                >
                <!-- Cuerpo -->
                <div class="card-body d-flex flex-column">
                    <h3 class="card-title text-center">
                        ${producto.titulo}
                    </h3>
                    <p class="card-text mb-4">
                        ${producto.descripcion}
                    </p>
                    <p class="card-text precio-card fw-bold text-center fs-5 mt-auto">
                        Precio: $${precioFormateado}
                    </p>
                    <!-- Botón Carrito -->
                    <button class="btn btn-carrito w-100 fw-bold rounded-3">
                        Añadir al carrito
                    </button>
                </div>
            </article>
        `;

        // Añadir elemento al contenedor principal
        contenedorProductos.appendChild(columna);

        // Añadir al carrito
        const btnCarrito = columna.querySelector('.btn-carrito');
        const cuerpoTarjeta = columna.querySelector('.card-body');
        configurarBotonCarrito(btnCarrito, cuerpoTarjeta, producto);
    });
}

// Escuchamos el evento 'DOMContentLoaded' para ejecutar la carga
// justo cuando la estructura HTML de la página esté lista
document.addEventListener('DOMContentLoaded', cargarProductos);


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
            <p class="text-center w-100 mt-5 fs-4" style="color: var(--color-serenity);">
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
let carrito = [];

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

        // Agregar producto al carrito
        carrito.push(producto);

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

    let total = 0;

    // Recorrer arreglo del carrito para crear los elementos
    carrito.forEach((item) => {
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
            <div class="fw-bold">
                $${item.precio.toLocaleString('es-CL')}
            </div>
        `;

        cuerpoCarrito.appendChild(filaProducto);
    });

    // Actualizar total en el Pie del Modal
    totalCarrito.textContent = total.toLocaleString('es-CL');
}


// ===== ENVIO FORMULARIO DE CONTACTO (SUBMIT) ===== //
// Elemento formulario de contacto
const formulario = document.getElementById('form-contacto');

// Envio de formulario (evento submit)
formulario.addEventListener('submit', (evento) => {
    // Detener recarga de la página
    evento.preventDefault();

    // Capturar inputs
    const nombre = document.getElementById('form-nombre').value;
    const correo = document.getElementById('form-correo').value;

    // Eliminar alertas previas
    const alertaPrevia = document.getElementById('alerta-exito');
    if (alertaPrevia) {
        alertaPrevia.remove();
    }

    // Nuevo contenedor para mensajes de alerta
    const mensajeAlerta = document.createElement('div');
    mensajeAlerta.id = 'alerta-exito';
    mensajeAlerta.className = 'alert alert-success mt-3 text-center';
    mensajeAlerta.textContent = `¡Gracias por contactarnos, ${nombre}! 
        Pronto enviaremos una respuesta a su correo ${correo}.`;

    // Añadir mensaje al DOM
    formulario.appendChild(mensajeAlerta);

    // Limpieza de los campos del formulario
    formulario.reset();

    // Eliminar automáticamente el mensaje luego de 10 segundos
    setTimeout(() => {
        mensajeAlerta.remove();
    }, 10000);
})
