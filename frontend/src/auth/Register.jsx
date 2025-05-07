import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../helpers/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await registerUser({ username, email, password });
      localStorage.setItem("userId", userData.id); // 存储用户ID
      console.log("注册成功，用户ID:", userData.id); // 调试输出
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>注册</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="用户名"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="电子邮件"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="密码"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">注册</button>
      </form>
      <p>
        已有账号？ <Link to="/login">点击此处登录</Link>
      </p>
    </div>
  );
};

export default Register;
