import { fetchReports } from './api';
import { CATEGORIES } from '../constants/categories';

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (v) => v * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + 
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2)**2;
  const d = 2 * R * Math.asin(Math.sqrt(a));
  return d;
}

export async function detectCriticalAlerts() {
  const now = Date.now();
  const fiveMinutesAgo = new Date(now - 5 * 60 * 1000).toISOString();
  
  const allReports = await fetchReports({ sinceISO: fiveMinutesAgo });
  const highPriorityReports = allReports.filter(r => {
    const category = CATEGORIES[r.category];
    return category && category.priority >= 10;
  });

  const alerts = [];
  const processed = new Set();

  for (let i = 0; i < highPriorityReports.length; i++) {
    if (processed.has(highPriorityReports[i].id)) continue;

    const cluster = [highPriorityReports[i]];
    processed.add(highPriorityReports[i].id);

    for (let j = i + 1; j < highPriorityReports.length; j++) {
      if (processed.has(highPriorityReports[j].id)) continue;

      const distance = calculateDistance(
        highPriorityReports[i].lat,
        highPriorityReports[i].lng,
        highPriorityReports[j].lat,
        highPriorityReports[j].lng
      );

      if (distance <= 200) {
        cluster.push(highPriorityReports[j]);
        processed.add(highPriorityReports[j].id);
      }
    }

    if (cluster.length >= 3) {
      const centerLat = cluster.reduce((sum, r) => sum + r.lat, 0) / cluster.length;
      const centerLng = cluster.reduce((sum, r) => sum + r.lng, 0) / cluster.length;
      
      alerts.push({
        id: `alert_${Date.now()}_${i}`,
        type: 'critical',
        center: { lat: centerLat, lng: centerLng },
        reports: cluster,
        count: cluster.length,
        timestamp: new Date().toISOString(),
        categories: [...new Set(cluster.map(r => r.category))],
      });
    }
  }

  return alerts;
}

export async function generatePatrolDirectives(shiftStart, shiftEnd) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const allReports = await fetchReports({ sinceISO: sevenDaysAgo });

  const shiftReports = allReports.filter(report => {
    const reportHour = new Date(report.created_at).getHours();
    if (shiftEnd < shiftStart) {
      return reportHour >= shiftStart || reportHour < shiftEnd;
    }
    return reportHour >= shiftStart && reportHour < shiftEnd;
  });

  const zones = {};
  const gridSize = 0.01;

  shiftReports.forEach(report => {
    const zoneKey = `${Math.floor(report.lat / gridSize)}_${Math.floor(report.lng / gridSize)}`;
    
    if (!zones[zoneKey]) {
      zones[zoneKey] = {
        reports: [],
        center: { lat: 0, lng: 0 },
        categories: {},
      };
    }
    
    zones[zoneKey].reports.push(report);
    zones[zoneKey].categories[report.category] = (zones[zoneKey].categories[report.category] || 0) + 1;
  });

  const directives = Object.entries(zones)
    .map(([key, zone]) => {
      const centerLat = zone.reports.reduce((sum, r) => sum + r.lat, 0) / zone.reports.length;
      const centerLng = zone.reports.reduce((sum, r) => sum + r.lng, 0) / zone.reports.length;
      
      let riskScore = 0;
      zone.reports.forEach(report => {
        const category = CATEGORIES[report.category];
        if (category) {
          riskScore += category.priority;
        }
      });

      const hourCounts = {};
      zone.reports.forEach(report => {
        const hour = new Date(report.created_at).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
      const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || shiftStart;
      const peakEnd = parseInt(peakHour) + 2;

      const threats = Object.entries(zone.categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([catId, count]) => ({
          category: CATEGORIES[catId]?.label || catId,
          count,
        }));

      return {
        id: key,
        zone: `Zona ${key.substring(0, 6)}`,
        center: { lat: centerLat, lng: centerLng },
        riskScore,
        reportCount: zone.reports.length,
        threats,
        peakHours: `${peakHour}:00 - ${peakEnd}:00`,
        suggestedTactic: riskScore >= 50 ? 'Patrullaje a pie (disuasivo)' : 'Patrullaje vehicular',
        priority: riskScore >= 50 ? 'ALTA' : riskScore >= 30 ? 'MEDIA' : 'BAJA',
      };
    })
    .filter(d => d.reportCount >= 3)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10);

  return directives;
}

export async function analyzeRiskCorrelations() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
  const allReports = await fetchReports({ sinceISO: thirtyDaysAgo });

  const riskReports = allReports.filter(r => {
    const cat = CATEGORIES[r.category];
    return cat && cat.group === 'riesgo';
  });

  const incidentReports = allReports.filter(r => {
    const cat = CATEGORIES[r.category];
    return cat && cat.group === 'incidente';
  });

  const correlations = [];

  riskReports.forEach(riskReport => {
    const nearbyIncidents = incidentReports.filter(incident => {
      const distance = calculateDistance(
        riskReport.lat,
        riskReport.lng,
        incident.lat,
        incident.lng
      );
      return distance <= 100;
    });

    if (nearbyIncidents.length >= 3) {
      const category = CATEGORIES[riskReport.category];
      correlations.push({
        id: `correlation_${riskReport.id}`,
        riskReport: {
          ...riskReport,
          categoryLabel: category?.label || riskReport.category,
        },
        incidentCount: nearbyIncidents.length,
        incidents: nearbyIncidents,
        correlation: nearbyIncidents.length >= 10 ? 'ALTA' : nearbyIncidents.length >= 5 ? 'MEDIA' : 'BAJA',
        recommendation: generateRecommendation(riskReport.category, nearbyIncidents.length),
      });
    }
  });

  return correlations.sort((a, b) => b.incidentCount - a.incidentCount);
}

function generateRecommendation(riskCategory, incidentCount) {
  if (riskCategory === 'poste_sin_luz') {
    return `Arreglar este poste puede reducir hasta ${incidentCount} incidentes. Es una acción directa de seguridad.`;
  } else if (riskCategory === 'parque_abandonado') {
    return `Rehabilitar este parque puede reducir hasta ${incidentCount} incidentes. Espacios públicos seguros disuaden el crimen.`;
  } else if (riskCategory === 'basura_peligrosa') {
    return `Limpiar esta zona puede reducir hasta ${incidentCount} incidentes. La limpieza mejora la percepción de seguridad.`;
  }
  return `Intervenir en este punto de riesgo puede reducir significativamente los incidentes.`;
}

