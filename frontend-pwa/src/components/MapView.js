import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { createRoot } from "react-dom/client";
import { CATEGORIES, getCategory } from "../constants/categories";

const containerStyle = { width: "100vw", height: "100vh" };
const DEFAULT_CENTER = { lat: -12.0553, lng: -76.9468 };

const MapView = ({
  markers = [],
  currentCategory = null,
  onMapClick = () => {},
}) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [clickMarker, setClickMarker] = useState(null);
  const mapRef = useRef(null);

  const getCustomIcon = (categoryId) => {
    if (!window.google) return undefined;
    const category = getCategory(categoryId);
    if (!category) return undefined;
    
    const IconComponent = category.icon;
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<IconComponent color={category.color} size={24} />);
    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(div.innerHTML),
      scaledSize: new window.google.maps.Size(32, 32),
    };
  };

  const handleMapClickInternal = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };

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

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={DEFAULT_CENTER}
        zoom={15}
        onClick={handleMapClickInternal}
        onLoad={handleOnLoad}
      >
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
                  ? (getCategory(selectedMarker.category)?.label || selectedMarker.category.toUpperCase())
                  : "Posición seleccionada"}
              </h4>
              {selectedMarker.comment && (
                <p style={{ margin: "8px 0", fontSize: "13px" }}>{selectedMarker.comment}</p>
              )}
              <p style={{ fontSize: "11px", color: "#666" }}>
                Lat: {selectedMarker.position.lat.toFixed(5)}, Lng: {selectedMarker.position.lng.toFixed(5)}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView;

