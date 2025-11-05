import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";

const FloatingLoginButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/dashboard")} style={styles.button}>
      <FaUserShield size={22} />
    </button>
  );
};

const styles = {
  button: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: 50,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
    cursor: "pointer",
  },
};

export default FloatingLoginButton;
