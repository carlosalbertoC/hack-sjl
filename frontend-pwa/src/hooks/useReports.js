// src/hooks/useReports.js
import { useState, useEffect, useCallback } from "react";
import { fetchReports } from "../services/api";

/**
 * Hook para cargar reportes desde Supabase.
 * - intervalMs: cada cuánto refrescar (ms)
 * - timeWindow: "24h" | "48h" | "7d"
 */
const useReports = ({ intervalMs = 30000, timeWindow = "48h" } = {}) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchReports({ timeWindow });
      setReports(data);
      setError(null);
    } catch (err) {
      console.error("Error en useReports.refresh:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [timeWindow]);

  // cargar al montar y cuando cambie timeWindow
  useEffect(() => {
    refresh();
  }, [refresh]);

  // refresco periódico
  useEffect(() => {
    if (!intervalMs) return;
    const id = setInterval(() => {
      refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, refresh]);

  return { reports, refresh, loading, error };
};

export default useReports;
