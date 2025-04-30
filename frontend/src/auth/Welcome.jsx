import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="auth-container2">
      <h1>Welcome to 基于PyViz的智能光SDH数字孪生前端技术研究</h1>
      <p>Please log in or register to continue.</p>
      <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
        <Link to="/login" className="auth-button">
          Login
        </Link>
        <Link to="/register" className="auth-button">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
