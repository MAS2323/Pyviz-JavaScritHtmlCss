import { viewer } from "./cesiumSetup.js"; // Importamos el viewer configurado

// Función para cargar datos desde el backend
function loadData() {
  axios
    .get("http://localhost:8000/get_data")
    .then((response) => {
      const data = response.data;

      if (data.message) {
        console.log(data.message); // Mensaje si no hay datos
        return;
      }

      data.forEach((point) => {
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            point.longitude,
            point.latitude,
            point.altitude
          ),
          point: {
            pixelSize: 20, // Aumenta el tamaño del punto
            color: Cesium.Color.RED,
          },
          label: {
            text: `Lat: ${point.latitude}, Lon: ${point.longitude}`, // Agrega una etiqueta
            font: "14px sans-serif",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          },
        });
      });

      // Ocultar créditos de Cesium
      viewer.cesiumWidget.creditContainer.style.display = "none";

      // Centrar la cámara en los datos
      viewer.zoomTo(viewer.entities);
    })
    .catch((error) => {
      console.error("Error loading data:", error);
    });
}

// Exportamos la función para usarla en `app.js`
export { loadData };
