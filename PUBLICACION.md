# Publicar o actualizar la demo en GitHub Pages

Este paquete sustituye la demo anterior. El archivo principal ya se llama `index.html`. Necesita la carpeta `assets`, que contiene los recursos y el motor de la nueva versión.

## 1. Descomprimir y probar

1. Descarga `wheel-github-ready.zip` y descomprímelo en tu ordenador.
2. Abre la carpeta resultante. Debes ver `index.html`, una carpeta llamada `assets` y los documentos de instrucciones.
3. Abre `index.html` con Chrome, Firefox, Edge o Safari actualizado. Mantén todos los archivos juntos.
4. Comprueba que aparecen la rueda azul, los brazos a franjas rojas y beige, los pesos negros y la rampa gris.
5. Arrastra un peso, pulsa **Release the Wheel** y confirma. Para una prueba rápida puedes escoger **8×** en **Animation speed**. La puntuación será la misma.

La configuración inicial es `(5, 5, 5, 5)`, como en el código oTree recibido. Puedes establecer una configuración exacta desplegando **Set exact positions**.

## 2. Subir los archivos al repositorio existente

1. Entra en tu repositorio de GitHub y abre la pestaña **Code**.
2. Sitúate en la carpeta principal del repositorio, donde está tu `index.html` actual.
3. Selecciona **Add file → Upload files**.
4. Arrastra **los archivos descomprimidos y la carpeta `assets`** desde el interior de la carpeta descargada. Puedes subir también todos los documentos incluidos en el paquete.
5. Comprueba que `index.html` queda en la raíz del repositorio y que sus recursos quedan dentro de `assets`. El nuevo `index.html` debe reemplazar al anterior.
6. Escribe un mensaje, por ejemplo `Update wheel demo with original graphics and physics`.
7. Selecciona **Commit directly to the main branch** y pulsa **Commit changes**.

La estructura esencial es:

| Ruta en el repositorio | Contenido |
| --- | --- |
| `/index.html` | La página nueva. |
| `/assets/styles.css` | Los estilos. |
| `/assets/app.js` | Los controles y las pantallas. |
| `/assets/physics.js` | El motor físico adaptado. |
| `/assets/scores.js` | Las puntuaciones originales. |
| `/assets/arm.js`, `/assets/weight.js`, `/assets/wheel.js`, `/assets/platforms.js` | Los dibujos originales. |
| `/assets/vendor/` | La librería PixiJS incluida. |
| `/assets/img/` | Las imágenes auxiliares. |

Sube el contenido extraído del ZIP. Si subes una carpeta contenedora adicional, la página quedará un nivel más abajo y no sustituirá la entrada actual.

## 3. Activar o comprobar GitHub Pages

1. Abre **Settings → Pages** dentro del repositorio.
2. En **Build and deployment**, selecciona **Source: Deploy from a branch**.
3. Selecciona **Branch: main** y **Folder: / (root)**.
4. Pulsa **Save**. Si esa configuración ya estaba activa, puedes conservarla.
5. Espera a que termine la publicación. GitHub indica que los cambios pueden tardar hasta diez minutos.
6. Pulsa **Visit site**. Ese es el enlace que podrás compartir o añadir al paper.

Para futuras actualizaciones, sustituye los archivos modificados en el mismo repositorio. El enlace seguirá siendo el mismo mientras conserves el nombre y la ubicación del repositorio.

## Comprobación después de publicar

- Prueba el arrastre de los cuatro pesos.
- Comprueba que la confirmación permite cancelar o soltar la rueda.
- Comprueba que un intento muestra el resultado y permite continuar a otra ronda.
- Abre **Previous rounds** y recupera una configuración anterior.
- Comprueba también la página desde un móvil.

Si aparece la versión anterior, recarga con **Ctrl + Shift + R** o **Command + Shift + R**. Si la página no carga, revisa que `index.html` esté en la raíz y que `assets` esté a su lado, con todos sus archivos.

Documentación oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
