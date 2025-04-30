import React, { useState, useEffect, useRef } from "react";
import "./styles/DraggablePopup.css";

const DraggablePopup = ({
  children,
  title,
  onClose,
  initialPosition = { x: 50, y: 50 },
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: 350, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  // Funciones para arrastrar el popup (ratón y táctil)
  const handleDragStart = (e) => {
    if (e.target.classList.contains("popup-header")) {
      setIsDragging(true);
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
      setDragStart({
        x: clientX - position.x,
        y: clientY - position.y,
      });
      e.preventDefault();
    }
  };

  const handleDragMove = (e) => {
    if (isDragging) {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
      const newX = clientX - dragStart.x;
      const newY = clientY - dragStart.y;
      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - size.width)),
        y: Math.max(0, Math.min(newY, window.innerHeight - size.height)),
      });
      e.preventDefault();
    }
    if (isResizing) {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
      const newWidth = Math.max(200, clientX - position.x);
      const newHeight = Math.max(200, clientY - position.y);
      setSize({
        width: newWidth,
        height: newHeight,
      });
      e.preventDefault();
    }
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    setIsResizing(false);
    e.preventDefault();
  };

  // Funciones para redimensionar el popup (ratón y táctil)
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, isResizing, dragStart, position, size]);

  return (
    <div
      className="draggable-popup"
      ref={popupRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: "none",
      }}
    >
      <div
        className="popup-header"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <span>{title}</span>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="popup-content">{children}</div>
      <div
        className="resize-handle"
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
      ></div>
    </div>
  );
};

export default DraggablePopup;
