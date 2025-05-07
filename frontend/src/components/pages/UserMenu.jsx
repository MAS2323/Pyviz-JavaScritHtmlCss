import React, { useState, useEffect } from "react";
import { getUserById, logoutUser } from "../../helpers/api";
import "./styles/UserMenu.css";

export default function UserMenu({ closeMenu, onLogout }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("用户ID未找到，请重新登录");
        }
        console.log("尝试获取用户ID:", userId); // 调试输出
        const userData = await getUserById(userId);
        setUser({
          name: userData.username,
          email: userData.email,
          avatar: "https://via.placeholder.com/40",
        });
      } catch (err) {
        console.error("获取用户信息失败:", err);
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logoutUser();
    onLogout();
    closeMenu();
  };

  if (!user && error) {
    return (
      <div className="user-menu">
        <p className="error">{error}</p>
        <button className="menu-option" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" />
          登出
        </button>
      </div>
    );
  }

  if (!user) {
    return <div>加载中...</div>;
  }

  return (
    <div className="user-menu">
      {error && <p className="error">{error}</p>}
      <div className="user-profile">
        <img src={user.avatar} alt={user.name} className="user-avatar" />
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-email">{user.email}</span>
        </div>
      </div>
      <div className="menu-options">
        <button className="menu-option" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" />
          登出
        </button>
        <hr className="divider" />
        <button className="menu-option">
          <i className="fas fa-cog" />
          设置
        </button>
        <button className="menu-option">
          <i className="fas fa-question-circle" />
          帮助
        </button>
        <button className="menu-option">
          <i className="fas fa-comment-dots" />
          反馈
        </button>
      </div>
      <div className="footer-links">
        <a href="/privacy" className="footer-link">
          隐私政策
        </a>
        <span className="dot">•</span>
        <a href="/terms" className="footer-link">
          服务条款
        </a>
      </div>
    </div>
  );
}
