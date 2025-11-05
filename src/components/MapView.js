import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { FaHandHoldingUsd, FaExclamationTriangle, FaSkull, FaUserSecret } from "react-icons/fa";

const containerStyle = { width: "100vw", height: "100vh" };
const center = { lat: -12.0553, lng: -76.9468 };

const icons = {
  robo: <FaHandHoldingUsd color="#e53935" />,
  balacera: <FaExclamationTriangle color="#ff9800" />,
  drogas: <FaSkull color="#8e24aa" />,
  sospechoso: <FaUserSecret color="#1565c0" />,
};

const MapView = ({ reports, onMapClick }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onClick={(e) => {
          setSelectedReport(null);
          onMapClick(e);
        }}
      >
        {reports.map((r, i) => (
          <Marker
            key={i}
            position={r.position}
            onClick={() => setSelectedReport(r)}
          />
        ))}

        {selectedReport && (
          <InfoWindow
            position={selectedReport.position}
            onCloseClick={() => setSelectedReport(null)}
          >
            <div style={styles.infoBox}>
              <div style={styles.header}>
                {icons[selectedReport.category]}
                <h4 style={styles.title}>{selectedReport.category.toUpperCase()}</h4>
              </div>
              <p style={styles.comment}>{selectedReport.comment}</p>
              <p style={styles.coords}>
                📍 {selectedReport.position.lat.toFixed(4)}, {selectedReport.position.lng.toFixed(4)}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

const styles = {
  infoBox: {
    fontFamily: "Arial",
    padding: "5px 10px",
    width: 200,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 14,
    color: "#1976d2",
    margin: 0,
  },
  comment: {
    fontSize: 13,
    margin: "5px 0",
    color: "#333",
  },
  coords: {
    fontSize: 11,
    color: "#555",
  },
};

export default React.memo(MapView);
