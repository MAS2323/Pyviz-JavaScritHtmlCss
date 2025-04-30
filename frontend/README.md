# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

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
viewer.animation.container.style.visibility = "hidden"; // Ocultar animación
viewer.timeline.container.style.visibility = "hidden"; // Ocultar timeline
viewer.geocoder.container.style.visibility = "hidden"; // Ocultar búsqueda
```

O deshabilitarlos al inicializar `Cesium.Viewer`:

```js
const viewer = new Cesium.Viewer("cesiumContainer", {
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

# Consultas SQL para las Tablas Existentes

Basado en las tablas que muestras en tu base de datos SDH (`device_info`, `fibcab_dev_info`, `iolp_dev_info`), aquí están las consultas SQL más útiles:

## Consultas para la tabla `device_info`

1. **Obtener todos los dispositivos:**

```sql
SELECT * FROM device_info;
```

2. **Obtener un dispositivo específico por SN:**

```sql
SELECT * FROM device_info WHERE sn = 'TAOXIANG';
```

3. **Obtener dispositivos con sus métricas de salud:**

```sql
SELECT
    sn,
    gId AS recordId,
    FLOOR(RAND() * 100) AS health_point,
    'No warnings' AS warnings,
    'No crisis' AS crisis,
    CONCAT('http://logs/', sn, '/warn.log') AS warnlog_url,
    CONCAT('http://logs/', sn, '/crisis.log') AS crislog_url,
    CONCAT('http://logs/', sn, '/raw.log') AS rawfile_url,
    ROUND(RAND() * 10, 2) AS opt_pow_mean,
    ROUND(RAND() * 2, 2) AS opt_pow_var,
    ROUND(RAND() * 15, 2) AS opt_pow_max,
    ROUND(RAND() * 5, 2) AS opt_pow_min
FROM device_info;
```

4. **Obtener dispositivos por ubicación:**

```sql
SELECT * FROM device_info WHERE location LIKE '%Ciudad%';
```

## Consultas para la tabla `fibcab_dev_info`

1. **Obtener todas las fibras:**

```sql
SELECT * FROM fibcab_dev_info;
```

2. **Obtener fibras conectadas a un dispositivo específico:**

```sql
SELECT * FROM fibcab_dev_info
WHERE source_sn = 'TAOXIANG' OR target_sn = 'TAOXIANG';
```

3. **Obtener información de fibras con nombres de dispositivos conectados:**

```sql
SELECT
    f.sn AS fibcab_sn,
    f.source_sn,
    s.name AS source_name,
    f.target_sn,
    t.name AS target_name,
    f.length,
    f.fiber_type
FROM fibcab_dev_info f
JOIN device_info s ON f.source_sn = s.sn
JOIN device_info t ON f.target_sn = t.sn;
```

4. **Obtener fibras con información geográfica completa:**

```sql
SELECT
    f.sn,
    f.source_sn,
    s.longitude AS source_longitude,
    s.latitude AS source_latitude,
    f.target_sn,
    t.longitude AS target_longitude,
    t.latitude AS target_latitude
FROM fibcab_dev_info f
JOIN device_info s ON f.source_sn = s.sn
JOIN device_info t ON f.target_sn = t.sn;
```

## Consultas combinadas entre tablas

1. **Relación entre fibras y dispositivos IOLP:**

```sql
SELECT f.sn AS fibcab_sn, i.sn AS iolp_sn
FROM fibcab_dev_info f
JOIN iolp_dev_info i ON f.source_sn = i.sn OR f.target_sn = i.sn;
```

2. **Dispositivos con sus fibras conectadas (versión expandida):**

```sql
SELECT
    d.sn AS device_sn,
    d.name AS device_name,
    GROUP_CONCAT(DISTINCT f.sn) AS connected_fibers,
    COUNT(DISTINCT f.sn) AS fiber_count
FROM device_info d
LEFT JOIN fibcab_dev_info f ON d.sn = f.source_sn OR d.sn = f.target_sn
GROUP BY d.sn, d.name;
```

3. **Topología completa de la red:**

```sql
SELECT
    d1.name AS source_device,
    f.sn AS fiber,
    d2.name AS target_device,
    f.length,
    ST_Distance_Sphere(
        POINT(d1.longitude, d1.latitude),
        POINT(d2.longitude, d2.latitude)
    ) AS distance_meters
FROM fibcab_dev_info f
JOIN device_info d1 ON f.source_sn = d1.sn
JOIN device_info d2 ON f.target_sn = d2.sn;
```

## Consultas para monitoreo y diagnóstico

1. **Dispositivos con posible problemas de salud (ejemplo):**

```sql
SELECT
    sn,
    health_point,
    CASE
        WHEN health_point < 30 THEN 'Critical'
        WHEN health_point < 60 THEN 'Warning'
        ELSE 'Normal'
    END AS status
FROM (
    SELECT
        sn,
        FLOOR(RAND() * 100) AS health_point
    FROM device_info
) AS device_health;
```

2. **Fibras con información de rendimiento (ejemplo):**

```sql
SELECT
    f.sn,
    f.source_sn,
    f.target_sn,
    ROUND(RAND() * 10, 2) AS signal_loss,
    ROUND(RAND() * 5, 2) AS attenuation
FROM fibcab_dev_info f;
```

Estas consultas te permitirán obtener la información necesaria para tu aplicación de visualización de red SDH. Puedes ajustarlas según los campos específicos que necesites para tu frontend.
