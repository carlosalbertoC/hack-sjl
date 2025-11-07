import React from "react";
import { MdReport } from "react-icons/md";

const FloatingLoginButton = ({ onOpenReport }) => {
  return (
    <button onClick={onOpenReport} style={styles.button}>
      <MdReport size={20} />
    </button>
  );
};

const styles = {
  button: {
    position: "fixed",
    top: "70px", // bajado un poco
    right: "15px",
    backgroundColor: "#da1212ff",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
    cursor: "pointer",
    zIndex: 1000,
  },
};

export default FloatingLoginButton;
