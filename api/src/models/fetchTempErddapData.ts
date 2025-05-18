import axios from "axios";

type Row = [string, number, number, number];

type ERDDAPResponse = {
  table: {
    columnNames: ["time", "latitude", "longitude", "sea_surface_temperature"];
    columnTypes: ["String", "float", "float", "float"];
    columnUnits: ["UTC", "degrees_north", "degrees_east", "degree_C"];
    rows: Row[];
  };
};

type Stats = { minRow: Row; maxRow: Row; avg: number; median: number };

type StatsContainedResponse = {
  table: ERDDAPResponse["table"];
  stats: Stats;
};

function downsampleRows<T>(rows: T[], step: number): T[] {
  return rows.filter((_, index) => index % step === 0);
}

const fetchData = async (
  lat: { start: number; end: number },
  lon: { start: number; end: number },
  date: { start: Date; end: Date },
): Promise<StatsContainedResponse> => {
  const latString =
    lat.start === lat.end ? `(${lat.start})` : `(${lat.start}):(${lat.end})`;
  const lonString =
    lon.start === lon.end ? `(${lon.start})` : `(${lon.start}):(${lon.end})`;
  const dateStartStr = date.start.toISOString();
  const dateEndStr = date.end.toISOString();
  const dateString =
    dateStartStr === dateEndStr
      ? `(${dateStartStr})`
      : `(${dateStartStr}):(${dateEndStr})`;

  const ERDDAP_URL = `https://coastwatch.pfeg.noaa.gov/erddap/griddap/NOAA_DHW_monthly.json?sea_surface_temperature[${dateString}][${latString}][${lonString}]`;

  try {
    const response = await axios.get<ERDDAPResponse>(ERDDAP_URL);

    const data = response.data;
    const downsampledTableData = {
      table: {
        ...response.data.table,
        rows: downsampleRows(response.data.table.rows, 1),
      },
    };

    const { rows } = downsampledTableData.table;

    function analyzeRows(rows: ERDDAPResponse["table"]["rows"]) {
      // 値だけ取り出す、null含まれてることあるためnull除外
      const temps = rows
        .filter(([, , , temp]) => temp != null)
        .map(([, , , temp]) => temp);

      // min/maxの行
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);

      const minRow = rows.find((row) => row[3] === minTemp)!;
      const maxRow = rows.find((row) => row[3] === maxTemp)!;

      // 平均に最も近い行
      const avg = temps.reduce((sum, val) => sum + val, 0) / temps.length;

      // 中央値の行（中央値と一致する or 近い値）
      const sortedTemps = [...temps].sort((a, b) => a - b);
      const median =
        temps.length % 2 === 0
          ? (sortedTemps[temps.length / 2 - 1] +
              sortedTemps[temps.length / 2]) /
            2
          : sortedTemps[Math.floor(temps.length / 2)];

      return {
        minRow,
        maxRow,
        avg,
        median,
      };
    }

    return {
      table: downsampledTableData.table,
      stats: analyzeRows(rows),
    };
  } catch (error) {
    throw error;
  }
};

export default { fetchData };
