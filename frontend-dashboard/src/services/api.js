const STORAGE_KEY = 'hack_sjl_reports_v1';

function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const arr = raw ? JSON.parse(raw) : [];
  const now = Date.now();
  const filtered = arr.filter(r => new Date(r.expires_at).getTime() > now);
  if (filtered.length !== arr.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

export async function fetchReports({ sinceISO, lat, lng, radius_m } = {}) {
  await new Promise(res => setTimeout(res, 200));
  let arr = loadAll();
  if (sinceISO) arr = arr.filter(r => new Date(r.created_at) >= new Date(sinceISO));
  if (lat && lng && radius_m) {
    const R = 6371000;
    const toRad = v => v * Math.PI / 180;
    arr = arr.filter(r => {
      const dLat = toRad(r.lat - lat);
      const dLon = toRad(r.lng - lng);
      const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat))*Math.cos(toRad(r.lat))*Math.sin(dLon/2)**2;
      const d = 2*R*Math.asin(Math.sqrt(a));
      return d <= radius_m;
    });
  }
  arr.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  return arr;
}

