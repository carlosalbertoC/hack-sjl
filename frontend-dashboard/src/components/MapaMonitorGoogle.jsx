// src/components/MapaMonitorGoogle.jsx
import React, { useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import ReactDOMServer from "react-dom/server";
import { getCategory } from "./categories";

const MAP_LIBRARIES = ["places"];
const containerStyle = { width: "100%", height: "100%" };

const DEFAULT_CENTER = { lat: -11.9693, lng: -77.0014 };

const customMapStyle = [
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#34495e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#7f8c8d" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#cde7ff" }] },
];

const mapOptions = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: true,
  styles: customMapStyle,
  clickableIcons: false,
};

const TIME_WINDOWS = [
  { id: "24h", label: "24 h" },
  { id: "48h", label: "48 h" },
  { id: "7d", label: "7 días" },
  { id: "14d", label: "14 días" },
  { id: "30d", label: "1 mes" },
  { id: "365d", label: "1 año" },
];

const normalizeCategoryId = (rawCategoria, explicitCategory) => {
  if (explicitCategory) return explicitCategory;
  if (!rawCategoria) return null;

  const normalized = rawCategoria.toString().toLowerCase();

  if (getCategory(normalized)) return normalized;

  const simple = normalized.split("_")[0];
  if (simple === "robo" || simple === "asalto") return "robo_asalto";
  if (simple === "vandalismo") return "basura_acumulada";

  return null;
};

const getCustomIcon = (categoryId) => {
  if (!window.google) return undefined;

  const category = getCategory(categoryId);
  if (!category || !category.icon) return undefined;

  const IconComponent = category.icon;

  const svgString = ReactDOMServer.renderToStaticMarkup(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        fill={category.color}
        stroke="#ffffff"
        strokeWidth="2"
      />
      <g transform="translate(10, 10)">
        <IconComponent color="#ffffff" size={20} />
      </g>
    </svg>
  );

  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgString),
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20),
  };
};

const hoursForWindow = (timeWindowId) => {
  switch (timeWindowId) {
    case "24h":
      return 24;
    case "48h":
      return 48;
    case "7d":
      return 24 * 7;
    case "14d":
      return 24 * 14;
    case "30d":
      return 24 * 30;
    case "365d":
      return 24 * 30 * 12;
    default:
      return null;
  }
};

const formatDateTime = (isoString) => {
  if (!isoString) return null;
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

const MapaMonitorGoogle = ({ reportes = [] }) => {
  // 🔹 Carga del script de Google Maps controlada por hook
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: MAP_LIBRARIES,
  });

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [timeWindow, setTimeWindow] = useState("48h");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(14);

  const mapRef = useRef(null);

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  // Buscador
  const handleChangeSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }
    if (!window.google || !window.google.maps?.places) return;

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: "pe" },
      },
      (predictions, status) => {
        if (
          status !== window.google.maps.places.PlacesServiceStatus.OK ||
          !predictions
        ) {
          setSuggestions([]);
          return;
        }
        setSuggestions(predictions);
      }
    );
  };

  const handleSelectSuggestion = (prediction) => {
    setSearchText(prediction.description);
    setSuggestions([]);

    if (!window.google || !window.google.maps) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: prediction.place_id }, (results, status) => {
      if (status === "OK" && results[0]) {
        const loc = results[0].geometry.location;
        const newCenter = { lat: loc.lat(), lng: loc.lng() };
        setCenter(newCenter);
        setZoom(16);
        if (mapRef.current) mapRef.current.panTo(newCenter);
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchText.trim()) {
      if (!window.google || !window.google.maps) return;
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchText.trim() }, (results, status) => {
        if (status === "OK" && results[0]) {
          const loc = results[0].geometry.location;
          const newCenter = { lat: loc.lat(), lng: loc.lng() };
          setCenter(newCenter);
          setZoom(16);
          if (mapRef.current) mapRef.current.panTo(newCenter);
        }
      });
      setSuggestions([]);
    }
  };

  // Normalizar data
  const normalizedReports = reportes
    .map((r) => {
      const categoryId = normalizeCategoryId(r.categoria, r.category);
      const lat = r.lat ?? r.position?.lat;
      const lng = r.lng ?? r.position?.lng;
      if (lat == null || lng == null) return null;

      return {
        ...r,
        _categoryId: categoryId,
        _position: { lat: Number(lat), lng: Number(lng) },
      };
    })
    .filter(Boolean);

  const maxHours = hoursForWindow(timeWindow);
  const now = new Date();

  const filteredReports = normalizedReports.filter((r) => {
    if (categoryFilter !== "all") {
      if (!r._categoryId) return false;
      const cat = getCategory(r._categoryId);
      if (!cat || cat.group !== categoryFilter) return false;
    }

    if (!maxHours) return true;

    if (r.created_at) {
      const created = new Date(r.created_at);
      if (!isNaN(created.getTime())) {
        const diffHours = (now - created) / 36e5;
        if (diffHours > maxHours) return false;
        return true;
      }
    }

    return true;
  });

  console.log("render monitor: ", {
    isLoaded,
    reportes: reportes.length,
    normalized: normalizedReports.length,
    filtered: filteredReports.length,
    timeWindow,
    categoryFilter,
  });

  const formatTitulo = (r) => {
    const cat = r._categoryId ? getCategory(r._categoryId) : null;
    if (cat) return cat.label;
    if (r._categoryId) return r._categoryId.toString().toUpperCase();
    return r.zona ? `Reporte en ${r.zona}` : "Reporte";
  };

  if (loadError) {
    return <div>Error cargando el mapa de Google.</div>;
  }

  // 👇 Hasta que no esté cargado el JS de Google, no dibujamos mapa ni markers
  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Barra superior */}
      <div
        style={{
          padding: "6px 10px 8px",
          backgroundColor: "#ffffff",
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          marginBottom: 8,
        }}
      >
        {/* buscador */}
        <div style={{ position: "relative", marginBottom: 6 }}>
          <input
            type="text"
            placeholder="Buscar dirección o zona"
            value={searchText}
            onChange={handleChangeSearch}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid #ddd",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                right: 0,
                backgroundColor: "#fff",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 10,
                maxHeight: 220,
                overflowY: "auto",
              }}
            >
              {suggestions.map((p) => (
                <button
                  key={p.place_id}
                  type="button"
                  onClick={() => handleSelectSuggestion(p)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "6px 8px",
                    border: "none",
                    background: "none",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {p.description}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* filtros */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "#555" }}>Ver reportes de:</span>
          {TIME_WINDOWS.map((w) => {
            const active = w.id === timeWindow;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => setTimeWindow(w.id)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: active ? "none" : "1px solid #ddd",
                  backgroundColor: active ? "#1565c0" : "#f5f5f5",
                  color: active ? "#fff" : "#333",
                  fontSize: 11,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {w.label}
              </button>
            );
          })}

          <span style={{ fontSize: 11, color: "#555", marginLeft: 8 }}>
            Tipo de reporte:
          </span>

          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            style={{
              padding: "4px 8px",
              borderRadius: 999,
              border: categoryFilter === "all" ? "none" : "1px solid #ddd",
              backgroundColor:
                categoryFilter === "all" ? "#424242" : "#f5f5f5",
              color: categoryFilter === "all" ? "#fff" : "#333",
              fontSize: 11,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Todos
          </button>

          {[
            { id: "delito", label: "Delitos / incidentes" },
            { id: "conducta_sospechosa", label: "Sospechas" },
            { id: "riesgo_entorno", label: "Riesgos del entorno" },
          ].map((g) => {
            const active = categoryFilter === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setCategoryFilter(g.id)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: active ? "none" : "1px solid #ddd",
                  backgroundColor: active ? "#1565c0" : "#f5f5f5",
                  color: active ? "#fff" : "#333",
                  fontSize: 11,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mapa */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
          onLoad={handleMapLoad}
          onClick={() => setSelectedMarker(null)}
        >
          {filteredReports.map((r) => (
            <Marker
              key={r.id}
              position={r._position}
              icon={r._categoryId ? getCustomIcon(r._categoryId) : undefined}
              onClick={() => setSelectedMarker(r)}
            />
          ))}

          {selectedMarker && selectedMarker._position && (
            <InfoWindow
              position={selectedMarker._position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div style={{ maxWidth: 240, color: "#333" }}>
                <div style={{ marginBottom: 4 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: "999px",
                      backgroundColor:
                        (selectedMarker._categoryId &&
                          getCategory(selectedMarker._categoryId)?.color) ||
                        "#eee",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    {formatTitulo(selectedMarker)}
                  </span>
                </div>

                {(selectedMarker.comment || selectedMarker.descripcion) && (
                  <p
                    style={{
                      margin: "6px 0 4px",
                      fontSize: "13px",
                      lineHeight: 1.3,
                      color: "#333",  
                    }}
                  >
                    {selectedMarker.comment || selectedMarker.descripcion}
                  </p>
                )}

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

                {selectedMarker.timestamp && !selectedMarker.created_at && (
                  <p
                    style={{
                      margin: "4px 0",
                      fontSize: "11px",
                      color: "#555",
                    }}
                  >
                    Hora: {selectedMarker.timestamp}
                  </p>
                )}

                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "10px",
                    color: "#888",
                  }}
                >
                  Lat: {selectedMarker._position.lat.toFixed(5)}, Lng:{" "}
                  {selectedMarker._position.lng.toFixed(5)}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapaMonitorGoogle;
