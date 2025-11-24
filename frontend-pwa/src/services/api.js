import { getCategory } from "../constants/categories";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️ Faltan REACT_APP_SUPABASE_URL o REACT_APP_SUPABASE_ANON_KEY en el .env"
  );
}

const defaultHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

/**
 * Obtener reportes desde Supabase.
 * timeWindow: "24h" | "48h" | "7d"
 */
export async function fetchReports({ timeWindow = "48h" } = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase no está configurado (URL o ANON KEY faltan)");
  }

  const url = new URL(`${SUPABASE_URL}/rest/v1/reports`);
  // Campos que queremos leer
  url.searchParams.set("select", "id,lat,lng,category,comment,created_at,time_status,status");

  // --- filtro de ventana de tiempo ---
  const now = new Date();
  let fromDate = null;

  if (timeWindow === "24h") {
    fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  } else if (timeWindow === "48h") {
    fromDate = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  } else if (timeWindow === "7d") {
    fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  if (fromDate) {
    url.searchParams.set("created_at", `gte.${fromDate.toISOString()}`);
  }

  // Ordenar por fecha de creación descendente
  url.searchParams.set("order", "created_at.desc");

  const res = await fetch(url.toString(), {
    headers: {
      ...defaultHeaders,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error al obtener reports de Supabase:", text);
    throw new Error("Error al obtener reportes");
  }

  const data = await res.json();
  return data;
}

/**
 * Crear un nuevo reporte en Supabase.
 * Espera un objeto:
 * {
 *   position: { lat, lng },
 *   category: string,    // ej. "robo_asalto"
 *   comment: string,
 *   time_status: "actual" | "reciente" | "pasado"  (según como lo manejes)
 * }
 */
export async function createReport({
  position,
  category,
  comment,
  time_status,
}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase no está configurado (URL o ANON KEY faltan)");
  }

  if (
    !position ||
    typeof position.lat !== "number" ||
    typeof position.lng !== "number"
  ) {
    throw new Error("Posición inválida");
  }

  const url = `${SUPABASE_URL}/rest/v1/reports`;

  const catMeta = getCategory(category);
  const type_general = catMeta?.group || "conducta_sospechosa"; 
  // 'delito' | 'conducta_sospechosa' | 'riesgo_entorno'

  // Normalizamos time_status para que cumpla con el CHECK de la BD
  const validTimeStatus = ["en_curso", "menos_1h", "hoy", "dias_anteriores"];
  const safeTimeStatus = validTimeStatus.includes(time_status)
    ? time_status
    : "dias_anteriores";

  const payload = [
    {
      lat: position.lat,
      lng: position.lng,
      category,
      comment: comment || "",
      time_status: safeTimeStatus,
      type_general, // OBLIGATORIO por NOT NULL
      // urgency: 2,           // puedes omitirlo y usar el DEFAULT de la tabla
      // address: null,        // opcional para futuro
      // status: "activo",     // puedes omitirlo y usar el DEFAULT
    },
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      "Content-Type": "application/json",
      Prefer: "return=representation", // que devuelva el registro insertado
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error al crear report en Supabase:", text);
    throw new Error("Error al crear reporte");
  }

  const data = await res.json();
  return data[0]; // devolvemos el registro recién creado
}
