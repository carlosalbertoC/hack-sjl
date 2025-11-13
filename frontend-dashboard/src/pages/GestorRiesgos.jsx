import { useState, useEffect } from 'react';
import { fetchMatrizRiesgos } from '../api';
import styles from './GestorRiesgos.module.css';

const GestorRiesgos = () => {
  const [riesgos, setRiesgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRiesgos();
  }, []);

  const loadRiesgos = async () => {
    setLoading(true);
    try {
      const response = await fetchMatrizRiesgos();
      setRiesgos(response.data);
    } catch (error) {
      console.error('Error al cargar riesgos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAsignar = (id) => {
    alert(`Asignando riesgo #${id}...`);
  };

  const getPrioridadClass = (prioridad) => {
    if (prioridad === 'ALTA') return styles.prioridadAlta;
    if (prioridad === 'MEDIA') return styles.prioridadMedia;
    return styles.prioridadBaja;
  };

  const getEstadoClass = (estado) => {
    if (estado === 'Pendiente') return styles.estadoPendiente;
    if (estado === 'En proceso') return styles.estadoProceso;
    return styles.estadoResuelto;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando matriz de riesgos...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestor de Riesgos Estratégicos</h1>
        <p className={styles.subtitle}>Matriz Causa-Efecto para estrategia</p>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Prioridad</th>
              <th>Problema de Infraestructura</th>
              <th>Ubicación</th>
              <th>Delitos Asociados</th>
              <th>Jurisdicción</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {riesgos.map((riesgo) => (
              <tr key={riesgo.id}>
                <td>
                  <span className={`${styles.prioridad} ${getPrioridadClass(riesgo.prioridad)}`}>
                    {riesgo.prioridad}
                  </span>
                </td>
                <td>{riesgo.problema}</td>
                <td>{riesgo.ubicacion}</td>
                <td className={styles.delitos}>{riesgo.delitos_asociados}</td>
                <td>{riesgo.jurisdiccion}</td>
                <td>
                  <span className={`${styles.estado} ${getEstadoClass(riesgo.estado)}`}>
                    {riesgo.estado}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.buttonAsignar}
                    onClick={() => handleAsignar(riesgo.id)}
                  >
                    Asignar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestorRiesgos;

