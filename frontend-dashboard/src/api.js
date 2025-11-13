import axios from 'axios';

// Configuración base de axios (simulada)
const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// Datos mock para simulación

// Mock: Reportes en vivo
const mockLiveReports = [
  {
    id: 1,
    categoria: 'ROBO',
    descripcion: 'Asalto a transeúnte en intersección',
    zona: 'Zárate',
    lat: -11.9900,
    lng: -77.0100,
    timestamp: '14:35',
    enjambre: true,
    prioridad: 'alta'
  },
  {
    id: 2,
    categoria: 'VANDALISMO',
    descripcion: 'Grafiti en paredes del parque',
    zona: 'Canto Rey',
    lat: -11.9850,
    lng: -77.0150,
    timestamp: '14:28',
    enjambre: false,
    prioridad: 'media'
  },
  {
    id: 3,
    categoria: 'ROBO',
    descripcion: 'Robo de celular en paradero',
    zona: 'Zárate',
    lat: -11.9920,
    lng: -77.0120,
    timestamp: '14:20',
    enjambre: true,
    prioridad: 'alta'
  },
  {
    id: 4,
    categoria: 'ASALTO',
    descripcion: 'Asalto a comercio',
    zona: 'Mariscal Cáceres',
    lat: -11.9880,
    lng: -77.0080,
    timestamp: '14:15',
    enjambre: false,
    prioridad: 'alta'
  },
  {
    id: 5,
    categoria: 'VANDALISMO',
    descripcion: 'Destrucción de mobiliario urbano',
    zona: 'Canto Rey',
    lat: -11.9860,
    lng: -77.0140,
    timestamp: '14:10',
    enjambre: false,
    prioridad: 'baja'
  },
  {
    id: 6,
    categoria: 'ROBO',
    descripcion: 'Robo de vehículo estacionado',
    zona: 'Zárate',
    lat: -11.9910,
    lng: -77.0110,
    timestamp: '14:05',
    enjambre: true,
    prioridad: 'alta'
  },
  {
    id: 7,
    categoria: 'ASALTO',
    descripcion: 'Asalto a persona en vía pública',
    zona: 'Mariscal Cáceres',
    lat: -11.9870,
    lng: -77.0090,
    timestamp: '13:58',
    enjambre: false,
    prioridad: 'media'
  },
  {
    id: 8,
    categoria: 'VANDALISMO',
    descripcion: 'Pintas en fachada de edificio',
    zona: 'Canto Rey',
    lat: -11.9840,
    lng: -77.0160,
    timestamp: '13:50',
    enjambre: false,
    prioridad: 'baja'
  },
  {
    id: 9,
    categoria: 'ROBO',
    descripcion: 'Robo de billetera',
    zona: 'Zárate',
    lat: -11.9890,
    lng: -77.0105,
    timestamp: '13:45',
    enjambre: true,
    prioridad: 'alta'
  },
  {
    id: 10,
    categoria: 'ASALTO',
    descripcion: 'Asalto a motociclista',
    zona: 'Mariscal Cáceres',
    lat: -11.9885,
    lng: -77.0085,
    timestamp: '13:40',
    enjambre: false,
    prioridad: 'alta'
  },
  {
    id: 11,
    categoria: 'ROBO',
    descripcion: 'Robo de celular en transporte público',
    zona: 'Zárate',
    lat: -11.9905,
    lng: -77.0115,
    timestamp: '13:35',
    enjambre: true,
    prioridad: 'alta'
  },
  {
    id: 12,
    categoria: 'VANDALISMO',
    descripcion: 'Rotura de semáforo',
    zona: 'Canto Rey',
    lat: -11.9855,
    lng: -77.0155,
    timestamp: '13:30',
    enjambre: false,
    prioridad: 'media'
  },
  {
    id: 13,
    categoria: 'ROBO',
    descripcion: 'Robo de bicicleta',
    zona: 'Zárate',
    lat: -11.9915,
    lng: -77.0125,
    timestamp: '13:25',
    enjambre: true,
    prioridad: 'media'
  },
  {
    id: 14,
    categoria: 'ASALTO',
    descripcion: 'Asalto a taxista',
    zona: 'Mariscal Cáceres',
    lat: -11.9875,
    lng: -77.0095,
    timestamp: '13:20',
    enjambre: false,
    prioridad: 'alta'
  },
  {
    id: 15,
    categoria: 'VANDALISMO',
    descripcion: 'Grafiti en monumento',
    zona: 'Canto Rey',
    lat: -11.9845,
    lng: -77.0165,
    timestamp: '13:15',
    enjambre: false,
    prioridad: 'baja'
  },
  {
    id: 16,
    categoria: 'ROBO',
    descripcion: 'Robo de cartera',
    zona: 'Zárate',
    lat: -11.9908,
    lng: -77.0108,
    timestamp: '13:10',
    enjambre: true,
    prioridad: 'alta'
  },
  {
    id: 17,
    categoria: 'ASALTO',
    descripcion: 'Asalto a peatón',
    zona: 'Mariscal Cáceres',
    lat: -11.9882,
    lng: -77.0082,
    timestamp: '13:05',
    enjambre: false,
    prioridad: 'media'
  },
  {
    id: 18,
    categoria: 'ROBO',
    descripcion: 'Robo de mochila',
    zona: 'Zárate',
    lat: -11.9912,
    lng: -77.0112,
    timestamp: '13:00',
    enjambre: true,
    prioridad: 'alta'
  },
  {
    id: 19,
    categoria: 'VANDALISMO',
    descripcion: 'Destrucción de señalética',
    zona: 'Canto Rey',
    lat: -11.9858,
    lng: -77.0158,
    timestamp: '12:55',
    enjambre: false,
    prioridad: 'baja'
  },
  {
    id: 20,
    categoria: 'ASALTO',
    descripcion: 'Asalto a comerciante',
    zona: 'Mariscal Cáceres',
    lat: -11.9878,
    lng: -77.0098,
    timestamp: '12:50',
    enjambre: false,
    prioridad: 'alta'
  }
];

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

// Mock: Matriz de riesgos
const mockMatrizRiesgos = [
  {
    id: 1,
    prioridad: 'ALTA',
    problema: 'Poste sin luz en intersección principal',
    ubicacion: 'Av. Zárate con Jr. Los Olivos',
    delitos_asociados: '18 Robos',
    jurisdiccion: 'CPNP Canto Rey',
    estado: 'Pendiente'
  },
  {
    id: 2,
    prioridad: 'MEDIA',
    problema: 'Semáforo dañado',
    ubicacion: 'Av. Mariscal Cáceres km 8.5',
    delitos_asociados: '5 Asaltos',
    jurisdiccion: 'CPNP Zárate',
    estado: 'En proceso'
  },
  {
    id: 3,
    prioridad: 'ALTA',
    problema: 'Cámaras de seguridad fuera de servicio',
    ubicacion: 'Parque Canto Rey',
    delitos_asociados: '12 Vandalismo',
    jurisdiccion: 'CPNP Canto Rey',
    estado: 'Pendiente'
  },
  {
    id: 4,
    prioridad: 'MEDIA',
    problema: 'Mobiliario urbano destruido',
    ubicacion: 'Plaza Zárate',
    delitos_asociados: '8 Vandalismo',
    jurisdiccion: 'CPNP Zárate',
    estado: 'Resuelto'
  },
  {
    id: 5,
    prioridad: 'ALTA',
    problema: 'Alumbrado público insuficiente',
    ubicacion: 'Jr. Los Olivos cuadras 5-10',
    delitos_asociados: '15 Robos',
    jurisdiccion: 'CPNP Canto Rey',
    estado: 'Pendiente'
  },
  {
    id: 6,
    prioridad: 'MEDIA',
    problema: 'Baches en vía principal',
    ubicacion: 'Av. Mariscal Cáceres km 7-9',
    delitos_asociados: '3 Asaltos',
    jurisdiccion: 'CPNP Zárate',
    estado: 'En proceso'
  },
  {
    id: 7,
    prioridad: 'ALTA',
    problema: 'Cámaras vandalizadas',
    ubicacion: 'Av. Zárate intersección con Av. Canto Rey',
    delitos_asociados: '20 Robos',
    jurisdiccion: 'CPNP Canto Rey',
    estado: 'Pendiente'
  },
  {
    id: 8,
    prioridad: 'MEDIA',
    problema: 'Señalética dañada',
    ubicacion: 'Zona escolar Canto Rey',
    delitos_asociados: '6 Vandalismo',
    jurisdiccion: 'CPNP Canto Rey',
    estado: 'Resuelto'
  }
];

// Mock: Estadísticas para gráficos
const mockStats = {
  topZonasRiesgo: [
    { zona: 'Zárate', riesgo: 9.2 },
    { zona: 'Mariscal Cáceres', riesgo: 8.5 },
    { zona: 'Canto Rey', riesgo: 6.8 },
    { zona: 'San Juan', riesgo: 5.3 },
    { zona: 'El Progreso', riesgo: 4.1 }
  ],
  reportesPorCategoria: [
    { categoria: 'ROBO', cantidad: 45 },
    { categoria: 'ASALTO', cantidad: 28 },
    { categoria: 'VANDALISMO', cantidad: 32 },
    { categoria: 'OTROS', cantidad: 15 }
  ],
  incidentesUltimos7Dias: [
    { dia: 'Lun', cantidad: 18 },
    { dia: 'Mar', cantidad: 22 },
    { dia: 'Mié', cantidad: 15 },
    { dia: 'Jue', cantidad: 28 },
    { dia: 'Vie', cantidad: 35 },
    { dia: 'Sáb', cantidad: 42 },
    { dia: 'Dom', cantidad: 30 }
  ]
};

// Funciones de API (simuladas con datos mock)
export const fetchLiveReports = async () => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: mockLiveReports };
};

export const fetchDirectivas = async (turno) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const directivas = mockDirectivas[turno] || [];
  return { data: directivas };
};

export const fetchMatrizRiesgos = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: mockMatrizRiesgos };
};

export const fetchStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: mockStats };
};

export default api;

