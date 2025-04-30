import React from "react";
import "./styles/UserMenu.css";

export default function UserMenu({ closeMenu, onLogout }) {
  const user = {
    name: "Mas Onewe", // 翻译为中文名字（假设的音译）
    email: "masonewe@gmail.com",
    avatar: "https://via.placeholder.com/40",
  };

  const handleLogout = () => {
    onLogout(); // 触发登出功能
    closeMenu(); // 登出后关闭菜单
  };

  return (
    <div className="user-menu">
      <div className="user-profile">
        <img src={user.avatar} alt={user.name} className="user-avatar" />
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-email">{user.email}</span>
        </div>
      </div>
      {/* <button className="manage-account-btn">管理您的Google帐户</button> */}
      <div className="menu-options">
        <button className="menu-option">
          <i className="fas fa-user-plus" />
          添加另一个帐户
        </button>
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
