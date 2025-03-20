document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Obtener los valores del formulario
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Recuperar los datos del usuario registrado desde localStorage
    const storedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (
      storedUser &&
      storedUser.username === username &&
      storedUser.password === password
    ) {
      alert("Inicio de sesión exitoso");
      localStorage.setItem("loggedIn", "true");
      window.location.href = "?page=main"; // Redirige a la página principal
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  });
});
