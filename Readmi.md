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

```http
http://127.0.0.1:8000/fibcab/dev-config/FIBCAB001
http://127.0.0.1:8000/fibcab/dev-state/FIBCAB001
```

Para crear un archivo de texto (`requirements.txt`) que contenga todas las dependencias de tu proyecto Python instaladas en tu entorno virtual (`venv`), sigue estos pasos:

### **1. Activa tu entorno virtual**

- **Windows (CMD/PowerShell):**
  ```cmd
  .\venv\Scripts\activate
  ```
- **Linux/macOS:**
  ```bash
  source venv/bin/activate
  ```

### **2. Generar el archivo `requirements.txt`**

Ejecuta el siguiente comando para listar todas las dependencias instaladas en el entorno y guardarlas en `requirements.txt`:

```bash
pip freeze > requirements.txt
```

### **3. Verifica el archivo generado**

Abre el archivo `requirements.txt` (se creará en la raíz de tu proyecto) y verifica que contiene todas las dependencias con sus versiones, por ejemplo:

```
numpy==1.24.3
pandas==2.0.1
Flask==2.3.2
```

---

### **Bonus: Instalar dependencias desde `requirements.txt`**

Si necesitas reinstalar las dependencias en otro entorno (o en otro equipo), usa:

```bash
pip install -r requirements.txt
```

### **Alternativa: Si usas `pipenv` o `poetry`**

- **Pipenv** (genera `Pipfile.lock`):
  ```bash
  pipenv lock -r > requirements.txt
  ```
- **Poetry** (genera `poetry.lock`):
  ```bash
  poetry export -f requirements.txt --output requirements.txt
  ```

¡Listo! Ahora tienes un archivo portable con todas las dependencias de tu proyecto.

```sql
-- Clear existing data to avoid duplicates (optional, comment out if appending data)
TRUNCATE TABLE fibcab_dev_state;
TRUNCATE TABLE fibcab_dev_config;
TRUNCATE TABLE fibcab_dev_info;
TRUNCATE TABLE traffstub_dev_state;
TRUNCATE TABLE traffstub_dev_config;
TRUNCATE TABLE traffstub_dev_info;
TRUNCATE TABLE sdh_dev_state;
TRUNCATE TABLE sdh_dev_config;
TRUNCATE TABLE sdh_dev_info;
TRUNCATE TABLE iolp_dev_state;
TRUNCATE TABLE iolp_dev_config;
TRUNCATE TABLE iolp_dev_info;
TRUNCATE TABLE jmpmat;
TRUNCATE TABLE device_info;
TRUNCATE TABLE control_frames;

-- Insert into control_frames
INSERT INTO control_frames (cmdFlg, gId, param, length, `values`, timestamp) VALUES
(1, 1001, 101, 64, X'53494E43485349474E414C', '2025-04-30 10:00:00'),
(1, 1002, 102, 64, X'53494E43485349474E414C', '2025-04-30 10:01:00'),
(1, 1003, 103, 64, X'53494E43485349474E414C', '2025-04-30 10:02:00'),
(1, 1004, 104, 64, X'53494E43485349474E414C', '2025-04-30 10:03:00');

-- Insert into device_info
INSERT INTO device_info (sn, gId, name, city, location, longitude, lattitude, Producer) VALUES
('DEV-1001', 1001, 'Guangyuan Bureau', 'Guangyuan', 'Guangyuan Bureau, Guangyuan City', 105.8435, 32.4357, 'Sichuan Telecom'),
('DEV-1002', 1002, 'Mianyang Bureau', 'Mianyang', 'Mianyang Bureau, Mianyang City', 104.6796, 31.4675, 'Sichuan Telecom'),
('DEV-1003', 1003, 'Nanchong', 'Nanchong', 'Nanchong Station, Nanchong City', 106.1107, 30.8373, 'Sichuan Telecom'),
('DEV-1004', 1004, 'Provincial Dispatch A', 'Chengdu', 'Provincial Dispatch A, Chengdu City', 104.0668, 30.5728, 'Sichuan Telecom');

-- Insert into sdh_dev_info
INSERT INTO sdh_dev_info (sn, gId, tagId, Type) VALUES
('DEV-1001', 1001, 'FIB-TAG-1001', 'SDH'),
('DEV-1002', 1002, 'FIB-TAG-1002', 'SDH'),
('DEV-1003', 1003, 'FIB-TAG-1003', 'SDH'),
('DEV-1004', 1004, 'FIB-TAG-1004', 'SDH');

-- Insert into iolp_dev_info
INSERT INTO iolp_dev_info (sn, gId, tagId, Type) VALUES
('DEV-1001', 1001, 'FIB-TAG-1001', 'IOLP'),
('DEV-1002', 1002, 'FIB-TAG-1002', 'IOLP'),
('DEV-1003', 1003, 'FIB-TAG-1003', 'IOLP'),
('DEV-1004', 1004, 'FIB-TAG-1004', 'IOLP');

-- Insert into jmpmat
INSERT INTO jmpmat (gId, actNum, maxPorts, actMap, sdh_sn, iolp_sn, sn) VALUES
(1001, 4, 8, '1,2,3,4', 'DEV-1001', 'DEV-1001', 'JMP-001'),
(1002, 4, 8, '1,2,3,4', 'DEV-1002', 'DEV-1002', 'JMP-002'),
(1003, 4, 8, '1,2,3,4', 'DEV-1003', 'DEV-1003', 'JMP-003'),
(1004, 4, 8, '1,2,3,4', 'DEV-1004', 'DEV-1004', 'JMP-004');

-- Insert into traffstub_dev_info
INSERT INTO traffstub_dev_info (sn, gId, tagId, Type) VALUES
('DEV-1001', 1001, 'FIB-TAG-1001', 'TraffStub'),
('DEV-1002', 1002, 'FIB-TAG-1002', 'TraffStub'),
('DEV-1003', 1003, 'FIB-TAG-1003', 'TraffStub'),
('DEV-1004', 1004, 'FIB-TAG-1004', 'TraffStub');

-- Insert into fibcab_dev_info (reversed orientations)
INSERT INTO fibcab_dev_info (sn, gId, tagId, Type, name, total_fiber_number, connected_fiber_number, connected_array, suspended_fiber_number, suspended_array, cable_temp, source_sn, target_sn) VALUES
('FIB-1001', 1001, 'FIB-TAG-1001', 'Fibcab', 'Chengdu to Guangyuan Fibcab', 62, 62, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62', 0, '', 24, 'DEV-1004', 'DEV-1001'),
('FIB-1001R', 1001, 'FIB-TAG-1001R', 'Fibcab', 'Guangyuan to Chengdu Fibcab', 62, 62, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62', 0, '', 24, 'DEV-1001', 'DEV-1004'),
('FIB-1002', 1002, 'FIB-TAG-1002', 'Fibcab', 'Chengdu to Mianyang Fibcab', 62, 62, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62', 0, '', 24.5, 'DEV-1004', 'DEV-1002'),
('FIB-1002R', 1002, 'FIB-TAG-1002R', 'Fibcab', 'Mianyang to Chengdu Fibcab', 62, 62, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62', 0, '', 24.5, 'DEV-1002', 'DEV-1004'),
('FIB-1003', 1003, 'FIB-TAG-1003', 'Fibcab', 'Chengdu to Nanchong Fibcab', 62, 62, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62', 0, '', 25, 'DEV-1004', 'DEV-1003'),
('FIB-1003R', 1003, 'FIB-TAG-1003R', 'Fibcab', 'Nanchong to Chengdu Fibcab', 62, 62, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62', 0, '', 25, 'DEV-1003', 'DEV-1004'),
('FIB-1004', 1004, 'FIB-TAG-1004', 'Fibcab', 'Provincial Dispatch A Fibcab', 62, 60, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60', 2, '61,62', 25.5, 'DEV-1004', 'DEV-1004');

-- Insert into fibcab_dev_config
INSERT INTO fibcab_dev_config (sn, ficab_capacity, opt1_active_fc_map, opt1_inactive_fic_map, opt2_fibcab_perfrmace, opt2_fiber_attnuetion_coeff, opt3_connector_loss, opt3_splice_loss, opt_fibr_tem_state) VALUES
('FIB-1001', 62, '1,2,3,4,5,6,7,8,9,10', '', 'High', 0.2, 0.1, 0.05, 'Normal'),
('FIB-1001R', 62, '1,2,3,4,5,6,7,8,9,10', '', 'High', 0.2, 0.1, 0.05, 'Normal'),
('FIB-1002', 62, '1,2,3,4,5,6,7,8,9,10', '', 'Medium', 0.25, 0.15, 0.06, 'Normal'),
('FIB-1002R', 62, '1,2,3,4,5,6,7,8,9,10', '', 'Medium', 0.25, 0.15, 0.06, 'Normal'),
('FIB-1003', 62, '1,2,3,4,5,6,7,8,9,10', '', 'High', 0.2, 0.1, 0.05, 'Normal'),
('FIB-1003R', 62, '1,2,3,4,5,6,7,8,9,10', '', 'High', 0.2, 0.1, 0.05, 'Normal'),
('FIB-1004', 62, '1,2,3,4,5,6,7,8,9,10', '61,62', 'High', 0.3, 0.2, 0.07, 'Warning');

-- Insert into fibcab_dev_state
INSERT INTO fibcab_dev_state (sn, recordId, health_point, warnings, crisis, warnlog_url, crislog_url, rawfile_url) VALUES
('FIB-1001', 1, 95, 'Minor temperature fluctuation', NULL, 'http://logs.example.com/warn/fib-1001-ctg', NULL, 'http://raw.example.com/fib-1001-ctg'),
('FIB-1001R', 1, 95, 'Minor temperature fluctuation', NULL, 'http://logs.example.com/warn/fib-1001R-gtc', NULL, 'http://raw.example.com/fib-1001R-gtc'),
('FIB-1002', 1, 90, 'Signal loss on fiber 10', NULL, 'http://logs.example.com/warn/fib-1002-ctm', NULL, 'http://raw.example.com/fib-1002-ctm'),
('FIB-1002R', 1, 90, 'Signal loss on fiber 10', NULL, 'http://logs.example.com/warn/fib-1002R-mtc', NULL, 'http://raw.example.com/fib-1002R-mtc'),
('FIB-1003', 1, 98, NULL, NULL, NULL, NULL, 'http://raw.example.com/fib-1003-ctn'),
('FIB-1003R', 1, 98, NULL, NULL, NULL, NULL, 'http://raw.example.com/fib-1003R-ntc'),
('FIB-1004', 1, 85, 'Suspended fibers detected', NULL, 'http://logs.example.com/warn/fib-1004', NULL, 'http://raw.example.com/fib-1004');

-- Insert into iolp_dev_config
INSERT INTO iolp_dev_config (sn, switch_vec, actived_pairs, inactived_pairs, in2dev_gId, in2dev_connmap, out2dev_gId, out2dev_connmap, thermsensor_id) VALUES
('DEV-1001', '1,0,1', '1-2,3-4', '5-6', 1001, '1:1,2:2', 1004, '3:1,4:2', 'THERM-1001'),
('DEV-1002', '0,1,1', '1-3,2-4', '5-7', 1002, '1:3,2:4', 1004, '3:3,4:4', 'THERM-1002'),
('DEV-1003', '1,1,0', '1-5,2-6', '3-4', 1003, '1:5,2:6', 1004, '5:5,6:6', 'THERM-1003'),
('DEV-1004', '1,1,1', '1-2,3-4', '5-6', 1004, '1:1,2:2', 1004, '3:1,4:2', 'THERM-1004');

-- Insert into iolp_dev_state
INSERT INTO iolp_dev_state (sn, recordId, health_point, warnings, crisis, warnlog_url, crislog_url, rawfile_url, opt_pow_mean, opt_pow_var, opt_pow_max, opt_pow_min) VALUES
('DEV-1001', 1, 92, 'Low optical power on pair 1-2', NULL, 'http://logs.example.com/warn/iolp-1001', NULL, 'http://raw.example.com/iolp-1001', 3.5, 0.2, 3.8, 3.2),
('DEV-1002', 1, 88, 'Intermittent connection on pair 2-4', NULL, 'http://logs.example.com/warn/iolp-1002', NULL, 'http://raw.example.com/iolp-1002', 3.7, 0.3, 4.0, 3.4),
('DEV-1003', 1, 95, NULL, NULL, NULL, NULL, 'http://raw.example.com/iolp-1003', 3.6, 0.1, 3.9, 3.3),
('DEV-1004', 1, 90, 'High variance in optical power', NULL, 'http://logs.example.com/warn/iolp-1004', NULL, 'http://raw.example.com/iolp-1004', 3.4, 0.4, 3.9, 3.0);

-- Insert into sdh_dev_config
INSERT INTO sdh_dev_config (sn, opt1_dir_name, opt1_dir_gId, opt1_trans_type, opt1_traffic, opt2_dir_name, opt2_dir_gId, opt2_trans_type, opt2_traffic) VALUES
('DEV-1001', 'Chengdu to Guangyuan', 1004, 'STM-16', 'High', 'Guangyuan to Chengdu', 1001, 'STM-16', 'Medium'),
('DEV-1002', 'Chengdu to Mianyang', 1004, 'STM-4', 'Medium', 'Mianyang to Chengdu', 1002, 'STM-4', 'Low'),
('DEV-1003', 'Chengdu to Nanchong', 1004, 'STM-16', 'High', 'Nanchong to Chengdu', 1003, 'STM-16', 'High'),
('DEV-1004', 'Provincial Dispatch A', 1004, 'STM-64', 'High', 'Provincial Dispatch A', 1004, 'STM-64', 'High');

-- Insert into sdh_dev_state
INSERT INTO sdh_dev_state (sn, recordId, health_point, warnings, crisis, warnlog_url, crislog_url, rawfile_url) VALUES
('DEV-1001', 1, 90, 'High latency on opt1', NULL, 'http://logs.example.com/warn/sdh-1001', NULL, 'http://raw.example.com/sdh-1001'),
('DEV-1002', 1, 85, 'Packet loss on opt2', NULL, 'http://logs.example.com/warn/sdh-1002', NULL, 'http://raw.example.com/sdh-1002'),
('DEV-1003', 1, 93, NULL, NULL, NULL, NULL, 'http://raw.example.com/sdh-1003'),
('DEV-1004', 1, 88, 'Minor traffic overload', NULL, 'http://logs.example.com/warn/sdh-1004', NULL, 'http://raw.example.com/sdh-1004');

-- Insert into traffstub_dev_config
INSERT INTO traffstub_dev_config (sn, txer_Id, txer_destaddr, txer_pkgrate, rxer_Id, rxer_srcaddr, rxer_pkgrate) VALUES
('DEV-1001', 'TX-1001', 'DEV-1004', '1000', 'RX-1001', 'DEV-1004', '800'),
('DEV-1002', 'TX-1002', 'DEV-1004', '500', 'RX-1002', 'DEV-1004', '400'),
('DEV-1003', 'TX-1003', 'DEV-1004', '1000', 'RX-1003', 'DEV-1004', '900'),
('DEV-1004', 'TX-1004', 'DEV-1004', '2000', 'RX-1004', 'DEV-1004', '1800');

-- Insert into traffstub_dev_state
INSERT INTO traffstub_dev_state (sn, recordId, health_point, warnings, crisis, warnlog_url, crislog_url, rawfile_url, timestamp) VALUES
('DEV-1001', 1, 91, 'High bandwidth usage', NULL, 'http://logs.example.com/warn/ts-1001', NULL, 'http://raw.example.com/ts-1001', '2025-04-30 10:00:00'),
('DEV-1002', 1, 87, 'Intermittent traffic drops', NULL, 'http://logs.example.com/warn/ts-1002', NULL, 'http://raw.example.com/ts-1002', '2025-04-30 10:01:00'),
('DEV-1003', 1, 94, NULL, NULL, NULL, NULL, 'http://raw.example.com/ts-1003', '2025-04-30 10:02:00'),
('DEV-1004', 1, 89, 'Overloaded traffic', NULL, 'http://logs.example.com/warn/ts-1004', NULL, 'http://raw.example.com/ts-1004', '2025-04-30 10:03:00');
```
