import React, { useState } from "react";
import MapView from "../components/MapView";
import CategoryBar from "../components/CategoryBar";
import ReportModal from "../components/ReportModal";
import FloatingLoginButton from "../components/FloatingLoginButton";
import LoadingScreen from "../components/LoadingScreen";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [position, setPosition] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleMapClick = (e) => {
    if (selectedCategory) {
      setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const handleSubmitReport = (report) => {
    setReports([...reports, report]);
    setSelectedCategory(null);
    setPosition(null);
  };

  return (
    <>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}

      <MapView reports={reports} onMapClick={handleMapClick} />

      <FloatingLoginButton />
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
