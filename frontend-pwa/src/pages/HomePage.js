import React, { useState, useEffect } from "react";
import MapView from "../components/MapView";
import ReportModal from "../components/ReportModal";
import LoadingScreen from "../components/LoadingScreen";
import { createReport } from "../services/api";
import useReports from "../hooks/useReports";
import { FaLocationArrow } from "react-icons/fa";
import { getCategory } from "../constants/categories";
import appLogo from "../assets/barrio_alerta_logo.png";

// --- componentes de UI simples para la parte superior ---

const TIME_WINDOWS = [
  { id: "24h", label: "24 h" },
  { id: "48h", label: "48 h" },
  { id: "7d", label: "7 días" },
];

const TopBar = ({ selectedWindow, onSelectWindow, onSearchAddress, categoryFilter, onChangeCategoryFilter }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchText.trim()) {
      onSearchAddress && onSearchAddress(searchText.trim());
      setSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }

    if (!window.google || !window.google.maps || !window.google.maps.places) {
      // Aún no cargó la librería de Places
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();

    service.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: "pe" }, // puedes ajustar país
      },
      (predictions, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
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
    onSearchAddress && onSearchAddress(prediction.description);
  };

  return (
    <div
      style={{
        padding: "10px 0",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        zIndex: 10,
      }}
    >
      {/* Fila centrada */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Contenedor con ancho máximo */}
        <div
          style={{
            maxWidth: "1500px",
            width: "100%",
            margin: "0 auto",
            padding: "0 16px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* 🔹 Logo a la izquierda, alineado con el contenido */}
          <div className="topbar-logo-wrapper">
            <img
              src={appLogo}
              alt="Logo de la app"
              style={{
                height: 70,
                width: "auto",
                padding: "0 16px 0 16px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* 🔹 Bloque con input + filtros (ocupa el resto del espacio) */}
          <div style={{ flex: 1 }}>
            {/* FILA 1: logo móvil + input (solo se ve el logo en mobile) */}
            <div style={{ marginBottom: "8px" }}>
              <div
                className="topbar-search-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {/* Logo pequeño SOLO para móvil */}
                <div className="topbar-logo-mobile">
                  <img
                    src={appLogo}
                    alt="Logo de la app"
                    style={{
                      height: 22,
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* Contenedor del input + sugerencias */}
                <div style={{ flex: 1, position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Buscar dirección o zona"
                    value={searchText}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    style={{
                      width: "100%",
                      padding: "7px 12px",
                      borderRadius: "999px",
                      border: "1px solid #ddd",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />

                  {/* lista de sugerencias */}
                  {suggestions.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "110%",
                        left: 0,
                        right: 0,
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        zIndex: 20,
                        maxHeight: "220px",
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
                            padding: "8px 10px",
                            border: "none",
                            background: "none",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          {p.description}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FILA 2: texto + chips de tiempo */}
            <div
              style={{
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#666",
                  fontWeight: 500,
                }}
              >
                Ver reportes de:
              </span>

              {TIME_WINDOWS.map((w) => {
                const isActive = w.id === selectedWindow;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => onSelectWindow(w.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      border: isActive ? "none" : "1px solid #ddd",
                      backgroundColor: isActive ? "#1565c0" : "#f5f5f5",
                      color: isActive ? "#ffffff" : "#333333",
                      fontSize: "12px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {w.label}
                  </button>
                );
              })}
            </div>

            {/* FILA 3: filtros por tipo de reporte */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "2px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#666",
                  fontWeight: 500,
                }}
              >
                Tipo de reporte:
              </span>

              {[
                { id: "all", label: "Todos" },
                { id: "delito", label: "Delitos" },
                { id: "conducta_sospechosa", label: "Sospechas" },
                { id: "riesgo_entorno", label: "Riesgos del entorno" },
              ].map((opt) => {
                const isActive = opt.id === categoryFilter;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeCategoryFilter(opt.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      border: isActive ? "none" : "1px solid #ddd",
                      backgroundColor: isActive ? "#1565c0" : "#f5f5f5",
                      color: isActive ? "#ffffff" : "#333333",
                      fontSize: "12px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------- PÁGINA PRINCIPAL -----------------

const DEFAULT_CENTER = { lat: -11.9693, lng: -77.0014 };

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [position, setPosition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState("48h");
  const [categoryFilter, setCategoryFilter] = useState("all");


  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(14);
  const [userLocation, setUserLocation] = useState(null);

  const { reports, refresh } = useReports({ intervalMs: 30000, timeWindow, });

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pedir ubicación al cargar
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(coords);
          setMapCenter(coords);
          setMapZoom(16); // zoom cercano al inicio
        },
        (err) => {
          console.warn("No se pudo obtener ubicación:", err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleMapClick = (pos) => {
    setSelectedPosition(pos);
  };

  const handleSubmitReport = async (report) => {
    try {
      await createReport(report); 
      await refresh();
      setPosition(null); // cerrar modal
    } catch (error) {
      console.error("Error al crear reporte:", error);
      alert("Error al enviar el reporte. Por favor intenta de nuevo.");
    }
  };

  const handleOpenReportFromButton = () => {
    if (!selectedCategory) setSelectedCategory("robo_asalto");
    const basePos =
      selectedPosition ||
      userLocation ||
      mapCenter ||
      DEFAULT_CENTER;

    setPosition(basePos);;
  };

  // Buscar dirección con Geocoder de Google Maps
  const handleSearchAddress = (query) => {
    if (!window.google || !window.google.maps) {
      console.warn("Google Maps todavía no está listo");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === "OK" && results[0]) {
        const loc = results[0].geometry.location;
        const newCenter = { lat: loc.lat(), lng: loc.lng() };

        setMapCenter(newCenter);
        setMapZoom(16);

        setSelectedPosition(newCenter);

      } else {
        alert("No se encontró la dirección indicada.");
      }
    });
  };

  const handleRecenterToUser = () => {
    if (userLocation) {
      setMapCenter({
        lat: userLocation.lat,
        lng: userLocation.lng,
      });
      setMapZoom(16);
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(coords);
          setMapCenter(coords);
          setMapZoom(16);
        },
        (err) => {
          console.warn("No se pudo obtener ubicación:", err);
          alert("No se pudo obtener tu ubicación actual.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Tu navegador no soporta geolocalización.");
    }
  };

  const filteredReports = reports.filter((report) => {
    if (categoryFilter === "all") return true;

    const cat = getCategory(report.category);
    if (!cat) return false;

    return cat.group === categoryFilter;
  });

  const mapMarkers = filteredReports.map((report) => ({
    id: report.id,
    position: {
      lat: Number(report.lat),
      lng: Number(report.lng),
    },
    category: report.category,
    comment: report.comment,
    created_at: report.created_at,
  }));
  console.log("markers para el mapa:", mapMarkers);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}

      <TopBar
        selectedWindow={timeWindow}
        onSelectWindow={setTimeWindow}
        onSearchAddress={handleSearchAddress}
        categoryFilter={categoryFilter}
        onChangeCategoryFilter={setCategoryFilter}
      />

      {/* mapa */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapView
          markers={mapMarkers}
          currentCategory={selectedCategory}
          onMapClick={handleMapClick}
          center={mapCenter}
          userLocation={userLocation}
          zoom={mapZoom}
          selectedPosition={selectedPosition}
          onZoomChanged={setMapZoom}
        />

        {/* Botón flotante centrado abajo */}
        <button
          type="button"
          onClick={handleOpenReportFromButton}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "16px",
            transform: "translateX(-50%)",
            padding: "16px 18px",
            borderRadius: "999px",
            border: "none",
            backgroundColor: "#e53935",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "16px",
            letterSpacing: "0.03em",
            cursor: "pointer",
            boxShadow: "0 3px 8px rgba(229,57,53,0.35)",
            whiteSpace: "nowrap",
          }}
        >
          Reportar incidente
        </button>

        {/* Botón Mi ubicación (icono) */}
        <button
          type="button"
          onClick={handleRecenterToUser}
          style={{
            position: "absolute",
            left: "16px",
            bottom: "16px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid #1565c0",
            backgroundColor: "#ffffff",
            color: "#1565c0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          <FaLocationArrow size={18} />
        </button>
      </div>

      {/* Modal de reporte: ahora SOLO depende de position */}
      {position && (
        <ReportModal
          position={position}
          onSubmit={handleSubmitReport}
          onCancel={() => {
            setPosition(null);
          }}
        />
      )}
    </div>
  );
};

export default HomePage;