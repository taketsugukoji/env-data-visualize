import { Tabs, Tab } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const TabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = location.pathname.startsWith("/temperature/spatial")
    ? "spatial"
    : "temporal";

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    if (newValue === "spatial") navigate("/temperature/spatial");
    if (newValue === "temporal") navigate("/temperature/temporal");
  };

  return (
    <Tabs
      value={currentTab}
      onChange={handleChange}
      textColor="primary"
      indicatorColor="primary"
      centered
    >
      <Tab label="温度マップ" value="spatial" />
      <Tab label="時系列グラフ" value="temporal" />
    </Tabs>
  );
};

export default TabBar;
