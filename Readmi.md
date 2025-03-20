CesiumJS proporciona varios elementos de la interfaz de usuario y del entorno de visualización que pueden modificarse desde JavaScript. Aquí tienes una lista de los principales elementos que puedes personalizar o controlar desde JS:

### **1. Controles de la Interfaz de Usuario**
Estos son los elementos visibles que puedes modificar o deshabilitar:

- **`viewer.geocoder`** → Controla el cuadro de búsqueda.
- **`viewer.homeButton`** → Botón de "volver a la vista inicial".
- **`viewer.sceneModePicker`** → Selector de modo de vista (2D, 3D, Columbus).
- **`viewer.baseLayerPicker`** → Selector de capas de fondo (Bing Maps, OpenStreetMap, etc.).
- **`viewer.navigationHelpButton`** → Botón de ayuda para la navegación.
- **`viewer.fullscreenButton`** → Botón para pantalla completa.
- **`viewer.timeline`** → Línea de tiempo interactiva.
- **`viewer.animation`** → Controlador de animación del tiempo.
- **`viewer.selectionIndicator`** → Indicador de selección de entidad.
- **`viewer.infoBox`** → Panel de información de entidades seleccionadas.
- **`viewer.clockViewModel`** → Reloj para controlar la animación del tiempo.

### **2. Elementos de la Escena**
Estos son los elementos de la visualización 3D:

- **`viewer.scene`** → Escena principal.
- **`viewer.scene.skyBox`** → Caja del cielo (se puede ocultar o cambiar).
- **`viewer.scene.skyAtmosphere`** → Atmósfera alrededor de la Tierra.
- **`viewer.scene.globe`** → Controla el globo terráqueo.
- **`viewer.scene.fog`** → Niebla (puede activarse/desactivarse).
- **`viewer.scene.sun`** → Sol (puede ocultarse o modificarse).
- **`viewer.scene.moon`** → Luna (puede activarse/desactivarse).
- **`viewer.scene.terrainProvider`** → Control del terreno (puedes cambiarlo o quitarlo).

### **3. Control del Tiempo**
- **`viewer.clock`** → Controlador del tiempo global.
- **`viewer.clock.startTime`** → Tiempo de inicio de la simulación.
- **`viewer.clock.stopTime`** → Tiempo de finalización.
- **`viewer.clock.currentTime`** → Tiempo actual de la simulación.
- **`viewer.clock.multiplier`** → Velocidad de avance del tiempo.
- **`viewer.clock.shouldAnimate`** → Controla si la animación del tiempo está activa.

### **4. Capa de Entidades**
- **`viewer.entities`** → Contenedor de entidades añadidas.
- **`viewer.dataSources`** → Fuente de datos como GeoJSON, KML, CZML.

### **5. Cámara y Controles de Navegación**
- **`viewer.camera`** → Control total sobre la posición y orientación de la cámara.
- **`viewer.scene.screenSpaceCameraController`** → Control sobre la interacción con la cámara (zoom, giro, inclinación).

### **Ejemplo: Ocultar Elementos de la UI**
Si quieres ocultar algunos elementos, puedes hacerlo así:

```js
viewer.animation.container.style.visibility = 'hidden'; // Ocultar animación
viewer.timeline.container.style.visibility = 'hidden'; // Ocultar timeline
viewer.geocoder.container.style.visibility = 'hidden'; // Ocultar búsqueda
```

O deshabilitarlos al inicializar `Cesium.Viewer`:

```js
const viewer = new Cesium.Viewer('cesiumContainer', {
  animation: false,
  timeline: false,
  geocoder: false,
  homeButton: false,
  sceneModePicker: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  navigationHelpButton: false,
});
```

Si necesitas modificar algo en particular, dime y te ayudo con el código. 🚀