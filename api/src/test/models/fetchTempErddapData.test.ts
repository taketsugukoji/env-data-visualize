import axios from "axios";
import {
  ERDDAPResponse,
  StatsContainedResponse,
} from "../constants/temperature";
import { analyzeRowsTest } from "../services/analyzeRows.test";
import { erddapUrlPrefix } from "../constants/erddap";

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

  const ERDDAP_URL = `${erddapUrlPrefix}[${dateString}][${latString}][${lonString}]`;

  try {
    const response = await axios.get<ERDDAPResponse>(ERDDAP_URL);
    const data = response.data;

    const { rows } = data.table;

    return {
      table: data.table,
      stats: analyzeRowsTest(rows),
    };
  } catch (error) {
    throw error;
  }
};

export default { fetchData };
