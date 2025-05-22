import { Paper, Typography } from "@mui/material";
import { Stats } from "../hooks/UseFetchData.tsx";

type Props = {
  stats: Stats;
};

const StatsComponent = ({ stats }: Props) => {
  return (
    <Paper sx={{ p: 3, mt: 4 }} elevation={2}>
      <Typography variant="h6" gutterBottom>
        統計情報
      </Typography>
      <Typography>
        最低水温: {stats.minRow[3]}℃（緯度: {stats.minRow[1]}
        、経度: {stats.minRow[2]}）
      </Typography>
      <Typography>
        最高水温: {stats.maxRow[3]}℃（緯度: {stats.maxRow[1]}
        、経度: {stats.maxRow[2]}）
      </Typography>
      <Typography>平均値: {stats.avg}℃</Typography>
      <Typography>中央値: {stats.median}℃</Typography>
    </Paper>
  );
};

export default StatsComponent;
