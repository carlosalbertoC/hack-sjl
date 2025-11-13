import styles from './FeedVivo.module.css';

const FeedVivo = ({ reportes }) => {
  const enjambres = reportes.filter(r => r.enjambre);
  const reportesRegulares = reportes.slice(0, 20).reverse(); // Últimos 20, más nuevo arriba

  const getIcono = (categoria) => {
    if (categoria === 'ROBO') return '🔴';
    if (categoria === 'ASALTO') return '🟡';
    return '🔵';
  };

  return (
    <div className={styles.feedContainer}>
      {enjambres.length > 0 && (
        <div className={styles.alertasCriticas}>
          <h3 className={styles.alertasTitle}>⚠️ Alertas Críticas</h3>
          <div className={styles.enjambresList}>
            {enjambres.map((reporte) => (
              <div key={reporte.id} className={styles.enjambreCard}>
                <div className={styles.enjambreHeader}>
                  <span className={styles.enjambreIcon}>🔥</span>
                  <span className={styles.enjambreZona}>{reporte.zona}</span>
                </div>
                <div className={styles.enjambreInfo}>
                  <span className={styles.enjambreCategoria}>{reporte.categoria}</span>
                  <span className={styles.enjambreTime}>{reporte.timestamp}</span>
                </div>
                <p className={styles.enjambreDesc}>{reporte.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={styles.feedRegular}>
        <h3 className={styles.feedTitle}>Cronología Operativa</h3>
        <ul className={styles.feedList}>
          {reportesRegulares.map((reporte) => (
            <li key={reporte.id} className={styles.feedItem}>
              <div className={styles.feedItemHeader}>
                <span className={styles.feedIcon}>{getIcono(reporte.categoria)}</span>
                <span className={styles.feedTime}>{reporte.timestamp}</span>
                <span className={styles.feedCategoria}>{reporte.categoria}</span>
                <span className={styles.feedZona}>{reporte.zona}</span>
              </div>
              <p className={styles.feedDesc}>{reporte.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeedVivo;

