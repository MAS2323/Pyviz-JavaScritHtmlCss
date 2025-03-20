// Configurar el token de Cesium Ion
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxOTYyMTc5ZC00Y2IyLTRlMWEtOGM4OS00Njg5OGVhNzdhZGMiLCJpZCI6MjcxNTA3LCJpYXQiOjE3Mzc4Nzg1MTN9.xL6gLe2zsw-YBfc-9O4BviD4AEXJLQ-jby9AOtxdlbQ";

// Inicializar el visor de Cesium
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: Cesium.createWorldTerrain(), // Habilita el terreno global
  animation: false, // Desactiva la animación
  timeline: false, // Desactiva la línea de tiempo
  geocoder: false, // Desactiva el geocodificador
  baseLayerPicker: true, // Desactiva el selector de capas base
  creditContainer: document.createElement("div"),
});

// Exportar el viewer para ser usado en otros scripts
export { viewer };
