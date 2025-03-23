import { loadComponent } from "./loadComponent.js";

// Función para inicializar los popups
export async function initializePopups() {
  // Cargar los componentes modulares
  await loadComponent("./components/leftPopup.html", "body");
  await loadComponent("./components/rightPopup.html", "body");

  // Obtener referencias a los popups
  const leftPopup = document.getElementById("leftPopup");
  const rightPopup = document.getElementById("rightPopup");

  // Función para cerrar un popup
  const closePopup = (popup) => {
    popup.style.display = "none";
  };

  // Agregar eventos para cerrar los popups
  document.getElementById("closeLeftPopup").addEventListener("click", () => {
    closePopup(leftPopup);
  });

  document.getElementById("closeRightPopup").addEventListener("click", () => {
    closePopup(rightPopup);
  });

  return {
    showLeftPopup: (data) => {
      document.getElementById("componentId").textContent = data.id;
      document.getElementById("componentName").textContent = data.name;
      document.getElementById("componentDescription").textContent =
        data.description;
      leftPopup.style.display = "block";
    },
    showRightPopup: (data) => {
      document.getElementById("deviceName").textContent = data.name;
      document.getElementById("deviceLocation").textContent = data.location;
      document.getElementById("deviceStatus").textContent = data.status;
      rightPopup.style.display = "block";
    },
  };
}
