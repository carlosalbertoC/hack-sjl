import { useState, useEffect } from 'react';
import FeedVivo from '../components/FeedVivo.jsx';
import { fetchLiveReports } from '../api';
import styles from './Monitor.module.css';
import MapaMonitorGoogle from '../components/MapaMonitorGoogle.jsx';

const Monitor = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReportes = async () => {
      try {
        const response = await fetchLiveReports();
        setReportes(response.data);
      } catch (error) {
        console.error('Error al cargar reportes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportes();
    // Actualizar cada 30 segundos
    const interval = setInterval(loadReportes, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando reportes...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Monitor de Pulso en Vivo</h1>
        <p className={styles.subtitle}>Visualización táctica de incidentes y enjambres activos</p>
      </div>
      <div className={styles.content}>
        <section className={styles.mapSection}>
          <p className={styles.sectionTitle}>Situación Geoespacial</p>
          <MapaMonitorGoogle reportes={reportes} />
        </section>
        <section className={styles.feedSection}>
          <p className={styles.sectionTitle}>Mensajes Prioritarios</p>
          <FeedVivo reportes={reportes} />
        </section>
      </div>
    </div>
  );
};

export default Monitor;

