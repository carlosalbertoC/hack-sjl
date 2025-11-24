import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { getCategory } from "../constants/categories";
import ReactDOMServer from "react-dom/server";

const containerStyle = { width: "100%", height: "100%" };
const DEFAULT_CENTER = { lat: -12.0553, lng: -76.9468 };

const MAP_LIBRARIES = ["places"];

const customMapStyle = [
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#34495e" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7f8c8d" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#cde7ff" }],
  },
];

const mapOptions = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: true,
  styles: customMapStyle,
  clickableIcons: false,
};

const MapView = ({
  markers = [],
  currentCategory = null,
  onMapClick = () => {},
  center = DEFAULT_CENTER,
  userLocation = null,
  zoom = 15,
  selectedPosition = null,
  onZoomChanged = () => {},
}) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null);

  const handleOnLoad = (map) => {
    mapRef.current = map;
  };

  const handleMapClickInternal = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    onMapClick(pos);
  };

  // 🔸 Icono custom según categoría (usando react-icons)
  const getCustomIcon = (categoryId) => {
    if (!window.google) return undefined;

    const category = getCategory(categoryId);
    if (!category || !category.icon) return undefined;

    const IconComponent = category.icon;

    // Renderizamos el icono como SVG estático
    const svgString = ReactDOMServer.renderToStaticMarkup(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
      >
        {/* círculo de fondo */}
        <circle
          cx="20"
          cy="20"
          r="18"
          fill={category.color}
          stroke="#ffffff"
          strokeWidth="2"
        />

        {/* icono en blanco, centrado */}
        <g transform="translate(10, 10)">
          <IconComponent color="#ffffff" size={20} />
        </g>
      </svg>
    );

    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgString),
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20), // anclar al centro
    };
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "Fecha no disponible";
    try {
      const d = new Date(isoString);
      return d.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  // Recentrar cuando cambie center (por buscar dirección o ir a mi ubicación)
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.panTo(center);
    }
  }, [center]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={MAP_LIBRARIES}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center || DEFAULT_CENTER}
        zoom={zoom}
        onClick={handleMapClickInternal}
        onLoad={handleOnLoad}
        options={mapOptions}
        onZoomChanged={() => {
          if (!mapRef.current) return;
          const z = mapRef.current.getZoom();
          if (typeof z === "number") {
            onZoomChanged(z);
          }
        }}
      >
        {/* ✅ Marcadores de reportes (BD) con icono por categoría */}
        {markers.map((m) => {
          const position = m.position || { lat: m.lat, lng: m.lng };
          return (
            <Marker
              key={m.id}
              position={position}
              onClick={() => setSelectedMarker(m)}
              icon={m.category ? getCustomIcon(m.category) : undefined}
            />
          );
        })}

        {/* 🔵 Ubicación actual como punto azul (solo si el usuario dio permiso) */}
        {userLocation && window.google && (
          <Marker
            key="user-location"
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
            zIndex={999}
          />
        )}

        {selectedPosition && window.google && (
          <Marker
            key="selected-position"
            position={selectedPosition}
            icon={{
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 6,
              fillColor: "#e53935",
              fillOpacity: 1,
              strokeColor: "#e53935",
              strokeWeight: 2,
            }}
            zIndex={998}
          />
        )}

        {selectedMarker && selectedMarker.position && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div style={{ maxWidth: 240 }}>
              {/* título / categoría */}
              <div style={{ marginBottom: 4 }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    backgroundColor: "#eee",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {selectedMarker.category
                    ? (getCategory(selectedMarker.category)?.label ||
                        selectedMarker.category.toUpperCase())
                    : "Reporte"}
                </span>
              </div>

              {/* comentario */}
              {selectedMarker.comment && (
                <p
                  style={{
                    margin: "6px 0 4px",
                    fontSize: "13px",
                    lineHeight: 1.3,
                  }}
                >
                  {selectedMarker.comment}
                </p>
              )}

              {/* fecha */}
              {selectedMarker.created_at && (
                <p
                  style={{
                    margin: "4px 0",
                    fontSize: "11px",
                    color: "#555",
                  }}
                >
                  Fecha: {formatDateTime(selectedMarker.created_at)}
                </p>
              )}

              {/* coordenadas */}
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "10px",
                  color: "#888",
                }}
              >
                Lat: {selectedMarker.position.lat.toFixed(5)}, Lng:{" "}
                {selectedMarker.position.lng.toFixed(5)}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView;
