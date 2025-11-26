import { useState, useEffect } from 'react';
import { fetchMatrizRiesgos } from '../api';
import styles from './GestorRiesgos.module.css';

const GestorRiesgos = () => {
  const [riesgos, setRiesgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [direcciones, setDirecciones] = useState({});

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

  useEffect(() => {
    const geocodeZonas = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn("Falta VITE_GOOGLE_MAPS_API_KEY");
        return;
      }

      const nuevasDirecciones = {};

      // Para no matar la cuota, si tienes pocas zonas, puedes geocodificar todas.
      // Si tuvieses muchas, podrías limitar a las top 20, por ejemplo.
      for (const zona of riesgos) {
        // si ya teníamos esta dirección, la dejamos
        if (direcciones[zona.id]) {
          nuevasDirecciones[zona.id] = direcciones[zona.id];
          continue;
        }

        if (
          typeof zona.centroidLat !== 'number' ||
          typeof zona.centroidLng !== 'number'
        ) {
          continue;
        }

        try {
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${zona.centroidLat},${zona.centroidLng}&key=${apiKey}`;
          const resp = await fetch(url);
          const data = await resp.json();

          const dir =
            data.results?.[0]?.formatted_address ||
            `(${zona.centroidLat.toFixed(3)}, ${zona.centroidLng.toFixed(3)})`;

          nuevasDirecciones[zona.id] = dir;

          // pequeño delay opcional para no spamear
          // await new Promise((r) => setTimeout(r, 150));
        } catch (e) {
          console.error("Error geocodificando zona", zona.id, e);
        }
      }

      if (Object.keys(nuevasDirecciones).length > 0) {
        setDirecciones((prev) => ({ ...prev, ...nuevasDirecciones }));
      }
    };

    if (riesgos.length > 0) {
      geocodeZonas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riesgos]); // dependemos sólo de riesgos

  const handleAsignar = (id) => {
    alert(`Asignando zona crítica #${id}...`);
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
        <p className={styles.subtitle}>
          Zonas más peligrosas (dirección aproximada a partir de coordenadas)
        </p>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Prioridad</th>
              <th>Zona crítica (dirección aprox.)</th>
              <th>Tipo de delito dominante</th>
              <th># incidentes últimos 30 días</th>
              <th>Franja horaria más frecuente</th>
              <th>Jurisdicción</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {riesgos.map((zona) => {
              const dir = direcciones[zona.id];
              const coordText = `(${zona.centroidLat?.toFixed(3)}, ${zona.centroidLng?.toFixed(3)})`;

              return (
                <tr key={zona.id}>
                  <td>
                    <span
                      className={`${styles.prioridad} ${getPrioridadClass(
                        zona.prioridad
                      )}`}
                    >
                      {zona.prioridad}
                    </span>
                  </td>
                  <td>
                    {/* Dirección si ya la tenemos, si no, mostramos al menos las coords */}
                    {dir
                      ? `${dir} ${coordText}`
                      : `Zona aproximada ${coordText}`}
                  </td>
                  <td>{zona.tipo_delito_dominante}</td>
                  <td>{zona.incidentes_30d}</td>
                  <td>{zona.franja_frecuente}</td>
                  <td>{zona.jurisdiccion}</td>
                  <td>
                    <span
                      className={`${styles.estado} ${getEstadoClass(zona.estado)}`}
                    >
                      {zona.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.buttonAsignar}
                      onClick={() => handleAsignar(zona.id)}
                    >
                      Asignar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestorRiesgos;

