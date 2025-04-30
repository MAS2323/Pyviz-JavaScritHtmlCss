// Verificar el estado de inicio de sesión al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    // Aplicar la clase 'logged-in' al body
    document.body.classList.add("logged-in");
  } else {
    // Si no ha iniciado sesión, asegurarse de que la clase 'logged-in' no esté presente
    document.body.classList.remove("logged-in");
  }
});
