import React from "react";
import { FaHandHoldingUsd, FaExclamationTriangle, FaSkull, FaUserSecret } from "react-icons/fa";

const categories = [
  { id: "robo", label: "Robo", color: "#e53935", icon: <FaHandHoldingUsd size={20} /> },
  { id: "balacera", label: "Balacera", color: "#ff9800", icon: <FaExclamationTriangle size={20} /> },
  { id: "drogas", label: "Drogas", color: "#8e24aa", icon: <FaSkull size={20} /> },
  { id: "sospechoso", label: "Sospechoso", color: "#1565c0", icon: <FaUserSecret size={20} /> },
];

const CategoryBar = ({ onSelectCategory }) => {
  return (
    <div style={styles.container}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          style={{ ...styles.button, color: cat.color }}
        >
          {cat.icon}
          <span style={styles.label}>{cat.label}</span>
        </button>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    bottom: 15,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    background: "rgba(255,255,255,0.95)",
    borderRadius: 30,
    padding: "6px 10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  button: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "none",
    border: "none",
    margin: "0 8px",
    cursor: "pointer",
    fontSize: 12,
  },
  label: {
    fontSize: 11,
    marginTop: 2,
  },
};

export default CategoryBar;
