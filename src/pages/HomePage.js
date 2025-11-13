import React, { useState } from "react";
import MapView from "../components/MapView";
import CategoryBar from "../components/CategoryBar";
import ReportModal from "../components/ReportModal";
import FloatingLoginButton from "../components/FloatingLoginButton";
import FloatingReportButton from "../components/FloatingReportButton";
import LoadingScreen from "../components/LoadingScreen";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null); // categoría actual
  const [position, setPosition] = useState(null); // última posición clickeada en el mapa
  const [reports, setReports] = useState([]); // reportes ya enviados (se muestran como markers)
  const [loading, setLoading] = useState(true);

  const handleMarkerClickEvent = (marker) => {
    console.log("IMPRIMIR EVENTO:", marker);
    // acá haces lo que quieras: abrir modal, enviar a consola, etc.
  };

  // el mapa me manda directamente {lat, lng}
  const handleMapClick = (pos) => {
    // si quieres que solo se abra modal cuando hay categoría
    if (selectedCategory) {
      setPosition(pos);
    } else {
      // si no hay categoría igual guardo la posición temporal
      setPosition(pos);
    }
  };

  const handleSubmitReport = (report) => {
    const reportWithId = {
      id: Date.now(),
      ...report,
    };
    setReports((prev) => [...prev, reportWithId]);
    // limpio los temporales
    setSelectedCategory(null);
    setPosition(null);
  };

  // botón flotante abre el modal aunque no hayas clickeado el mapa
  const handleOpenReportFromButton = () => {
    if (!selectedCategory) setSelectedCategory("robo");
    if (!position) setPosition({ lat: -12.0553, lng: -76.9468 }); // default
  };

  return (
    <>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}

      <MapView
        markers={reports}
        currentCategory={selectedCategory}
        onMapClick={handleMapClick}
        onMarkerClickEvent={handleMarkerClickEvent}
      />;
    
      <FloatingLoginButton />
      <FloatingReportButton onOpenReport={handleOpenReportFromButton} />

      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {position && selectedCategory && (
        <ReportModal
          selectedCategory={selectedCategory}
          position={position}
          onSubmit={handleSubmitReport}
          onCancel={() => {
            setPosition(null);
            setSelectedCategory(null);
          }}
        />
      )}
    </>
  );
};

export default HomePage;
