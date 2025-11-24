import React, { useState, useEffect } from "react";
import { CATEGORIES, CATEGORY_GROUPS, } from "../constants/categories";

const ReportModal = ({ position, onSubmit, onCancel }) => {
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [timeStatus, setTimeStatus] = useState("en_curso");

  const [address, setAddress] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [confirmLocation, setConfirmLocation] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const hasPosition =
    position &&
    typeof position.lat === "number" &&
    typeof position.lng === "number";

  useEffect(() => {
    if (!hasPosition) {
      setAddress("");
      return;
    }
    if (!window.google || !window.google.maps) return;

    setAddressLoading(true);
    setAddress("");

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: position.lat, lng: position.lng } },
      (results, status) => {
        if (status === "OK" && results && results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress("");
        }
        setAddressLoading(false);
      }
    );
  }, [hasPosition, position?.lat, position?.lng]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasPosition) return;

    if (!categoryId) {
      alert("Por favor selecciona una categoría.");
      return;
    }
    if (!comment.trim()) {
      alert("Por favor describe brevemente lo ocurrido.");
      return;
    }
    if (!confirmLocation) {
      alert("Por favor confirma que la ubicación en el mapa es correcta.");
      return;
    }

    onSubmit({
      position,
      category: categoryId,
      comment: comment.trim(),
      time_status: timeStatus,
    });

    setComment("");
    setCategoryId(null);
    setTimeStatus("en_curso");
    setConfirmLocation(false);
  };

  // agrupar categorías por group
  const categoriesByGroup = Object.values(CATEGORIES).reduce((acc, cat) => {
    if (!acc[cat.group]) acc[cat.group] = [];
    acc[cat.group].push(cat);
    return acc;
  }, {});

  const renderCoords = () => {
    if (!hasPosition) return "sin ubicación";
    return `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`;
  };

  return (
    <div style={styles.overlay}>
      <div
        style={{
          ...styles.modal,
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.9)",
        }}
      >
        <h3 style={styles.title}>Nuevo reporte</h3>

        <p style={styles.coords}>
          Ubicación seleccionada: <strong>{renderCoords()}</strong>
        </p>

        {/* Dirección aproximada + confirmación */}
        <div style={styles.section}>
          <p style={styles.sectionTitle}>Dirección aproximada</p>
          <div style={styles.addressBox}>
            {addressLoading && "Buscando dirección aproximada..."}
            {!addressLoading && address && (
              <span>
                Cerca de: <strong>{address}</strong>
              </span>
            )}
            {!addressLoading && !address && hasPosition && (
              <span>No se pudo obtener la dirección. Se usará solo la ubicación del mapa.</span>
            )}
            {!hasPosition && !addressLoading && (
              <span>Sin ubicación seleccionada.</span>
            )}
          </div>

          <label style={styles.confirmRow}>
            <input
              type="checkbox"
              checked={confirmLocation}
              onChange={(e) => setConfirmLocation(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            <span style={{ fontSize: 12, color: "#555" }}>
              Confirmo que el punto en el mapa corresponde al lugar del incidente.
            </span>
          </label>
        </div>

        {/* Selección de categoría */}
        <div style={styles.section}>
          <p style={styles.sectionTitle}>¿Qué quieres reportar?</p>

          {Object.values(CATEGORY_GROUPS).map((group) => (
            <div key={group.id} style={{ marginBottom: 8 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: group.color,
                  marginBottom: 4,
                }}
              >
                {group.label}
              </p>
              <div style={styles.chipsRow}>
                {(categoriesByGroup[group.id] || []).map((cat) => {
                  const isActive = cat.id === categoryId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryId(cat.id)}
                      style={{
                        ...styles.chip,
                        backgroundColor: isActive ? cat.color : "#f5f5f5",
                        color: isActive ? "#ffffff" : "#333",
                        borderColor: isActive ? cat.color : "#ddd",
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Cuándo ocurrió */}
        <div style={styles.section}>
          <p style={styles.sectionTitle}>¿Cuándo ocurrió?</p>
          <div style={styles.chipsRow}>
            {[
              { id: "en_curso", label: "Está ocurriendo ahora" },
              { id: "menos_1h", label: "Hace menos de 1 hora" },
              { id: "hoy", label: "Hace horas (hoy)" },
              { id: "dias_anteriores", label: "Hace unos días" },
            ].map((opt) => {
              const isActive = opt.id === timeStatus;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTimeStatus(opt.id)}
                  style={{
                    ...styles.chip,
                    backgroundColor: isActive ? "#1976d2" : "#f5f5f5",
                    color: isActive ? "#ffffff" : "#333",
                    borderColor: isActive ? "#1976d2" : "#ddd",
                    fontSize: 11,
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Descripción */}
        <textarea
          style={styles.textarea}
          placeholder="Describe brevemente lo ocurrido (sin datos personales)…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div style={styles.buttons}>
          <button
            style={{
              ...styles.sendBtn,
              opacity: hasPosition ? 1 : 0.5,
              pointerEvents: hasPosition ? "auto" : "none",
            }}
            onClick={handleSubmit}
          >
            Enviar reporte
          </button>
          <button
            style={styles.cancelBtn}
            onClick={() => {
              setConfirmLocation(false);
              onCancel();
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    boxSizing: "border-box",
    overflowY: "auto",
  },
  modal: {
    position: "relative",
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "100%",
    overflowY: "auto",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    textAlign: "left",
    opacity: 0,
    transition: "all 0.25s ease",
  },
  title: {
    marginBottom: 8,
    color: "#1976d2",
    fontSize: 18,
    textAlign: "center",
  },
  coords: {
    fontSize: 12,
    marginBottom: 10,
    color: "#555",
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 4,
  },
  chipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    padding: "5px 10px",
    borderRadius: 999,
    border: "1px solid #ddd",
    background: "#f5f5f5",
    fontSize: 12,
    cursor: "pointer",
  },
  addressBox: {
    marginTop: 2,
    padding: "6px 8px",
    borderRadius: 6,
    background: "#f5f5f5",
    fontSize: 12,
    color: "#444",
  },
  confirmRow: {
    marginTop: 6,
    display: "flex",
    alignItems: "center",
  },
  textarea: {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    minHeight: 90,
    maxHeight: 160,
    overflowY: "auto",
    padding: "10px",
    borderRadius: 8,
    border: "1px solid #ccc",
    resize: "vertical",
    marginTop: 6,
    marginBottom: 12,
    fontFamily: "inherit",
    fontSize: 13,
    lineHeight: 1.4,
    outline: "none",
    background: "#fff",
  },
  buttons: {
    display: "flex",
    gap: 10,
    justifyContent: "space-between",
  },
  sendBtn: {
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    flex: 1,
    fontWeight: 500,
  },
  cancelBtn: {
    background: "#f44336",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    flex: 1,
    fontWeight: 500,
  },
};

export default ReportModal;
