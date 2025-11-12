import React from "react";
import { CATEGORIES_LIST } from "../constants/categories";

const CategoryBar = ({ onSelectCategory }) => {
  return (
    <div style={styles.container}>
      {CATEGORIES_LIST.map((cat) => {
        const IconComponent = cat.icon;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            style={{ ...styles.button, color: cat.color }}
            title={cat.label}
          >
            <IconComponent size={20} />
            <span style={styles.label}>
              {cat.label.length > 10 ? cat.label.substring(0, 8) + "..." : cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "15px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "30px",
    padding: "8px 12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    zIndex: 1000,
    maxWidth: "calc(100vw - 30px)",
    flexWrap: "nowrap",
  },
  button: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "none",
    border: "none",
    margin: "0 6px",
    padding: "4px",
    cursor: "pointer",
    fontSize: "12px",
    minWidth: "50px",
    flexShrink: 0,
  },
  label: {
    fontSize: "10px",
    marginTop: "2px",
    whiteSpace: "nowrap",
  },
};

export default CategoryBar;

