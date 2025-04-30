import { viewer } from "./cesiumSetup.js"; // Importa el viewer de CesiumJS

// Crear el Geocoder y conectarlo a un contenedor personalizado
const geocoderContainer = document.getElementById("cesiumGeocoder");
const geocoder = new Cesium.Geocoder({
  container: geocoderContainer,
  scene: viewer.scene,
});

// Obtener el contenedor del pop-up
const searchPopup = document.getElementById("searchPopup");

// Reemplazar la barra de búsqueda predeterminada con un `input`
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Search places...";
searchInput.classList.add("search-bar");

// Insertar el input en el geocoderContainer
geocoderContainer.appendChild(searchInput);

// Escuchar cambios en el input y mostrar resultados en el pop-up
searchInput.addEventListener("input", async function () {
  const query = searchInput.value.trim();
  if (!query) {
    searchPopup.style.display = "none";
    return;
  }

  try {
    // Llamar a la API de geocodificación de Cesium
    const geocodeResults = await geocoder.viewModel._geocode(query);
    if (geocodeResults.length === 0) {
      searchPopup.style.display = "none";
      return;
    }

    // Limpiar y poblar el pop-up con los resultados
    searchPopup.innerHTML = "";
    geocodeResults.forEach((result) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result");
      resultItem.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${result.displayName}`;
      resultItem.addEventListener("click", () => {
        viewer.camera.flyTo({
          destination: result.destination,
        });
        searchInput.value = result.displayName;
        searchPopup.style.display = "none";
      });

      searchPopup.appendChild(resultItem);
    });

    searchPopup.style.display = "block";
  } catch (error) {
    console.error("Error en la geocodificación:", error);
    searchPopup.style.display = "none";
  }
});

// Ocultar pop-up si se hace clic fuera
document.addEventListener("click", function (e) {
  if (!searchPopup.contains(e.target) && e.target !== searchInput) {
    searchPopup.style.display = "none";
  }
});
