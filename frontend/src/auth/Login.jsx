import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../helpers/api";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginData = await loginUser({ email, password });
      // 从 JWT 令牌中提取 userId
      const payload = JSON.parse(atob(loginData.access_token.split(".")[1]));
      localStorage.setItem("userId", payload.sub); // 存储用户ID
      console.log("登录成功，用户ID:", payload.sub); // 调试输出
      onLogin();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>登录</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">登录</button>
      </form>
      <p>
        没有账号？ <Link to="/register">点击此处注册</Link>
      </p>
    </div>
  );
};

export default Login;
