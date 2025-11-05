import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.backBtn}>← Volver</button>
      <h1 style={styles.title}>Panel de Municipalidad</h1>
      <p style={styles.text}>Aquí se mostrarán reportes, estadísticas y mapas de calor.</p>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#f5f5f5",
    padding: 20,
    fontFamily: "Arial",
  },
  title: {
    color: "#1976d2",
    marginTop: 40,
  },
  text: {
    marginTop: 10,
    color: "#333",
  },
  backBtn: {
    border: "none",
    background: "#1976d2",
    color: "white",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
  },
};

export default DashboardPage;
