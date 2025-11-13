import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Monitor from './pages/Monitor.jsx';
import Planificador from './pages/Planificador.jsx';
import GestorRiesgos from './pages/GestorRiesgos.jsx';
import Analiticas from './pages/Analiticas.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/monitor" replace />} />
          <Route path="monitor" element={<Monitor />} />
          <Route path="planificador" element={<Planificador />} />
          <Route path="riesgos" element={<GestorRiesgos />} />
          <Route path="analiticas" element={<Analiticas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

