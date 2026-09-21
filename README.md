# TeenGames - Tienda de Videojuegos 🎮

Este proyecto es una aplicación web responsiva y dinámica desarrollada para la asignatura Desarrollo Frontend I (PFY2201), correspondiente a la Semana 6: Optimizando la Lógica y Rendimiento de una Página Web con JavaScript.

El sitio simula el catálogo web de una tienda de videojuegos, implementando buenas prácticas de diseño, accesibilidad, optimización de recursos, seguridad y manipulación avanzada del Document Object Model (DOM).


## 🚀 Características Principales

* **Catálogo Dinámico y Asincronía (Fetch API):** Los productos se cargan desde un archivo JSON externo utilizando `async/await`. Incluye un estado visual de carga (Spinner), manejo centralizado de errores con `try/catch` y un controlador de tiempo máximo de espera (`AbortController`).

* **Manipulación Segura del DOM:** Creación de tarjetas y elementos dinámicos utilizando estrictamente `createElement` y `textContent`, erradicando el uso de `innerHTML` para la inserción de datos externos y previniendo vulnerabilidades de inyección de código (XSS).

* **Carrito de Compras Persistente:** 
  * Integración con un componente **Modal de Bootstrap 5** para mostrar el resumen de compras sin abandonar la vista principal.

  * Cálculos matemáticos en tiempo real y formateo de precios a pesos chilenos (CLP).

  * Funcionalidad para eliminar productos individuales del carrito.

  * Persistencia de datos mediante **`localStorage`**, permitiendo que el carrito sobreviva a las recargas de la página.

* **Formulario de Contacto y Validación en Tiempo Real:** Uso del evento `input` para validar longitudes de texto y formatos de correo electrónico (RegEx) instantáneamente. Aprovecha las clases de validación nativas de Bootstrap (`is-valid`, `is-invalid`) y previene el envío de formularios vacíos (`preventDefault`).

* **Interactividad y Navegación Avanzada:**
  * **Buscador:** Filtra el catálogo en tiempo real, maneja estados vacíos y utiliza `scrollIntoView()` para un desplazamiento suave hacia los resultados.

  * **Menú Interactivo:** Eventos `mouseover` / `mouseout` para mostrar mensajes contextuales, y eventos `click` que restauran el catálogo completo automáticamente.

* **Diseño Responsivo:** Uso avanzado del sistema de cuadrículas (Grid System) y componentes de Bootstrap 5 (Navbar colapsable, Carousel, Cards).


## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`) y validación de accesibilidad (W3C).

* **CSS3:** Variables personalizadas (`:root`), transiciones suaves, pseudo-clases, diseño visual limpio y sobrescritura limpia del framework.

* **Bootstrap 5 (v5.3.8):** Framework CSS para maquetación basada en Flexbox, Grid System, Modales interactivos y responsividad ágil (Mobile-First).

* **JavaScript (ES6+):** Funciones modulares, Arrow Functions, Fetch API (Promesas), LocalStorage, Expresiones Regulares (RegEx) y manipulación segura del DOM.


## 📂 Estructura del Proyecto
```
proyecto-videojuegos/
├── assets/
│   ├── css/
│   │   └── styles.css    # Hoja de estilos personalizada
│   ├── img/
│   │   └── [imágenes optimizadas en formato .webp]
│   └── js/
│       └── app.js        # Lógica de programación y Fetch
├── data/
│   └── productos.json    # Base de datos (videojuegos)
├── index.html            # Estructura principal de la página
└── README.md
```


## ⚙️ Instrucciones de Ejecución

Para visualizar correctamente este proyecto en un entorno local y permitir el correcto funcionamiento de la Fetch API (evitando bloqueos CORS):

1. Clonar o descargar el repositorio.

2. Abrir el proyecto en un editor de código como Visual Studio Code.

3. Instalar y ejecutar la extensión Live Server.

4. Abrir el archivo `index.html` con Live Server.


## 🔗 Enlaces del Proyecto

* **Repositorio en GitHub:** https://github.com/JenniferGonzalezT/proyecto-videojuegos-2.git

* **Sitio Web Publicado (GitHub Pages):** https://jennifergonzalezt.github.io/proyecto-videojuegos-2/
