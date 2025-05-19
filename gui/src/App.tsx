import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TempSpatialView from "./pages/TempSpatialView.tsx";
import TempTemporalView from "./pages/TempTemporalView.tsx";
import TabBar from "./components/TabBar.tsx";

function App() {
  return (
    <BrowserRouter>
      <TabBar />
      <Routes>
        <Route path="/" element={<Navigate to="/temp" replace />} />
        <Route path="/temp" element={<TempSpatialView />} />
        <Route path="/temp/timeSeries" element={<TempTemporalView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
