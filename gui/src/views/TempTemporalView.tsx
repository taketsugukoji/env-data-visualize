import { useEffect, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import MapComponent from "../components/MapComponent";
import { useFetchData } from "../hooks/UseFetchData";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
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
} from "../constants/date";
import TemperatureChart from "../components/TemperatureChart";

const TempTemporalView = () => {
  const [startDate, setStartDate] = useState<Dayjs>(defaultDateOfTemporal);
  const [endDate, setEndDate] = useState<Dayjs>(oneMonthAgo);
  const [latRange, setLatRange] = useState(defaultLatRangeOfTemporal);
  const [lonRange, setLonRange] = useState(defaultLonRangeOfTemporal);
  const [isSelectingPoint, setIsSelecting] = useState(false);
  const [chartData, setChartData] = useState<
    { month: string; temperature: number }[]
  >([]);

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
      data.table.rows.map(([month, , , temp]) => {
        const date = new Date(month);
        const formattedMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        return {
          month: formattedMonth,
          temperature: temp,
        };
      }),
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
              onChange={(newValue) => setStartDate(newValue as Dayjs)}
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
      {chartData.length > 0 && <TemperatureChart chartData={chartData} />}
    </Box>
  );
};

export default TempTemporalView;
