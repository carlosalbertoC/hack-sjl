import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { FaHandHoldingUsd, FaExclamationTriangle, FaSkull, FaUserSecret } from "react-icons/fa";
import { createRoot } from "react-dom/client";

const containerStyle = { width: "100vw", height: "100vh" };
const DEFAULT_CENTER = { lat: -12.0553, lng: -76.9468 };

const icons = {
  robo: <FaHandHoldingUsd color="#e53935" size={24} />,
  balacera: <FaExclamationTriangle color="#ff9800" size={24} />,
  drogas: <FaSkull color="#8e24aa" size={24} />,
  sospechoso: <FaUserSecret color="#1565c0" size={24} />,
};

const MapView = ({
  markers = [],              // reportes ya enviados
  currentCategory = null,    // categoría seleccionada en la barra
  onMapClick = () => {},     // callback al padre con {lat, lng}
}) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [clickMarker, setClickMarker] = useState(null); // marker temporal
  const mapRef = useRef(null);

  const getCustomIcon = (category) => {
    if (!window.google) return undefined;
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(icons[category]);
    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(div.innerHTML),
      scaledSize: new window.google.maps.Size(32, 32),
    };
  };

  const handleMapClickInternal = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    // marker temporal con icono de la categoría seleccionada
    setClickMarker({
      id: "click-marker",
      position: pos,
      category: currentCategory,
    });

    // mover el mapa al punto clickeado
    if (mapRef.current) {
      mapRef.current.panTo(pos);
    }

    // avisar al padre con la posición limpia
    onMapClick(pos);
  };

  const handleOnLoad = (map) => {
    mapRef.current = map;
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={DEFAULT_CENTER}
        zoom={15}
        onClick={handleMapClickInternal}
        onLoad={handleOnLoad}
      >
        {/* markers de reportes (persistentes) */}
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={m.position}
            onClick={() => setSelectedMarker(m)}
            icon={m.category ? getCustomIcon(m.category) : undefined}
          />
        ))}

        {/* marker temporal del último click */}
        {clickMarker && (
          <Marker
            key={clickMarker.id}
            position={clickMarker.position}
            onClick={() => setSelectedMarker(clickMarker)}
            icon={
              clickMarker.category
                ? getCustomIcon(clickMarker.category)
                : undefined
            }
          />
        )}

        {selectedMarker && selectedMarker.position && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <h4>
                {selectedMarker.category
                  ? selectedMarker.category.toUpperCase()
                  : "Posición seleccionada"}
              </h4>
              <p>Lat: {selectedMarker.position.lat.toFixed(5)}</p>
              <p>Lng: {selectedMarker.position.lng.toFixed(5)}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView;
