import { Tabs, Tab } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const MuiTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 現在のURLでタブ判定
  const currentTab = location.pathname.startsWith("/temp/timeSeries")
    ? "timeSeries"
    : "temp";

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    if (newValue === "temp") navigate("/temp");
    if (newValue === "timeSeries") navigate("/temp/timeSeries");
  };

  return (
    <Tabs
      value={currentTab}
      onChange={handleChange}
      textColor="primary"
      indicatorColor="primary"
      centered
    >
      <Tab label="温度マップ" value="temp" />
      <Tab label="時系列グラフ" value="timeSeries" />
    </Tabs>
  );
};

export default MuiTabBar;
