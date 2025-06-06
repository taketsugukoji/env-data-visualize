import { useState } from "react";
import MapComponent from "../components/MapComponent";
import { useFetchData } from "../hooks/UseFetchData";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  defaultLatRangeOfSpatial,
  defaultLonRangeOfSpatial,
  LatLonRange,
  oneMonthAgo,
  serviceStartedDate,
} from "../constants/date";
import StatsInfo from "../components/StatsInfo";

const TempSpatialView = () => {
  const [date, setDate] = useState<Dayjs>(oneMonthAgo);
  const [latRange, setLatRange] = useState(defaultLatRangeOfSpatial);
  const [lonRange, setLonRange] = useState(defaultLonRangeOfSpatial);
  const [isSelecting, setIsSelecting] = useState(false);

  const { data, isLoading, error, execute } = useFetchData();

  const handleSetFormPos = (lng: LatLonRange, lat: LatLonRange) => {
    setLonRange(lng);
    setLatRange(lat);
  };

  const handleFetchData = () => {
    execute({
      lat: latRange,
      lon: lonRange,
      date: { start: date.toDate(), end: date.toDate() },
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        海面水温取得
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography>日付: </Typography>
            <DatePicker
              views={["year", "month"]}
              minDate={serviceStartedDate}
              maxDate={oneMonthAgo}
              value={date}
              onChange={(newValue) => setDate(newValue as Dayjs)}
            />
          </Box>
        </LocalizationProvider>

        <Box display="grid" alignItems="center" gap={2} mb={2}>
          <Typography>範囲: </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                fullWidth
                label="緯度開始"
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
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                fullWidth
                label="緯度終了"
                type="number"
                value={latRange.end}
                onChange={(e) =>
                  setLatRange({ ...latRange, end: parseFloat(e.target.value) })
                }
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                fullWidth
                label="経度開始"
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
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                fullWidth
                label="経度終了"
                type="number"
                value={lonRange.end}
                onChange={(e) =>
                  setLonRange({ ...lonRange, end: parseFloat(e.target.value) })
                }
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setIsSelecting(true)}
          >
            ドラッグして範囲選択
          </Button>
          <Button variant="contained" onClick={handleFetchData}>
            データ取得
          </Button>
        </Box>
      </Paper>

      {isSelecting && (
        <Alert severity="info" sx={{ mb: 2 }}>
          地図上をドラッグして範囲選択すると緯度経度が反映されます。
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
        isSelecting={isSelecting}
        isSelectingPoint={false}
        setIsSelecting={setIsSelecting}
        setFormPos={handleSetFormPos}
      />

      {data && <StatsInfo stats={data.stats} />}
    </Box>
  );
};

export default TempSpatialView;
