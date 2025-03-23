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

### Bases de datos

El error que estás viendo (`ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails`) ocurre porque la clave externa en la tabla `fibcab_dev_config` está vinculada incorrectamente. Según el mensaje de error, la clave externa (`sn`) en `fibcab_dev_config` está intentando hacer referencia a la columna `sn` en la tabla `device_info`, pero los valores que estás insertando ('FIBCAB001', 'FIBCAB002', 'FIBCAB003') no existen en `device_info.sn`.

Sin embargo, según tu diseño lógico y los datos proporcionados, parece que la clave externa debería apuntar a la tabla `fibcab_dev_info.sn` en lugar de `device_info.sn`.

---

### **Solución paso a paso**

#### **1. Verificar la definición actual de `fibcab_dev_config`**

La descripción de la tabla muestra que la clave externa está mal configurada. Vamos a eliminar la tabla y recrearla correctamente.

```sql
DROP TABLE IF EXISTS fibcab_dev_config;

CREATE TABLE fibcab_dev_config (
    sn VARCHAR(50) PRIMARY KEY,
    ficab_capacity INT,
    opt1_active_fc_map VARCHAR(50),
    opt1_inactive_fic_map VARCHAR(50),
    opt2_fibcab_perfrmace VARCHAR(50),
    opt2_fiber_attnuetion_coeff FLOAT,
    opt3_connector_loss FLOAT,
    opt3_splice_loss FLOAT,
    opt_fibr_tem_state VARCHAR(50),
    FOREIGN KEY (sn) REFERENCES fibcab_dev_info(sn)
);
```

Aquí hemos corregido la clave externa para que apunte a `fibcab_dev_info.sn` en lugar de `device_info.sn`.

---

#### **2. Insertar datos en `fibcab_dev_config`**

Ahora que la tabla está correctamente vinculada a `fibcab_dev_info`, puedes insertar los datos sin problemas.

```sql
INSERT INTO fibcab_dev_config (sn, ficab_capacity, opt1_active_fc_map, opt1_inactive_fic_map, opt2_fibcab_perfrmace, opt2_fiber_attnuetion_coeff, opt3_connector_loss, opt3_splice_loss, opt_fibr_tem_state)
VALUES
('FIBCAB001', 100, 'ActiveMap1', 'InactiveMap1', 'Performance1', 0.2, 0.1, 0.05, 'Normal'),
('FIBCAB002', 200, 'ActiveMap2', 'InactiveMap2', 'Performance2', 0.3, 0.15, 0.06, 'Normal'),
('FIBCAB003', 150, 'ActiveMap3', 'InactiveMap3', 'Performance3', 0.25, 0.12, 0.07, 'Normal');
```

Esto debería funcionar sin errores, ya que los valores de `sn` ('FIBCAB001', 'FIBCAB002', 'FIBCAB003') existen en la tabla `fibcab_dev_info`.

---

#### **3. Verificar los datos insertados**

Puedes verificar que los datos se han insertado correctamente ejecutando:

```sql
SELECT * FROM fibcab_dev_config;
```

**Resultado esperado:**

| sn        | ficab_capacity | opt1_active_fc_map | opt1_inactive_fic_map | opt2_fibcab_perfrmace | opt2_fiber_attnuetion_coeff | opt3_connector_loss | opt3_splice_loss | opt_fibr_tem_state |
| --------- | -------------- | ------------------ | --------------------- | --------------------- | --------------------------- | ------------------- | ---------------- | ------------------ |
| FIBCAB001 | 100            | ActiveMap1         | InactiveMap1          | Performance1          | 0.2                         | 0.1                 | 0.05             | Normal             |
| FIBCAB002 | 200            | ActiveMap2         | InactiveMap2          | Performance2          | 0.3                         | 0.15                | 0.06             | Normal             |
| FIBCAB003 | 150            | ActiveMap3         | InactiveMap3          | Performance3          | 0.25                        | 0.12                | 0.07             | Normal             |

---

#### **4. Crear y poblar la tabla `fibcab_dev_state`**

De manera similar, asegúrate de que la tabla `fibcab_dev_state` también tenga una clave foránea que apunte a `fibcab_dev_info.sn`.

```sql
DROP TABLE IF EXISTS fibcab_dev_state;

CREATE TABLE fibcab_dev_state (
    sn VARCHAR(50) PRIMARY KEY,
    recordId INT NOT NULL,
    health_point INT,
    warnings VARCHAR(255),
    crisis VARCHAR(255),
    warnlog_url VARCHAR(255),
    crislog_url VARCHAR(255),
    rawfile_url VARCHAR(255),
    FOREIGN KEY (sn) REFERENCES fibcab_dev_info(sn)
);
```

**Insertar datos iniciales:**

```sql
INSERT INTO fibcab_dev_state (sn, recordId, health_point, warnings, crisis, warnlog_url, crislog_url, rawfile_url)
VALUES
('FIBCAB001', 101, 90, 'No warnings', 'No crisis', '/logs/warn/FIBCAB001.log', '/logs/crisis/FIBCAB001.log', '/rawdata/FIBCAB001.raw'),
('FIBCAB002', 102, 85, 'Low performance', 'No crisis', '/logs/warn/FIBCAB002.log', '/logs/crisis/FIBCAB002.log', '/rawdata/FIBCAB002.raw'),
('FIBCAB003', 103, 80, 'Connector issue', 'No crisis', '/logs/warn/FIBCAB003.log', '/logs/crisis/FIBCAB003.log', '/rawdata/FIBCAB003.raw');
```

---

#### **5. Verificar las relaciones entre tablas**

Puedes usar la siguiente consulta para verificar cómo se relacionan las tablas `fibcab_dev_info`, `fibcab_dev_config` y `fibcab_dev_state`.

```sql
SELECT
    f.sn AS fibcab_sn,
    f.source_sn,
    d1.name AS source_name,
    f.target_sn,
    d2.name AS target_name,
    c.ficab_capacity,
    s.health_point,
    s.warnings,
    s.crisis
FROM
    fibcab_dev_info f
JOIN
    device_info d1 ON f.source_sn = d1.sn
JOIN
    device_info d2 ON f.target_sn = d2.sn
LEFT JOIN
    fibcab_dev_config c ON f.sn = c.sn
LEFT JOIN
    fibcab_dev_state s ON f.sn = s.sn;
```

**Resultado esperado:**

| fibcab_sn | source_sn  | source_name | target_sn  | target_name | ficab_capacity | health_point | warnings        | crisis    |
| --------- | ---------- | ----------- | ---------- | ----------- | -------------- | ------------ | --------------- | --------- |
| FIBCAB001 | TAOXIANG   | TAOXIANG    | JIANSAN    | JIANSAN     | 100            | 90           | No warnings     | No crisis |
| FIBCAB002 | JIANSAN    | JIANSAN     | SHENGTIAOA | SHENGTIAOAA | 200            | 85           | Low performance | No crisis |
| FIBCAB003 | SHENGTIAOA | SHENGTIAOAA | TAOXIANG   | TAOXIANG    | 150            | 80           | Connector issue | No crisis |

---

### **Conclusión**

Ahora las tablas `fibcab_dev_config` y `fibcab_dev_state` están correctamente vinculadas a `fibcab_dev_info`, y los datos se han insertado sin problemas. Si necesitas más ayuda o ajustes adicionales, no dudes en preguntar. 😊
