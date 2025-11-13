import styles from './DirectivaCard.module.css';

const DirectivaCard = ({ directiva }) => {
  const getBadgeStyle = (prioridad) => {
    switch (prioridad) {
      case 'ALTA':
        return {
          label: 'Alerta Crítica',
          style: {
            background: 'rgba(255, 107, 129, 0.15)',
            color: '#ff9aa9',
            border: '1px solid rgba(255, 107, 129, 0.4)',
          },
        };
      case 'MEDIA':
        return {
          label: 'Atención Prioritaria',
          style: {
            background: 'rgba(255, 196, 107, 0.15)',
            color: '#ffd79a',
            border: '1px solid rgba(255, 196, 107, 0.4)',
          },
        };
      default:
        return {
          label: 'Cobertura Preventiva',
          style: {
            background: 'rgba(91, 124, 255, 0.18)',
            color: '#9fb2ff',
            border: '1px solid rgba(91, 124, 255, 0.35)',
          },
        };
    }
  };

  const badge = getBadgeStyle(directiva.prioridad);

  const handleVerMapa = () => {
    alert('Funcionalidad de mapa próximamente disponible');
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.titulo}>Directiva táctica #{directiva.id}</h3>
        <span className={styles.badge} style={badge.style}>
          {badge.label}
        </span>
      </div>
      
      <div className={styles.content}>
        <div className={styles.field}>
          <span className={styles.label}>ZONA:</span>
          <span className={styles.value}>{directiva.zona}</span>
        </div>
        
        <div className={styles.field}>
          <span className={styles.label}>AMENAZA PRINCIPAL:</span>
          <span className={styles.value}>{directiva.amenaza}</span>
        </div>
        
        <div className={styles.field}>
          <span className={styles.label}>Score Operativo:</span>
          <span className={styles.score}>{directiva.puntaje_riesgo}</span>
        </div>
        
        <div className={styles.field}>
          <span className={styles.label}>HORAS CRÍTICAS:</span>
          <span className={styles.value}>{directiva.horas_pico.join(', ')}</span>
        </div>
        
        <div className={styles.field}>
          <span className={styles.label}>TÁCTICA SUGERIDA:</span>
          <p className={styles.tactica}>{directiva.tactica_sugerida}</p>
        </div>
      </div>
      
      <div className={styles.footer}>
        <button 
          className={styles.button}
          onClick={handleVerMapa}
          type="button"
        >
          Ver reportes en mapa →
        </button>
      </div>
    </div>
  );
};

export default DirectivaCard;

