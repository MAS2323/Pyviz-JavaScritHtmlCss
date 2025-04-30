import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CesiumViewer from "./components/cesium/CesiumViewer";
import { CesiumProvider } from "./CesiumContext";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Welcome from "./auth/Welcome";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Inicialmente null para indicar carga

  useEffect(() => {
    // Check if user is logged in on initial load
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);

    // Update body class based on auth state
    document.body.classList.toggle("logged-in", loggedInStatus);
    document.body.classList.toggle("auth-mode", !loggedInStatus);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    document.body.classList.add("logged-in");
    document.body.classList.remove("auth-mode");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    document.body.classList.remove("logged-in");
    document.body.classList.add("auth-mode");
  };

  // Mostrar pantalla de carga mientras verificamos el estado de autenticación
  if (isLoggedIn === null) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <div>
        <CesiumProvider>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <CesiumViewer onLogout={handleLogout} />
                ) : (
                  <Navigate to="/welcome" />
                )
              }
            />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </CesiumProvider>
      </div>
    </Router>
  );
}

export default App;
