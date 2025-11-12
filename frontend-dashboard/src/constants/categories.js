import { 
  FaHandHoldingUsd, 
  FaExclamationTriangle, 
  FaUserSecret, 
  FaLightbulb,
  FaTree,
  FaTrash,
} from "react-icons/fa";

export const CATEGORY_GROUPS = {
  incidente: {
    id: "incidente",
    label: "Incidente",
    color: "#e53935",
    priority: 10,
  },
  sospecha: {
    id: "sospecha",
    label: "Sospecha",
    color: "#ff9800",
    priority: 5,
  },
  riesgo: {
    id: "riesgo",
    label: "Riesgo",
    color: "#1565c0",
    priority: 3,
  }
};

export const CATEGORIES = {
  robo: {
    id: "robo",
    label: "Robo",
    group: "incidente",
    color: "#e53935",
    icon: FaHandHoldingUsd,
    priority: 10,
  },
  asalto: {
    id: "asalto",
    label: "Asalto",
    group: "incidente",
    color: "#e53935",
    icon: FaExclamationTriangle,
    priority: 10,
  },
  balacera: {
    id: "balacera",
    label: "Balacera",
    group: "incidente",
    color: "#e53935",
    icon: FaExclamationTriangle,
    priority: 10,
  },
  sospechoso: {
    id: "sospechoso",
    label: "Sujetos sospechosos",
    group: "sospecha",
    color: "#ff9800",
    icon: FaUserSecret,
    priority: 5,
  },
  drogas: {
    id: "drogas",
    label: "Venta de drogas",
    group: "sospecha",
    color: "#ff9800",
    icon: FaUserSecret,
    priority: 5,
  },
  poste_sin_luz: {
    id: "poste_sin_luz",
    label: "Poste sin luz",
    group: "riesgo",
    color: "#1565c0",
    icon: FaLightbulb,
    priority: 3,
  },
  parque_abandonado: {
    id: "parque_abandonado",
    label: "Parque abandonado",
    group: "riesgo",
    color: "#1565c0",
    icon: FaTree,
    priority: 3,
  },
  basura_peligrosa: {
    id: "basura_peligrosa",
    label: "Basura peligrosa",
    group: "riesgo",
    color: "#1565c0",
    icon: FaTrash,
    priority: 3,
  },
};

export const CATEGORIES_LIST = Object.values(CATEGORIES);
export const HIGH_PRIORITY_CATEGORIES = CATEGORIES_LIST.filter(cat => cat.priority >= 10);
export const getCategory = (id) => CATEGORIES[id] || null;
export const getCategoryGroup = (categoryId) => {
  const category = CATEGORIES[categoryId];
  return category ? CATEGORY_GROUPS[category.group] : null;
};

