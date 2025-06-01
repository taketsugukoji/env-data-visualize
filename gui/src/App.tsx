import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TempSpatialView from "./views/TempSpatialView.tsx";
import TempTemporalView from "./views/TempTemporalView.tsx";
import TabBar from "./components/TabBar.tsx";

function App() {
  return (
    <BrowserRouter>
      <TabBar />
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/temperature/spatial" replace />}
        />
        <Route path="/temperature/spatial" element={<TempSpatialView />} />
        <Route path="/temperature/temporal" element={<TempTemporalView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
