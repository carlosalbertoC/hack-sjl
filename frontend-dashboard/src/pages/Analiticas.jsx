import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { fetchStats } from '../api';
import styles from './Analiticas.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analiticas = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await fetchStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarReporte = (tipo) => {
    alert(`Generando reporte PDF: ${tipo}...`);
  };

  if (loading || !stats) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando analíticas...</div>
      </div>
    );
  }

  // Configuración de gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e0e0e0',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#b0b0b0',
        },
        grid: {
          color: '#2a2a3e',
        },
      },
      x: {
        ticks: {
          color: '#b0b0b0',
        },
        grid: {
          color: '#2a2a3e',
        },
      },
    },
  };

  const barData = {
    labels: stats.topZonasRiesgo.map(z => z.zona),
    datasets: [
      {
        label: '# incidentes (últimos 30 días)',
        data: stats.topZonasRiesgo.map(z => z.incidentes_30d),
        backgroundColor: [
          'rgba(255, 107, 107, 0.8)',
          'rgba(255, 170, 0, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(74, 158, 255, 0.8)',
          'rgba(108, 99, 255, 0.8)',
        ],
        borderColor: [
          '#ff6b6b',
          '#ffaa00',
          '#ffce56',
          '#4a9eff',
          '#6c63ff',
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieData = {
    labels: stats.reportesPorCategoria.map(c => c.categoria),
    datasets: [
      {
        data: stats.reportesPorCategoria.map(c => c.cantidad),
        backgroundColor: [
          'rgba(255, 107, 107, 0.8)',
          'rgba(255, 170, 0, 0.8)',
          'rgba(74, 158, 255, 0.8)',
          'rgba(108, 99, 255, 0.8)',
        ],
        borderColor: [
          '#ff6b6b',
          '#ffaa00',
          '#4a9eff',
          '#6c63ff',
        ],
        borderWidth: 2,
      },
    ],
  };

  const lineData = {
    labels: stats.incidentesUltimos7Dias.map(d => d.dia),
    datasets: [
      {
        label: 'Incidentes',
        data: stats.incidentesUltimos7Dias.map(d => d.cantidad),
        borderColor: '#4a9eff',
        backgroundColor: 'rgba(74, 158, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Analíticas y Reportes</h1>
        <p className={styles.subtitle}>Tendencias y visualización de datos</p>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Top 10 zonas por número de incidentes (últimos 30 días)</h3>
          <div className={styles.chartContainer}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Reportes por Categoría</h3>
          <div className={styles.chartContainer}>
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Incidentes en los Últimos 7 Días</h3>
          <div className={styles.chartContainer}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className={styles.reportesSection}>
        <h2 className={styles.reportesTitle}>Exportar Reportes Oficiales</h2>
        <div className={styles.reportesButtons}>
          <button
            className={styles.reporteButton}
            onClick={() => handleDescargarReporte('ANEXO 01 - Producción Diaria')}
          >
            📄 Descargar ANEXO 01 - Producción Diaria (PDF)
          </button>
          <button
            className={styles.reporteButton}
            onClick={() => handleDescargarReporte('ANEXO 02 - Incidencias Delictivas')}
          >
            📄 Descargar ANEXO 02 - Incidencias Delictivas (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analiticas;

