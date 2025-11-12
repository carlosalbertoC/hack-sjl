import React, { useState, useEffect } from 'react';
import { analyzeRiskCorrelations } from '../../services/analytics';
import { getCategory } from '../../constants/categories';

const RiskManager = () => {
  const [correlations, setCorrelations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCorrelations();
  }, []);

  const loadCorrelations = async () => {
    setLoading(true);
    try {
      const data = await analyzeRiskCorrelations();
      setCorrelations(data);
    } catch (error) {
      console.error('Error analizando correlaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCorrelationColor = (correlation) => {
    if (correlation === 'ALTA') return '#e53935';
    if (correlation === 'MEDIA') return '#ff9800';
    return '#4caf50';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Gestor de Riesgos</h2>
        <button onClick={loadCorrelations} style={styles.refreshBtn} disabled={loading}>
          {loading ? '⏳ Analizando...' : '🔄 Reanalizar'}
        </button>
      </div>

      <div style={styles.description}>
        <p>
          Este módulo identifica puntos de riesgo (postes sin luz, parques abandonados, basura) 
          que están directamente asociados con incidentes de seguridad. 
          <strong> Arreglar estos puntos puede prevenir el crimen.</strong>
        </p>
      </div>

      {loading ? (
        <div style={styles.loading}>Analizando correlaciones causa-efecto...</div>
      ) : correlations.length === 0 ? (
        <div style={styles.empty}>
          No se encontraron correlaciones significativas entre riesgos e incidentes.
        </div>
      ) : (
        <div style={styles.correlationsList}>
          {correlations.map((correlation) => (
            <div key={correlation.id} style={styles.correlationCard}>
              <div style={styles.cardHeader}>
                <div style={styles.riskType}>
                  <span style={styles.riskIcon}>🔵</span>
                  <strong>{correlation.riskReport.categoryLabel}</strong>
                </div>
                <div style={styles.correlationBadge}>
                  <span style={{ 
                    ...styles.correlationLabel, 
                    color: getCorrelationColor(correlation.correlation) 
                  }}>
                    {correlation.correlation} CORRELACIÓN
                  </span>
                  <span style={styles.incidentCount}>
                    {correlation.incidentCount} incidentes asociados
                  </span>
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.location}>
                  <strong>📍 Ubicación:</strong>
                  <p style={styles.coords}>
                    {correlation.riskReport.lat.toFixed(4)}, {correlation.riskReport.lng.toFixed(4)}
                  </p>
                  {correlation.riskReport.comment && (
                    <p style={styles.comment}>"{correlation.riskReport.comment}"</p>
                  )}
                </div>

                <div style={styles.incidentsSection}>
                  <strong>📊 Incidentes en un radio de 100m (últimos 30 días):</strong>
                  <div style={styles.incidentsGrid}>
                    {correlation.incidents.slice(0, 5).map((incident, i) => {
                      const category = getCategory(incident.category);
                      return (
                        <div key={i} style={styles.incidentBadge}>
                          {category?.label || incident.category}
                        </div>
                      );
                    })}
                    {correlation.incidents.length > 5 && (
                      <div style={styles.moreBadge}>
                        +{correlation.incidents.length - 5} más
                      </div>
                    )}
                  </div>
                </div>

                <div style={styles.recommendation}>
                  <strong>💡 Recomendación:</strong>
                  <p style={styles.recommendationText}>{correlation.recommendation}</p>
                </div>

                <div style={styles.impactBox}>
                  <div style={styles.impactValue}>{correlation.incidentCount}</div>
                  <div style={styles.impactLabel}>
                    incidentes que podrían reducirse al intervenir este punto
                  </div>
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
  refreshBtn: {
    padding: '6px 12px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 14,
  },
  description: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 1.6,
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
  correlationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  correlationCard: {
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  cardHeader: {
    backgroundColor: '#1565c0',
    color: 'white',
    padding: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskType: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  riskIcon: {
    fontSize: 20,
  },
  correlationBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  correlationLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  incidentCount: {
    fontSize: 11,
    opacity: 0.9,
  },
  cardBody: {
    padding: 15,
  },
  location: {
    marginBottom: 15,
  },
  coords: {
    fontSize: 12,
    color: '#666',
    margin: '4px 0',
  },
  comment: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#555',
    marginTop: 4,
  },
  incidentsSection: {
    marginBottom: 15,
  },
  incidentsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  incidentBadge: {
    padding: '4px 8px',
    backgroundColor: '#e53935',
    color: 'white',
    borderRadius: 4,
    fontSize: 11,
  },
  moreBadge: {
    padding: '4px 8px',
    backgroundColor: '#999',
    color: 'white',
    borderRadius: 4,
    fontSize: 11,
  },
  recommendation: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 6,
  },
  recommendationText: {
    margin: '8px 0 0 0',
    fontSize: 14,
    lineHeight: 1.6,
    color: '#333',
  },
  impactBox: {
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
    border: '2px solid #4caf50',
  },
  impactValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 8,
  },
  impactLabel: {
    fontSize: 13,
    color: '#666',
  },
};

export default RiskManager;

