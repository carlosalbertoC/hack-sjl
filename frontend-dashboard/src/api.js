import axios from 'axios';
import { getCategory } from "./components/categories";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Faltan REACT_APP_SUPABASE_URL o REACT_APP_SUPABASE_ANON_KEY');
}

const supabaseApi = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  timeout: 8000,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  },
});


// Configuración base de axios (simulada)
const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// Datos mock para simulación

// Mock: Directivas por turno
const mockDirectivas = {
  mañana: [
    {
      id: 1,
      prioridad: 'ALTA',
      zona: 'Zárate',
      amenaza: 'Enjambre de robos (5 incidentes en 2 horas)',
      puntaje_riesgo: 8.5,
      horas_pico: ['07:00-09:00', '12:00-14:00'],
      tactica_sugerida: 'Refuerzo de patrullaje en intersecciones principales. Coordinación con serenazgo para puntos calientes identificados.'
    },
    {
      id: 2,
      prioridad: 'MEDIA',
      zona: 'Canto Rey',
      amenaza: 'Vandalismo recurrente en parques',
      puntaje_riesgo: 6.2,
      horas_pico: ['10:00-12:00'],
      tactica_sugerida: 'Patrullaje preventivo en áreas verdes. Vigilancia en horarios de mayor incidencia.'
    },
    {
      id: 3,
      prioridad: 'ALTA',
      zona: 'Mariscal Cáceres',
      amenaza: 'Asaltos a comerciantes en horario matutino',
      puntaje_riesgo: 7.8,
      horas_pico: ['08:00-10:00'],
      tactica_sugerida: 'Presencia policial en mercados y zonas comerciales. Coordinación con gremios de comerciantes.'
    }
  ],
  tarde: [
    {
      id: 4,
      prioridad: 'ALTA',
      zona: 'Zárate',
      amenaza: 'Enjambre de robos en transporte público',
      puntaje_riesgo: 9.1,
      horas_pico: ['15:00-17:00', '18:00-20:00'],
      tactica_sugerida: 'Operativo en paraderos y rutas de transporte. Refuerzo de vigilancia en horas pico de tráfico.'
    },
    {
      id: 5,
      prioridad: 'MEDIA',
      zona: 'Canto Rey',
      amenaza: 'Vandalismo en instituciones educativas',
      puntaje_riesgo: 5.8,
      horas_pico: ['15:00-16:00'],
      tactica_sugerida: 'Patrullaje en perímetros escolares durante salida de estudiantes.'
    },
    {
      id: 6,
      prioridad: 'ALTA',
      zona: 'Mariscal Cáceres',
      amenaza: 'Asaltos a taxistas y mototaxis',
      puntaje_riesgo: 8.3,
      horas_pico: ['17:00-19:00'],
      tactica_sugerida: 'Puntos de control en zonas de mayor tránsito de taxis. Coordinación con sindicatos de transportistas.'
    }
  ],
  noche: [
    {
      id: 7,
      prioridad: 'ALTA',
      zona: 'Zárate',
      amenaza: 'Enjambre de robos en vía pública',
      puntaje_riesgo: 9.5,
      horas_pico: ['23:00-01:00', '02:00-04:00'],
      tactica_sugerida: 'Refuerzo de patrullaje nocturno. Iluminación de emergencia en puntos críticos. Coordinación con serenazgo 24/7.'
    },
    {
      id: 8,
      prioridad: 'MEDIA',
      zona: 'Canto Rey',
      amenaza: 'Vandalismo y consumo de alcohol en espacios públicos',
      puntaje_riesgo: 6.5,
      horas_pico: ['23:00-02:00'],
      tactica_sugerida: 'Patrullaje en parques y plazas. Control de expendio de alcohol en horario prohibido.'
    },
    {
      id: 9,
      prioridad: 'ALTA',
      zona: 'Mariscal Cáceres',
      amenaza: 'Asaltos a establecimientos comerciales',
      puntaje_riesgo: 8.8,
      horas_pico: ['00:00-03:00'],
      tactica_sugerida: 'Rondas de seguridad en corredores comerciales. Coordinación con seguridad privada de locales.'
    }
  ]
};

const mapDbReportToLive = (r) => {
  let prioridad = "media";
  if (r.urgency === 3) prioridad = "alta";
  if (r.urgency === 1) prioridad = "baja";

  return {
    id: r.id,
    categoria: (r.category || "OTROS").toUpperCase(),
    descripcion: r.comment || "Sin descripción",
    zona: r.address || "Zona no especificada",
    lat: r.lat,
    lng: r.lng,

    // 👉 MUY IMPORTANTE: conservar fecha original
    created_at: r.created_at,

    // Opcional: si quieres un campo de hora para mostrar en otros lados
    timestamp: r.created_at
      ? new Date(r.created_at).toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",

    enjambre: false,
    prioridad,
  };
};

// Funciones de API (simuladas con datos mock)
export const fetchLiveReports = async () => {
  // Simular delay de red
  const now = new Date();
  const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabaseApi.get('/reports', {
    params: {
      select: 'id,lat,lng,category,comment,address,created_at,urgency',
      order: 'created_at.desc',
      created_at: `gte.${from}`,
      limit: 200,
    },
  });

  const adaptados = (data || []).map(mapDbReportToLive);
  return { data: adaptados };
};

const CELL_LAT = 0.0025;
const CELL_LNG = 0.0025;

const getCellKey = (lat, lng) => {
  const cellX = Math.floor(lat / CELL_LAT);
  const cellY = Math.floor(lng / CELL_LNG);
  return `${cellX}|${cellY}`;
};

const getHourFromReport = (r) => {
  if (!r.created_at) return null;
  const d = new Date(r.created_at);
  if (isNaN(d.getTime())) return null;
  return d.getHours(); // 0..23
};

const getFranjaFromHour = (h) => {
  if (h === null || h === undefined) return null;
  if (h >= 0 && h < 6) return "madrugada";
  if (h >= 6 && h < 12) return "mañana";
  if (h >= 12 && h < 18) return "tarde";
  return "noche";
};

const getDominantKey = (counts) => {
  let bestKey = null;
  let bestValue = 0;
  for (const [key, value] of Object.entries(counts)) {
    if (value > bestValue) {
      bestValue = value;
      bestKey = key;
    }
  }
  return bestKey;
};

// 🔧 Construye las zonas críticas a partir de los reportes ya filtrados a 30 días
const buildCriticalZonesFromReports = (reports) => {
  const groups = new Map();

  for (const r of reports) {
    const lat = Number(r.lat);
    const lng = Number(r.lng);
    if (isNaN(lat) || isNaN(lng)) continue;

    const key = getCellKey(lat, lng);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        reports: [],
        sumLat: 0,
        sumLng: 0,
        count: 0,
        typeCounts: {
          delito: 0,
          conducta_sospechosa: 0,
          riesgo_entorno: 0,
        },
        franjaCounts: {
          madrugada: 0,
          mañana: 0,
          tarde: 0,
          noche: 0,
        },
      });
    }

    const g = groups.get(key);
    g.reports.push(r);
    g.sumLat += lat;
    g.sumLng += lng;
    g.count += 1;

    // categoria → type_general
    const rawCat =
      (r.category && r.category.toString().toLowerCase()) ||
      (r.categoria && r.categoria.toString().toLowerCase()) ||
      "";
    const cat = getCategory(rawCat);
    if (cat && cat.type_general && g.typeCounts[cat.type_general] !== undefined) {
      g.typeCounts[cat.type_general] += 1;
    }

    // franja horaria
    const h = getHourFromReport(r);
    const franja = getFranjaFromHour(h);
    if (franja && g.franjaCounts[franja] !== undefined) {
      g.franjaCounts[franja] += 1;
    }
  }

  // Pasamos de Map → array y calculamos centroides
  const cells = Array.from(groups.values()).map((g) => {
    const centroidLat = g.sumLat / g.count;
    const centroidLng = g.sumLng / g.count;

    const dominantType = getDominantKey(g.typeCounts) || "delito";
    const dominantFranja = getDominantKey(g.franjaCounts) || "tarde";

    return {
      key: g.key,
      count: g.count,
      centroidLat,
      centroidLng,
      dominantType,
      dominantFranja,
    };
  });

  // Ordenamos por número de incidentes
  cells.sort((a, b) => b.count - a.count);

  // Asignar prioridad según ranking:
  // top 10 → ALTA, siguientes 10 → MEDIA, resto → BAJA
  cells.forEach((cell, idx) => {
    let prioridad = "BAJA";
    if (idx < 10) prioridad = "ALTA";
    else if (idx < 20) prioridad = "MEDIA";
    cell.prioridad = prioridad;
  });

  // Construimos el shape final para la tabla
  const zonas = cells.map((cell, idx) => ({
    id: cell.key,
    prioridad: cell.prioridad, // ALTA / MEDIA / BAJA
    // 👇 estos dos son súper importantes para el front
    centroidLat: cell.centroidLat,
    centroidLng: cell.centroidLng,

    zona: `Zona ${idx + 1}`, // nombre corto, la dirección la resuelve el front
    tipo_delito_dominante:
      cell.dominantType === "delito"
        ? "Delitos / incidentes"
        : cell.dominantType === "conducta_sospechosa"
        ? "Conducta sospechosa"
        : "Riesgos del entorno",
    incidentes_30d: cell.count,
    franja_frecuente: cell.dominantFranja,
    jurisdiccion: "Por definir",
    estado: "Pendiente",
  }));

  return zonas;
};

// 🚀 Nueva versión de fetchMatrizRiesgos usando los reportes reales
export const fetchMatrizRiesgos = async () => {
  // 1) Traemos reportes de los últimos 30 días
  const { data: reports } = await fetchLiveReports();

  // 2) Construimos zonas críticas
  const zonas = buildCriticalZonesFromReports(reports);

  // 3) Simulamos delay (opcional) y devolvemos
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { data: zonas };
};

export const fetchDirectivas = async (turno) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const directivas = mockDirectivas[turno] || [];
  return { data: directivas };
};

// Tamaño de la celda en grados (ajusta si en GestorRiesgos usaste otro)
const CELL_SIZE_DEG = 0.01; // ~1.1 km en latitud

const getCellCenter = (cellKey) => {
  const [latStr, lngStr] = cellKey.split(',');
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  return {
    latCenter: lat + CELL_SIZE_DEG / 2,
    lngCenter: lng + CELL_SIZE_DEG / 2,
  };
};

export const fetchStats = async () => {
  const now = new Date();
  const from30 = new Date(
    now.getTime() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data } = await supabaseApi.get('/reports', {
    params: {
      select: 'id,lat,lng,category,created_at',
      order: 'created_at.desc',
      created_at: `gte.${from30}`,
      limit: 1000,
    },
  });

  const reports = (data || []).filter(
    (r) => r.lat != null && r.lng != null
  );

  // 1) Top zonas por nivel de riesgo (agrupando por celda)
  const zonasMap = new Map();

  for (const r of reports) {
    const cellKey = getCellKey(r.lat, r.lng);
    const existing = zonasMap.get(cellKey) || {
      cellKey,
      conteo: 0,
      categorias: {}, // para tipo de delito dominante si luego quieres
    };

    existing.conteo += 1;

    const cat = (r.category || 'OTROS').toUpperCase();
    existing.categorias[cat] = (existing.categorias[cat] || 0) + 1;

    zonasMap.set(cellKey, existing);
  }

  let topZonasRiesgo = Array.from(zonasMap.values())
    .sort((a, b) => b.conteo - a.conteo)
    .slice(0, 10)
    .map((cell, idx) => {
      const { latCenter, lngCenter } = getCellCenter(cell.cellKey);

      const [catDominante] =
        Object.entries(cell.categorias).sort((a, b) => b[1] - a[1])[0] || ['OTROS', 0];

      return {
        id: idx + 1,
        zona: `Zona aprox. (${latCenter.toFixed(4)}, ${lngCenter.toFixed(4)})`,
        incidentes_30d: cell.conteo,          // ✅ número de incidentes en esa celda
        tipo_delito_dominante: catDominante,  // por si quieres usarlo en algún otro lado
      };
    });

  // 2) Reportes por categoría (para el Pie)
  const catMap = new Map();
  for (const r of reports) {
    const cat = (r.category || 'OTROS').toUpperCase();
    const current = catMap.get(cat) || { categoria: cat, cantidad: 0 };
    current.cantidad += 1;
    catMap.set(cat, current);
  }

  const reportesPorCategoria = Array.from(catMap.values()).sort(
    (a, b) => b.cantidad - a.cantidad
  );

  // 3) Incidentes últimos 7 días (para la línea)
  const from7 = new Date(
    now.getTime() - 6 * 24 * 60 * 60 * 1000
  ); // hoy-6 → hoy (7 días)

  const countsByDay = new Map();

  // inicializar los 7 días
  for (let i = 0; i < 7; i++) {
    const d = new Date(from7.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    countsByDay.set(key, {
      dia: d.toLocaleDateString('es-PE', {
        weekday: 'short',
        day: '2-digit',
      }),
      cantidad: 0,
    });
  }

  for (const r of reports) {
    if (!r.created_at) continue;
    const d = new Date(r.created_at);
    const key = d.toISOString().slice(0, 10);
    if (countsByDay.has(key)) {
      countsByDay.get(key).cantidad += 1;
    }
  }

  const incidentesUltimos7Dias = Array.from(countsByDay.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([, v]) => v);

  return {
    data: {
      topZonasRiesgo,
      reportesPorCategoria,
      incidentesUltimos7Dias,
    },
  };
};

export default api;

