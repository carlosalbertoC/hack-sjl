import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapaMonitor.module.css';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Crear iconos personalizados según categoría
const getIcon = (categoria) => {
  const iconColor = categoria === 'ROBO' ? 'red' : categoria === 'ASALTO' ? 'orange' : 'blue';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${iconColor};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const MapaMonitor = ({ reportes }) => {
  // Centro de San Juan de Lurigancho (aproximado)
  const center = [-11.99, -77.01];
  const zoom = 13;

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reportes.map((reporte) => (
          <div key={reporte.id}>
            <Marker
              position={[reporte.lat, reporte.lng]}
              icon={getIcon(reporte.categoria)}
            />
            {reporte.enjambre && (
              <Circle
                key={`circle-${reporte.id}`}
                center={[reporte.lat, reporte.lng]}
                radius={200}
                pathOptions={{
                  color: '#ff0000',
                  fillColor: '#ff0000',
                  fillOpacity: 0.2,
                }}
              />
            )}
          </div>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapaMonitor;

