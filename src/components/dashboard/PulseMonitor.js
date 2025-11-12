import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import { FaExclamationTriangle } from 'react-icons/fa';
import { detectCriticalAlerts } from '../../services/analytics';
import { fetchReports } from '../../services/api';
import { getCategory } from '../../constants/categories';

const containerStyle = { width: '100%', height: '400px' };
const DEFAULT_CENTER = { lat: -12.0553, lng: -76.9468 };

const PulseMonitor = () => {
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Actualizar cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [reportsData, alertsData] = await Promise.all([
        fetchReports({ sinceISO: new Date(Date.now() - 5 * 60 * 1000).toISOString() }),
        detectCriticalAlerts()
      ]);
      
      setReports(reportsData);
      setAlerts(alertsData);
      setLoading(false);

      // Reproducir sonido si hay nuevas alertas críticas
      if (alertsData.length > 0 && soundEnabled) {
        playAlertSound();
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  };

  const playAlertSound = () => {
    // Crear un sonido de alerta simple
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const getCustomIcon = (categoryId) => {
    if (!window.google) return undefined;
    const category = getCategory(categoryId);
    if (!category) return undefined;
    
    // Usar un icono simple basado en el color
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: category.color,
      fillOpacity: 0.8,
      strokeColor: '#fff',
      strokeWeight: 2,
      scale: 8,
    };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Monitor de Pulso</h2>
        <div style={styles.controls}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              style={styles.checkbox}
            />
            Sonido de alertas
          </label>
          <button onClick={loadData} style={styles.refreshBtn}>
            🔄 Actualizar
          </button>
        </div>
      </div>

      {alerts.length > 0 && (
        <div style={styles.alertsContainer}>
          {alerts.map(alert => (
            <div key={alert.id} style={styles.alertCard}>
              <FaExclamationTriangle color="#e53935" size={24} />
              <div style={styles.alertContent}>
                <strong>ALERTA CRÍTICA</strong>
                <p>{alert.count} reportes de alta prioridad en un radio de 200m</p>
                <small>{new Date(alert.timestamp).toLocaleTimeString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={styles.mapContainer}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={DEFAULT_CENTER}
            zoom={14}
          >
            {/* Reportes normales */}
            {reports.map(report => (
              <Marker
                key={report.id}
                position={{ lat: report.lat, lng: report.lng }}
                icon={getCustomIcon(report.category)}
              />
            ))}

            {/* Alertas críticas con círculo */}
            {alerts.map(alert => (
              <React.Fragment key={alert.id}>
                <Marker
                  position={alert.center}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="18" fill="#e53935" opacity="0.8"/><text x="20" y="25" text-anchor="middle" fill="white" font-size="16" font-weight="bold">!</text></svg>'
                    ),
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                />
                <Circle
                  center={alert.center}
                  radius={200}
                  options={{
                    fillColor: '#e53935',
                    fillOpacity: 0.2,
                    strokeColor: '#e53935',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                  }}
                />
              </React.Fragment>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{reports.length}</div>
          <div style={styles.statLabel}>Reportes (últimos 5 min)</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#e53935' }}>{alerts.length}</div>
          <div style={styles.statLabel}>Alertas Críticas</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    margin: 0,
    color: '#1976d2',
    fontSize: 20,
  },
  controls: {
    display: 'flex',
    gap: 15,
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 14,
  },
  checkbox: {
    cursor: 'pointer',
  },
  refreshBtn: {
    padding: '6px 12px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 14,
  },
  alertsContainer: {
    marginBottom: 15,
  },
  alertCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 6,
    marginBottom: 8,
    borderLeft: '4px solid #e53935',
    animation: 'pulse 2s infinite',
  },
  alertContent: {
    flex: 1,
  },
  mapContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },
  stats: {
    display: 'flex',
    gap: 15,
  },
  statCard: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
};

export default PulseMonitor;

