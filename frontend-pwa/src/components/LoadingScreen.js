import React, { useEffect } from "react";
import appLogo from "../assets/barrio_alerta_logo.png";

const LoadingScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={styles.overlay}>
      <div style={styles.logoWrapper}>
        <img
          src={appLogo}
          alt="Barrio Alerta"
          style={{
            height: 70,
            width: "auto",
            padding: "0 16px 0 16px",
            objectFit: "contain",
          }}
        />
      </div>
      <p style={styles.sub}>Cargando mapa de tu zona...</p>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100dvh",
    backgroundColor: "#1976d2",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
    zIndex: 9999,
  },
  logoWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
  },
  sub: {
    fontSize: "1rem",
  },
};


export default LoadingScreen;

