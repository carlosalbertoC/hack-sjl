import { 
  FaHandHoldingUsd, 
  FaExclamationTriangle, 
  FaUserSecret, 
  FaLightbulb,
  FaTrash,
} from "react-icons/fa";

export const CATEGORY_GROUPS = {
  delito: {
    id: "delito",
    label: "Delitos / incidentes",
    color: "#e53935",
    priority: 10,
  },
  conducta_sospechosa: {
    id: "conducta_sospechosa",
    label: "Conducta sospechosa",
    color: "#ff9800",
    priority: 5,
  },
  riesgo_entorno: {
    id: "riesgo_entorno",
    label: "Riesgos del entorno",
    color: "#1565c0",
    priority: 3,
  },
};

export const CATEGORIES = {
  // DELITOS / INCIDENTES
  robo_asalto: {
    id: "robo_asalto",
    label: "Robo / asalto a persona",
    group: "delito",
    color: "#e53935",
    icon: FaHandHoldingUsd,
    priority: 10,
    type_general: "delito",
    urgency: 3,
  },
  hurto_vehicular: {
    id: "hurto_vehicular",
    label: "Robo / daño a vehículo",
    group: "delito",
    color: "#e53935",
    icon: FaHandHoldingUsd,
    priority: 10,
    type_general: "delito",
    urgency: 3,
  },
  agresion: {
    id: "agresion",
    label: "Agresión o pelea violenta",
    group: "delito",
    color: "#e53935",
    icon: FaExclamationTriangle,
    priority: 10,
    type_general: "delito",
    urgency: 3,
  },
  disparos: {
    id: "disparos",
    label: "Disparos / arma de fuego",
    group: "delito",
    color: "#e53935",
    icon: FaExclamationTriangle,
    priority: 10,
    type_general: "delito",
    urgency: 3,
  },
  extorsion: {
    id: "extorsion",
    label: "Extorsión / amenazas",
    group: "delito",
    color: "#e53935",
    icon: FaExclamationTriangle,
    priority: 10,
    type_general: "delito",
    urgency: 3,
  },

  // CONDUCTA SOSPECHOSA
  merodeo_vehiculos: {
    id: "merodeo_vehiculos",
    label: "Merodeo en vehículos",
    group: "conducta_sospechosa",
    color: "#ff9800",
    icon: FaUserSecret,
    priority: 5,
    type_general: "conducta_sospechosa",
    urgency: 2,
  },
  merodeo_viviendas: {
    id: "merodeo_viviendas",
    label: "Merodeo en viviendas / locales",
    group: "conducta_sospechosa",
    color: "#ff9800",
    icon: FaUserSecret,
    priority: 5,
    type_general: "conducta_sospechosa",
    urgency: 2,
  },
  venta_drogas: {
    id: "venta_drogas",
    label: "Posible venta de drogas",
    group: "conducta_sospechosa",
    color: "#ff9800",
    icon: FaUserSecret,
    priority: 5,
    type_general: "conducta_sospechosa",
    urgency: 2,
  },

  // RIESGOS DEL ENTORNO
  iluminacion_deficiente: {
    id: "iluminacion_deficiente",
    label: "Iluminación deficiente / poste sin luz",
    group: "riesgo_entorno",
    color: "#1565c0",
    icon: FaLightbulb,
    priority: 3,
    type_general: "riesgo_entorno",
    urgency: 1,
  },
  basura_acumulada: {
    id: "basura_acumulada",
    label: "Basura acumulada / desmonte",
    group: "riesgo_entorno",
    color: "#1565c0",
    icon: FaTrash,
    priority: 3,
    type_general: "riesgo_entorno",
    urgency: 1,
  },
};

export const CATEGORIES_LIST = Object.values(CATEGORIES);
export const HIGH_PRIORITY_CATEGORIES = CATEGORIES_LIST.filter(
  (cat) => cat.urgency >= 3
);
export const getCategory = (id) => CATEGORIES[id] || null;
export const getCategoryGroup = (categoryId) => {
  const category = CATEGORIES[categoryId];
  return category ? CATEGORY_GROUPS[category.group] : null;
};
