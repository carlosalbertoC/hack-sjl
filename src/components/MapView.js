import React, { useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  OverlayView,
  Marker,
} from "@react-google-maps/api";
import {
  FaHandHoldingUsd,
  FaExclamationTriangle,
  FaSkull,
  FaUserSecret,
} from "react-icons/fa";

const containerStyle = { width: "100vw", height: "100vh" };
const DEFAULT_CENTER = { lat: -12.0553, lng: -76.9468 };
const RADIO_EVENTO = 20; // CAMBIEN ESTE NUMERO PARA CAMBIAR CUANTO UN EVENTO TOMA EN AREA Y PROHIBE CREACION DE OTROS EVENTOS

// Iconos por categoría
const icons = {
  robo: <FaHandHoldingUsd color="#e53935" size={20} />,
  balacera: <FaExclamationTriangle color="#ff9800" size={20} />,
  drogas: <FaSkull color="#8e24aa" size={20} />,
  sospechoso: <FaUserSecret color="#1565c0" size={20} />,
};

// Labels amigables por categoría
const CATEGORY_LABELS = {
  robo: "Robo",
  balacera: "Balacera",
  drogas: "Venta de drogas",
  sospechoso: "Persona sospechosa",
};

// --- Helpers de distancia --- //
const toRad = (value) => (value * Math.PI) / 180;

const distanceMeters = (p1, p2) => {
  const R = 6371000;
  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);
  const lat1 = toRad(p1.lat);
  const lat2 = toRad(p2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const findNearbyMarker = (pos, markers, radiusMeters = 40) => {
  let closest = null;
  let minDist = Infinity;

  markers.forEach((m) => {
    if (!m.position) return;
    const d = distanceMeters(pos, m.position);
    if (d < radiusMeters && d < minDist) {
      minDist = d;
      closest = m;
    }
  });

  return closest;
};

// Marker ancho con icono de categoría
const CategoryMarker = ({ marker, onClick }) => {
  if (!marker || !marker.position) return null;

  const { position, category } = marker;
  const icon = category ? icons[category] : null;
  const label = category ? CATEGORY_LABELS[category] || category : null;

  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      {/* HITBOX más grande e invisible */}
      <div
        onClick={onClick}
        style={{
          transform: "translate(-50%, -100%)",
          cursor: "pointer",
          padding: 16,
          borderRadius: 24,
          background: "transparent",
        }}
      >
        {/* Chip visual */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 999,
            background: "#ffffff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            border: category ? "1px solid rgba(0,0,0,0.1)" : "none",
          }}
        >
          {icon && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </div>
          )}
          {label && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "none",
                letterSpacing: "0.04em",
              }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    </OverlayView>
  );
};

const MapView = ({
  markers = [],           // reportes ya enviados
  currentCategory = null, // categoría seleccionada en la barra
  onMapClick = () => {},  // callback al padre con {lat, lng}
  onMarkerClickEvent = () => {}, // callback para "imprimir evento"
}) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [clickMarker, setClickMarker] = useState(null); // marker temporal
  const mapRef = useRef(null);

  const handleMapClickInternal = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    // 1) ¿Hay un evento cerca?
    const nearby = findNearbyMarker(pos, markers, RADIO_EVENTO); // metros

    if (nearby) {
      // Si hay evento cerca: NO crees marker nuevo
      setClickMarker(null);
      setSelectedMarker(nearby);
      onMarkerClickEvent(nearby);

      // opcional: centra en el evento real
      if (mapRef.current) {
        mapRef.current.panTo(nearby.position);
      }
      return; // salimos, no disparamos onMapClick ni clickMarker
    }

    // 2) Si no hay evento cerca, comportamiento normal:
    setSelectedMarker(null);

    setClickMarker({
      id: "click-marker",
      position: pos,
      category: currentCategory,
    });

    if (mapRef.current) {
      mapRef.current.panTo(pos);
    }

    onMapClick(pos);
  };

  const handleOnLoad = (map) => {
    mapRef.current = map;
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(null);
    setSelectedMarker(marker);
    onMarkerClickEvent(marker);
  };

  const renderMarker = (marker, isTemp = false) => {
    const key = marker.id + (isTemp ? "-temp" : "");

    if (marker.category) {
      return (
        <CategoryMarker
          key={key}
          marker={marker}
          onClick={() => handleMarkerClick(marker)}
        />
      );
    }

    return (
      <Marker
        key={key}
        position={marker.position}
        onClick={() => handleMarkerClick(marker)}
      />
    );
  };

  const renderHeader = (marker) => {
    if (marker.category) {
      const icon = icons[marker.category];
      const label =
        CATEGORY_LABELS[marker.category] || marker.category.toUpperCase();

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#777",
              }}
            >
              Evento reportado en este punto
            </span>
          </div>
        </div>
      );
    }

    return (
      <div style={{ marginBottom: 6 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Punto seleccionado en el mapa
        </span>
        <p
          style={{
            margin: "2px 0 0",
            fontSize: 11,
            color: "#777",
          }}
        >
          Usa esta ubicación para registrar un nuevo reporte.
        </p>
      </div>
    );
  };

  const renderDescription = (marker) => {
    if (marker.comment) {
      return (
        <>
          <p
            style={{
              margin: "4px 0 2px",
              fontSize: 12,
              color: "#555",
              fontWeight: 600,
            }}
          >
            Descripción del reporte:
          </p>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 12,
              whiteSpace: "pre-line",
              color: "#333",
            }}
          >
            {marker.comment}
          </p>
        </>
      );
    }

    return (
      <p
        style={{
          margin: "4px 0 8px",
          fontSize: 12,
          color: "#777",
        }}
      >
        No hay descripción añadida para este reporte.
      </p>
    );
  };

  const renderMeta = (marker) => {
    const hasDate = !!marker.createdAt;

    return (
      <div
        style={{
          marginTop: 4,
          fontSize: 11,
          color: "#777",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {hasDate && (
          <span>
            Reportado el:{" "}
            {new Date(marker.createdAt).toLocaleString("es-PE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
        <span>
          Lat: {marker.position.lat.toFixed(5)} · Lng:{" "}
          {marker.position.lng.toFixed(5)}
        </span>
      </div>
    );
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={DEFAULT_CENTER}
        zoom={15}
        onClick={handleMapClickInternal}
        onLoad={handleOnLoad}
        options={{
          clickableIcons: false,
        }}
      >
        {markers.map((m) => renderMarker(m, false))}

        {clickMarker && renderMarker(clickMarker, true)}

        {selectedMarker && selectedMarker.position && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div style={{ maxWidth: 270 }}>
              {renderHeader(selectedMarker)}
              {renderDescription(selectedMarker)}
              {renderMeta(selectedMarker)}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView;
