import React, { useEffect } from "react";

const LoadingScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={styles.overlay}>
      <h1 style={styles.text}>Hack SJL</h1>
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
    height: "100vh",
    backgroundColor: "#1976d2",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
    zIndex: 9999,
  },
  text: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: 10,
  },
  sub: {
    fontSize: "1rem",
  },
};

export default LoadingScreen;

