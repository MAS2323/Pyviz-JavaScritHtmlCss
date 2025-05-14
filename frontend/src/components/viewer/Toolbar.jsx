import React, { useState, useRef, useEffect } from "react";
import { useCesium } from "../../CesiumContext";
import FileMenu from "../pages/FileMenu";
import ViewMenu from "../pages/ViewMenu";
import UserMenu from "../pages/UserMenu";
import CpuViewer from "../pages/CpuViewer";
import "./styles/Toolbar.css";

const Toolbar = ({ viewer, isMobile, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const toolbarRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isMenuButton = event.target.closest(".toolbar-menu button");
      const isDropdown =
        dropdownRef.current && dropdownRef.current.contains(event.target);

      if (!isMenuButton && !isDropdown) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!viewer || !searchTerm.trim()) return;

    const geocoderService = new Cesium.IonGeocoderService({
      scene: viewer.scene,
    });

    geocoderService
      .geocode(searchTerm.trim())
      .then((results) => {
        if (results.length === 0) {
          console.warn("No results found for:", searchTerm);
          setSearchTerm("");
          return;
        }

        const result = results[0];
        const destination = result.destination;

        viewer.camera.flyTo({
          destination: destination,
          duration: 3,
          orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-45.0),
            roll: 0.0,
          },
        });

        setSearchTerm("");
      })
      .catch((error) => {
        console.error("Error during geocoding:", error);
        setSearchTerm("");
      });
  };

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const renderMenu = () => {
    const menus = {
      file: <FileMenu closeMenu={() => setActiveMenu(null)} />,
      view: <ViewMenu closeMenu={() => setActiveMenu(null)} />,
      User: (
        <UserMenu closeMenu={() => setActiveMenu(null)} onLogout={onLogout} />
      ),
      cpu: <CpuViewer closeMenu={() => setActiveMenu(null)} />,
    };
    return menus[activeMenu] || null;
  };

  const menuTranslations = {
    file: { en: "File", zh: "文件" },
    view: { en: "View", zh: "视图" },
    User: { en: "User", zh: "用户" },
    cpu: { en: "CPU", zh: "CPU使用率" },
  };

  return (
    <div className="toolbar-container" ref={toolbarRef}>
      <div className="toolbar-title">
        基于PyViz的智能光SDH数字孪生前端技术研究
      </div>

      <div className="toolbar-search-container">
        <form className="toolbar-search" onSubmit={handleSearch}>
          <button type="submit" aria-label="Buscar">
            <i className="fas fa-search" />
          </button>
          <input
            type="text"
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="toolbar-menu">
        {["file", "view", "cpu", "User"].map((menu) => (
          <button key={menu} onClick={() => toggleMenu(menu)}>
            {menuTranslations[menu].zh} ({menuTranslations[menu].en})
          </button>
        ))}
      </div>

      <div
        className={`toolbar-dropdown ${activeMenu ? "active" : ""}`}
        ref={dropdownRef}
      >
        {renderMenu()}
      </div>
    </div>
  );
};

export default Toolbar;
