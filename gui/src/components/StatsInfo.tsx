import { Paper, Typography, Box, Chip } from "@mui/material";
import { Stats } from "../hooks/UseFetchData";

type Props = {
  stats: Stats;
};

const StatsComponent = ({ stats }: Props) => {
  return (
    <Paper sx={{ p: 3, mt: 4 }} elevation={2}>
      <Typography variant="h6" gutterBottom>
        統計情報
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Box
          sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1, mb: 1 }}
        >
          <Chip
            label="最低水温"
            sx={{ backgroundColor: "#2196f3", color: "white" }}
          />
          <Typography>
            {stats.minRow[3]}℃（緯度: {stats.minRow[1]}、経度: {stats.minRow[2]}
            ）
          </Typography>
        </Box>

        <Box
          sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1, mb: 1 }}
        >
          <Chip
            label="最高水温"
            sx={{ backgroundColor: "#f44336", color: "white" }}
          />
          <Typography>
            {stats.maxRow[3]}℃（緯度: {stats.maxRow[1]}、経度: {stats.maxRow[2]}
            ）
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Box
          sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1, mb: 1 }}
        >
          <Chip
            label="平均値"
            sx={{ backgroundColor: "#ffeb3b", color: "black" }}
          />
          <Typography>{stats.avg}℃</Typography>
        </Box>

        <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label="中央値"
            sx={{ backgroundColor: "#4caf50", color: "white" }}
          />
          <Typography>{stats.median}℃</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsComponent;
