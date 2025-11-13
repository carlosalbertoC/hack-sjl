import { NavLink, Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>
          SJL Conecta
          <span>Centro de Control</span>
        </h2>
      </div>
      <nav className={styles.nav}>
        <NavLink 
          to="/dashboard/monitor" 
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>📡</span>
          <span>Monitor en Vivo</span>
        </NavLink>
        <NavLink 
          to="/dashboard/planificador" 
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>📋</span>
          <span>Plan de Patrullaje</span>
        </NavLink>
        <NavLink 
          to="/dashboard/riesgos" 
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>⚠️</span>
          <span>Gestor de Riesgos</span>
        </NavLink>
        <NavLink 
          to="/dashboard/analiticas" 
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>📊</span>
          <span>Analíticas y Reportes</span>
        </NavLink>
      </nav>
      <div className={styles.footer}>
        <Link to="/" className={styles.logoutButton}>
          <span className={styles.icon}>🚪</span>
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

