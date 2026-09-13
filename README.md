# TeenGames - Tienda de Videojuegos 🎮

Este proyecto es una aplicación web responsiva y dinámica desarrollada para la asignatura Desarrollo Frontend I (PFY2201), correspondiente a la Semana 5: Manipulando el DOM con JavaScript para mejorar la interactividad.

El sitio simula el catálogo web de una tienda de videojuegos, implementando buenas prácticas de diseño, accesibilidad, optimización de recursos y manipulación avanzada del Document Object Model (DOM).


## 🚀 Características Principales

* **Catálogo Dinámico (Fetch API):** Los productos se cargan de forma asíncrona desde un archivo JSON externo utilizando promesas, separando los datos de la estructura HTML.

* **Interactividad Avanzada (DOM & Eventos):**

  * **Menú Interactivo (`mouseover` / `mouseout`):** Barra dinámica que muestra mensajes contextuales al pasar el cursor sobre los enlaces de navegación
  
  * **Carrito de Compras (`click`):** Botones de "Añadir al carrito" que aparecen con efectos CSS (`:hover`) y generan una alerta dinámica temporal de éxito al ser presionados, utilizando `createElement` y `appendChild`.

  * **Formulario de Contacto (`submit`):** Captura de datos sin recarga de página (`preventDefault`), con inyección dinámica de un mensaje de confirmación que desaparece automáticamente (`setTimeout`).

  * **Diseño Responsivo:** Uso avanzado del sistema de cuadrículas (Grid System) y componentes de Bootstrap 5 (Navbar, Carousel, Cards).

  * **Optimización de Rendimiento:** Uso de imágenes en formato WebP y carga diferida (`loading="lazy"`) para un rendimiento óptimo en dispositivos móviles.


## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`).

* **CSS3:** Variables personalizadas (`:root`), transiciones, pseudo-clases y diseño visual limpio.

* **Bootstrap 5:** Framework CSS para componentes modulares y responsividad rápida.

* **JavaScript (ES6+):** Funciones modulares, Arrow Functions, Template Literals, Fetch API y manipulación dinámica del DOM.


## 📂 Estructura del Proyecto
```
proyecto-videojuegos/
├── css/
│   └── styles.css        # Hoja de estilos personalizada
├── data/
│   └── productos.json    # Base de datos (Catálogo de videojuegos)
├── img/
│   └── [imágenes optimizadas en formato .webp]
├── js/
│   └── app.js            # Lógica de programación, Fetch API y eventos
├── index.html            # Estructura principal de la página
└── README.md
```


## ⚙️ Instrucciones de Ejecución

Para visualizar correctamente este proyecto en un entorno local y evitar bloqueos de seguridad por el uso de la Fetch API (CORS):

1. Clonar o descargar el repositorio.

2. Abrir el proyecto en un editor de código como Visual Studio Code.

3. Instalar y ejecutar la extensión Live Server.

4. Abrir el archivo `index.html` con Live Server.

## 🔗 Enlaces del Proyecto

* **Repositorio en GitHub:** https://github.com/JenniferGonzalezT/proyecto-videojuegos-2.git

* **Sitio Web Publicado (GitHub Pages):** https://jennifergonzalezt.github.io/proyecto-videojuegos-2/
