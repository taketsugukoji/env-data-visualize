import { useEffect, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import MapComponent from "../components/MapComponent.tsx";
import { useFetchData } from "../hooks/UseFetchData.tsx";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import {
  defaultDateOfTemporal,
  defaultLatRangeOfTemporal,
  defaultLonRangeOfTemporal,
  LatLonRange,
  oneMonthAgo,
  serviceStartedDate,
} from "../constants/date.ts";

const TempTemporalView = () => {
  const [startDate, setStartDate] = useState<Dayjs>(defaultDateOfTemporal);
  const [endDate, setEndDate] = useState<Dayjs>(oneMonthAgo);
  const [latRange, setLatRange] = useState(defaultLatRangeOfTemporal);
  const [lonRange, setLonRange] = useState(defaultLonRangeOfTemporal);
  const [isSelectingPoint, setIsSelecting] = useState(false);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    [],
  );

  const { data, isLoading, error, execute } = useFetchData();

  const handleSetFormPos = (lng: LatLonRange, lat: LatLonRange) => {
    setLonRange({ ...lng, end: lng.start });
    setLatRange({ ...lat, end: lat.start });
  };

  const handleSetIsSelecting = (state: boolean) => {
    setIsSelecting(state);
  };

  const handleFetchData = () => {
    execute({
      lat: latRange,
      lon: lonRange,
      date: { start: startDate?.toDate(), end: endDate?.toDate() },
    });
  };

  useEffect(() => {
    if (!data) return;
    setChartData(
      data.table.rows.map(([month, , , temp]) => ({
        name: month,
        value: temp,
      })),
    );
  }, [data]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        海面水温取得（時系列）
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography>日付範囲: </Typography>
            <DatePicker
              views={["year", "month"]}
              label="開始月"
              minDate={serviceStartedDate}
              maxDate={oneMonthAgo}
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <Typography>〜</Typography>
            <DatePicker
              views={["year", "month"]}
              label="終了月"
              minDate={serviceStartedDate}
              maxDate={oneMonthAgo}
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </Box>
        </LocalizationProvider>

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Typography>地点: </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="緯度"
                type="number"
                value={latRange.start}
                onChange={(e) =>
                  setLatRange({
                    ...latRange,
                    start: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="経度"
                type="number"
                value={lonRange.start}
                onChange={(e) =>
                  setLonRange({
                    ...lonRange,
                    start: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleSetIsSelecting(true)}
          >
            地点選択する
          </Button>
          <Button variant="contained" onClick={handleFetchData}>
            時系列データ取得
          </Button>
        </Box>
      </Paper>

      {isSelectingPoint && (
        <Alert severity="info" sx={{ mb: 2 }}>
          地図上をクリックして地点選択すると緯度経度が反映されます。
        </Alert>
      )}

      {isLoading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          データ読み込み中...
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          データ取得失敗
        </Alert>
      )}
      <MapComponent
        data={data}
        isSelecting={false}
        isSelectingPoint={isSelectingPoint}
        setIsSelecting={handleSetIsSelecting}
        setFormPos={handleSetFormPos}
      />

      {data && (
        <Paper sx={{ p: 2, mt: 4 }}>
          <Typography>
            最低水温: {data.stats.minRow[3]}, 緯度: {data.stats.minRow[1]},
            経度: {data.stats.minRow[2]}
          </Typography>
          <Typography>
            最高水温: {data.stats.maxRow[3]}, 緯度: {data.stats.maxRow[1]},
            経度: {data.stats.maxRow[2]}
          </Typography>
          <Typography>平均値: {data.stats.avg}</Typography>
          <Typography>中央値: {data.stats.median}</Typography>
        </Paper>
      )}

      {chartData.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">水温の時系列グラフ</Typography>
          <LineChart width={800} height={400} data={chartData}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis domain={["dataMin", "dataMax"]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </Box>
      )}
    </Box>
  );
};

export default TempTemporalView;
