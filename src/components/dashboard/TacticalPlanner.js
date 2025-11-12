import React, { useState, useEffect } from 'react';
import { generatePatrolDirectives } from '../../services/analytics';

const SHIFTS = [
  { id: 'morning', label: 'Mañana', start: 6, end: 14 },
  { id: 'afternoon', label: 'Tarde', start: 14, end: 22 },
  { id: 'night', label: 'Noche', start: 22, end: 6 },
];

const TacticalPlanner = () => {
  const [selectedShift, setSelectedShift] = useState(SHIFTS[1]); // Tarde por defecto
  const [directives, setDirectives] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDirectives();
  }, [selectedShift]);

  const loadDirectives = async () => {
    setLoading(true);
    try {
      const data = await generatePatrolDirectives(selectedShift.start, selectedShift.end);
      setDirectives(data);
    } catch (error) {
      console.error('Error generando directivas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'ALTA') return '#e53935';
    if (priority === 'MEDIA') return '#ff9800';
    return '#4caf50';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Planificador Táctico</h2>
        <div style={styles.shiftSelector}>
          <label style={styles.label}>Turno:</label>
          <select
            value={selectedShift.id}
            onChange={(e) => {
              const shift = SHIFTS.find(s => s.id === e.target.value);
              setSelectedShift(shift);
            }}
            style={styles.select}
          >
            {SHIFTS.map(shift => (
              <option key={shift.id} value={shift.id}>
                {shift.label} ({shift.start}:00 - {shift.end}:00)
              </option>
            ))}
          </select>
          <button onClick={loadDirectives} style={styles.refreshBtn} disabled={loading}>
            {loading ? '⏳ Generando...' : '🔄 Regenerar'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Generando directivas de patrullaje...</div>
      ) : directives.length === 0 ? (
        <div style={styles.empty}>
          No hay suficientes datos para generar directivas para este turno.
        </div>
      ) : (
        <div style={styles.directivesGrid}>
          {directives.map((directive, index) => (
            <div key={directive.id} style={styles.directiveCard}>
              <div style={styles.cardHeader}>
                <div style={styles.priorityBadge}>
                  <span style={{ ...styles.priorityLabel, color: getPriorityColor(directive.priority) }}>
                    {directive.priority}
                  </span>
                </div>
                <div style={styles.zoneName}>ZONA #{index + 1}</div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.section}>
                  <strong>📍 Ubicación:</strong>
                  <p style={styles.value}>{directive.zone}</p>
                  <small style={styles.coords}>
                    {directive.center.lat.toFixed(4)}, {directive.center.lng.toFixed(4)}
                  </small>
                </div>

                <div style={styles.section}>
                  <strong>⚠️ Amenazas:</strong>
                  <ul style={styles.threatsList}>
                    {directive.threats.map((threat, i) => (
                      <li key={i}>
                        {threat.category}: <strong>{threat.count} reportes</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={styles.section}>
                  <strong>📊 Estadísticas:</strong>
                  <div style={styles.statsRow}>
                    <span>Total reportes: <strong>{directive.reportCount}</strong></span>
                    <span>Puntaje riesgo: <strong>{directive.riskScore}</strong></span>
                  </div>
                </div>

                <div style={styles.section}>
                  <strong>🕐 Hora Pico:</strong>
                  <p style={styles.value}>{directive.peakHours}</p>
                </div>

                <div style={styles.section}>
                  <strong>🎯 Táctica Sugerida:</strong>
                  <p style={{ ...styles.value, color: '#1976d2', fontWeight: 'bold' }}>
                    {directive.suggestedTactic}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
    marginBottom: 20,
  },
  title: {
    margin: '0 0 15px 0',
    color: '#1976d2',
    fontSize: 20,
  },
  shiftSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  select: {
    padding: '6px 12px',
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: 14,
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
  loading: {
    textAlign: 'center',
    padding: 40,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    padding: 40,
    color: '#999',
    fontStyle: 'italic',
  },
  directivesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 20,
  },
  directiveCard: {
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  cardHeader: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    backgroundColor: 'white',
    padding: '4px 8px',
    borderRadius: 4,
  },
  priorityLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  zoneName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 15,
  },
  section: {
    marginBottom: 15,
  },
  value: {
    margin: '4px 0',
    fontSize: 14,
    color: '#333',
  },
  coords: {
    fontSize: 11,
    color: '#999',
  },
  threatsList: {
    margin: '8px 0',
    paddingLeft: 20,
    fontSize: 13,
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 8,
    fontSize: 13,
  },
};

export default TacticalPlanner;

