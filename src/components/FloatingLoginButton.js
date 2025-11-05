import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";

const FloatingLoginButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/dashboard")} style={styles.button}>
      <FaUserShield size={20} />
    </button>
  );
};

const styles = {
  button: {
    position: "fixed",
    top: "15px",
    right: "15px",
    backgroundColor: "#1976d2",
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