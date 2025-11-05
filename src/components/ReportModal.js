import React, { useState } from "react";

const ReportModal = ({ selectedCategory, position, onSubmit, onCancel }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit({ category: selectedCategory, position, comment });
    setComment("");
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Nuevo reporte</h3>
        <p style={styles.subtitle}>
          Categoría: <b>{selectedCategory}</b>
        </p>
        <p style={styles.coords}>
          Ubicación: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
        </p>

        <textarea
          style={styles.textarea}
          placeholder="Describe lo ocurrido..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div style={styles.buttons}>
          <button style={styles.sendBtn} onClick={handleSubmit}>Enviar</button>
          <button style={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw", height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 360,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  title: { marginBottom: 10, color: "#1976d2" },
  subtitle: { marginBottom: 6 },
  coords: { fontSize: 13, marginBottom: 10 },
  textarea: {
    width: "100%",
    height: 80,
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ccc",
    resize: "none",
    marginBottom: 10,
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },
  sendBtn: {
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#f44336",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
  },
};

export default ReportModal;
