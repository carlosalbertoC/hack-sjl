import { useEffect, useState, useRef } from 'react';
import { fetchReports } from '../services/api';

export default function useReports({ intervalMs = 30000, radius_m, lat, lng } = {}) {
  const [reports, setReports] = useState([]);
  const timerRef = useRef(null);

  const load = async () => {
    const since = new Date(Date.now() - 48*3600*1000).toISOString();
    try {
      const res = await fetchReports({ sinceISO: since, lat, lng, radius_m });
      setReports(res);
    } catch (e) {
      console.error('fetch reports error', e);
    }
  };

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, intervalMs);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs, radius_m, lat, lng]);

  return { reports, refresh: load };
}
