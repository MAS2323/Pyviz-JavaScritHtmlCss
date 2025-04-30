document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  console.log("El DOM está cargado");

  // Verifica si el formulario está presente en el DOM
  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Evita el comportamiento predeterminado del formulario (recarga de página)

      // Obtener los valores del formulario
      const username = document.getElementById("regUsername").value;
      const password = document.getElementById("regPassword").value;

      // Verificar si los campos están vacíos
      if (!username || !password) {
        alert("Por favor, complete todos los campos.");
        return;
      }

      // Guardar el usuario en localStorage
      const newUser = { username, password };
      localStorage.setItem("registeredUser", JSON.stringify(newUser));

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "?page=login"; // Redirige a la página de login
    });
  } else {
    console.error("Formulario no encontrado.");
  }
});
