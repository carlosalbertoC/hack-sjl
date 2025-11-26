import axios from 'axios';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

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

export default supabaseApi;
