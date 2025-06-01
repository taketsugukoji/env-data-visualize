import { Box, Typography } from "@mui/material";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
  Legend,
} from "recharts";

type Props = {
  chartData: { month: string; temperature: number }[];
};

const TemperatureChart = ({ chartData }: Props) => {
  return (
    <Box display="flex" flexDirection="column" gap={2} mt={4}>
      <Typography variant="h6">水温の時系列グラフ</Typography>
      <LineChart width={800} height={400} data={chartData}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="month" />
        <YAxis domain={["dataMin", "dataMax"]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
      </LineChart>
    </Box>
  );
};

export default TemperatureChart;
