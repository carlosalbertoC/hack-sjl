// services/api.js
const STORAGE_KEY = 'hack_sjl_reports_v1';

// helper: load data
function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const arr = raw ? JSON.parse(raw) : [];
  // limpiar expirados
  const now = Date.now();
  const filtered = arr.filter(r => new Date(r.expires_at).getTime() > now);
  if (filtered.length !== arr.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

function saveAll(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function uid() {
  return 'r_' + Math.random().toString(36).slice(2, 9);
}

export async function fetchReports({ sinceISO, lat, lng, radius_m } = {}) {
  // simulamos retardo
  await new Promise(res => setTimeout(res, 200));
  let arr = loadAll();
  if (sinceISO) arr = arr.filter(r => new Date(r.created_at) >= new Date(sinceISO));
  if (lat && lng && radius_m) {
    // filtro por distancia (haversine)
    arr = arr.filter(r => {
      const R = 6371000;
      const toRad = v => v * Math.PI / 180;
      const dLat = toRad(r.lat - lat);
      const dLon = toRad(r.lng - lng);
      const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat))*Math.cos(toRad(r.lat))*Math.sin(dLon/2)**2;
      const d = 2*R*Math.asin(Math.sqrt(a));
      return d <= radius_m;
    });
  }
  // ordenar por created_at desc
  arr.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  return arr;
}

export async function createReport({ lat, lng, category, comment, imagesUrls=[] }) {
  await new Promise(res => setTimeout(res, 200));
  const now = new Date();
  const expires = new Date(now.getTime() + 48*3600*1000);
  const r = {
    id: uid(),
    lat: Number(lat),
    lng: Number(lng),
    category,
    comment: comment || '',
    images: imagesUrls,
    created_at: now.toISOString(),
    expires_at: expires.toISOString(),
    status: 'pendiente',
    municipality_note: null
  };
  const arr = loadAll();
  arr.push(r);
  saveAll(arr);
  return r;
}

export async function getReport(id) {
  const arr = loadAll();
  return arr.find(r => r.id === id) || null;
}

export async function attendReport(id, note) {
  const arr = loadAll();
  const idx = arr.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('No encontrado');
  arr[idx].status = 'atendido';
  arr[idx].municipality_note = note || '';
  saveAll(arr);
  return arr[idx];
}
