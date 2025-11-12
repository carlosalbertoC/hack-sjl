import React, { useState, useEffect } from "react";
import MapView from "../components/MapView";
import CategoryBar from "../components/CategoryBar";
import ReportModal from "../components/ReportModal";
import FloatingReportButton from "../components/FloatingReportButton";
import LoadingScreen from "../components/LoadingScreen";
import { createReport } from "../services/api";
import useReports from "../hooks/useReports";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null); // categoría actual
  const [position, setPosition] = useState(null); // última posición clickeada en el mapa
  const [loading, setLoading] = useState(true);
  
  // Obtener reportes de las últimas 48 horas
  const { reports, refresh } = useReports({ intervalMs: 30000 });

  useEffect(() => {
    // Cargar reportes al montar
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSubmitReport = async (report) => {
    try {
      // Guardar en el servicio API
      const newReport = await createReport({
        lat: report.position.lat,
        lng: report.position.lng,
        category: report.category,
        comment: report.comment,
        imagesUrls: []
      });
      
      // Actualizar lista de reportes
      await refresh();
      
      // limpio los temporales
      setSelectedCategory(null);
      setPosition(null);
    } catch (error) {
      console.error("Error al crear reporte:", error);
      alert("Error al enviar el reporte. Por favor intenta de nuevo.");
    }
  };

  // botón flotante abre el modal aunque no hayas clickeado el mapa
  const handleOpenReportFromButton = () => {
    if (!selectedCategory) setSelectedCategory("robo");
    if (!position) setPosition({ lat: -12.0553, lng: -76.9468 }); // default SJL
  };

  // Convertir reportes al formato que espera MapView
  const mapMarkers = reports.map(report => ({
    id: report.id,
    position: { lat: report.lat, lng: report.lng },
    category: report.category,
    comment: report.comment,
    created_at: report.created_at,
  }));

  return (
    <>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}

      <MapView
        markers={mapMarkers}
        currentCategory={selectedCategory}
        onMapClick={handleMapClick}
      />
    
      <FloatingReportButton onOpenReport={handleOpenReportFromButton} />

      <CategoryBar onSelectCategory={setSelectedCategory} />

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

