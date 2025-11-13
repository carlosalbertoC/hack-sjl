import { useState, useEffect } from 'react';
import DirectivaCard from '../components/DirectivaCard.jsx';
import { fetchDirectivas } from '../api';
import styles from './Planificador.module.css';

const Planificador = () => {
  const [turnoSeleccionado, setTurnoSeleccionado] = useState('tarde');
  const [directivas, setDirectivas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDirectivas();
  }, [turnoSeleccionado]);

  const loadDirectivas = async () => {
    setLoading(true);
    try {
      const response = await fetchDirectivas(turnoSeleccionado);
      setDirectivas(response.data);
    } catch (error) {
      console.error('Error al cargar directivas:', error);
    } finally {
      setLoading(false);
    }
  };

  const turnos = [
    { id: 'mañana', label: 'Turno Mañana', horario: '07-15' },
    { id: 'tarde', label: 'Turno Tarde', horario: '15-23' },
    { id: 'noche', label: 'Turno Noche', horario: '23-07' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Planificador Táctico</h1>
        <p className={styles.subtitle}>Generador de directivas operativas</p>
      </div>
      
      <div className={styles.controles}>
        <div className={styles.turnoButtons}>
          {turnos.map((turno) => (
            <button
              key={turno.id}
              onClick={() => setTurnoSeleccionado(turno.id)}
              className={`${styles.turnoButton} ${
                turnoSeleccionado === turno.id ? styles.active : ''
              }`}
            >
              <span className={styles.turnoLabel}>{turno.label}</span>
              <span className={styles.turnoHorario}>({turno.horario})</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.directivasTitle}>
          Directivas Sugeridas para el Turno {turnos.find(t => t.id === turnoSeleccionado)?.label}
        </h2>
        
        {loading ? (
          <div className={styles.loading}>Cargando directivas...</div>
        ) : (
          <div className={styles.directivasGrid}>
            {directivas.map((directiva) => (
              <DirectivaCard key={directiva.id} directiva={directiva} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Planificador;

