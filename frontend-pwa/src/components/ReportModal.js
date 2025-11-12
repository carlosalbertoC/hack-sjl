import React, { useState, useEffect } from "react";
import { getCategory } from "../constants/categories";

const ReportModal = ({ selectedCategory, position, onSubmit, onCancel }) => {
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit({ category: selectedCategory, position, comment });
    setComment("");
  };

  const hasPosition =
    position && typeof position.lat === "number" && typeof position.lng === "number";

  return (
    <div style={styles.overlay}>
      <div
        style={{
          ...styles.modal,
          opacity: visible ? 1 : 0,
          transform: visible ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.9)",
        }}
      >
        <h3 style={styles.title}>Nuevo reporte</h3>

        <p style={styles.subtitle}>
          Categoría:{" "}
          <span style={styles.badge}>
            {selectedCategory 
              ? (getCategory(selectedCategory)?.label || selectedCategory.toUpperCase())
              : "SIN CATEGORÍA"}
          </span>
        </p>

        <p style={styles.coords}>
          Ubicación:{" "}
          {hasPosition
            ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
            : "sin ubicación"}
        </p>

        <textarea
          style={styles.textarea}
          placeholder="Describe lo ocurrido..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div style={styles.buttons}>
          <button
            style={{
              ...styles.sendBtn,
              opacity: hasPosition ? 1 : 0.5,
              pointerEvents: hasPosition ? "auto" : "none",
            }}
            onClick={handleSubmit}
          >
            Enviar
          </button>
          <button style={styles.cancelBtn} onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.9)",
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    textAlign: "center",
    opacity: 0,
    transition: "all 0.25s ease",
  },
  title: {
    marginBottom: 10,
    color: "#1976d2",
    fontSize: 18,
  },
  subtitle: {
    marginBottom: 6,
    fontSize: 14,
  },
  badge: {
    background: "#E3F2FD",
    color: "#1976d2",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
  },
  coords: {
    fontSize: 13,
    marginBottom: 12,
    color: "#555",
  },
  textarea: {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    minHeight: 90,
    maxHeight: 160,
    overflowY: "auto",
    padding: "12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    resize: "vertical",
    marginBottom: 14,
    fontFamily: "inherit",
    fontSize: 13,
    lineHeight: 1.4,
    outline: "none",
    background: "#fff",
  },
  buttons: {
    display: "flex",
    gap: 10,
    justifyContent: "space-between",
  },
  sendBtn: {
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    flex: 1,
    fontWeight: 500,
  },
  cancelBtn: {
    background: "#f44336",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    flex: 1,
    fontWeight: 500,
  },
};

export default ReportModal;

