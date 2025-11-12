import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PulseMonitor from "../components/dashboard/PulseMonitor";
import TacticalPlanner from "../components/dashboard/TacticalPlanner";
import RiskManager from "../components/dashboard/RiskManager";

const MODULES = [
  { id: 'pulse', label: 'Monitor de Pulso', icon: '📊' },
  { id: 'tactical', label: 'Planificador Táctico', icon: '🎯' },
  { id: 'risk', label: 'Gestor de Riesgos', icon: '⚠️' },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('pulse');

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard de Mando Centralizado</h1>
          <p style={styles.subtitle}>Inteligencia Táctica y Estratégica para SJL</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </div>

      <div style={styles.navTabs}>
        {MODULES.map(module => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            style={{
              ...styles.tab,
              ...(activeModule === module.id ? styles.tabActive : {}),
            }}
          >
            <span style={styles.tabIcon}>{module.icon}</span>
            {module.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {activeModule === 'pulse' && <PulseMonitor />}
        {activeModule === 'tactical' && <TacticalPlanner />}
        {activeModule === 'risk' && <RiskManager />}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "20px 30px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutBtn: {
    border: "none",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  },
  title: {
    margin: "10px 0",
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    margin: "5px 0 0 0",
    fontSize: 14,
    opacity: 0.9,
  },
  navTabs: {
    display: "flex",
    backgroundColor: "white",
    borderBottom: "2px solid #e0e0e0",
    padding: "0 30px",
    gap: 0,
  },
  tab: {
    border: "none",
    background: "transparent",
    padding: "15px 25px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    borderBottom: "3px solid transparent",
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "all 0.2s",
  },
  tabActive: {
    color: "#1976d2",
    borderBottomColor: "#1976d2",
    backgroundColor: "#f5f5f5",
  },
  tabIcon: {
    fontSize: 18,
  },
  content: {
    padding: "30px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
};

export default DashboardPage;

