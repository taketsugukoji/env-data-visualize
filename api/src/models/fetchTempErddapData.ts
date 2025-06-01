import axios from "axios";
import {
  ERDDAPResponse,
  StatsContainedResponse,
} from "../constants/temperature";
import { analyzeRows } from "../services/analyzeRows";
import { erddapUrlPrefix } from "../constants/erddap";
import { HttpError } from "../errors/HttpError";

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
    // レスポンスに欠損値が含まれていることがあるため null を除外
    const nullFilteredRows = rows.filter(([, , , temp]) => temp != null);

    return {
      table: { ...data.table, rows: nullFilteredRows },
      stats: analyzeRows(nullFilteredRows),
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;
      const message = error.response.data?.message || error.message;
      throw new HttpError(message, status);
    } else {
      throw new HttpError("ERDDAPにアクセスできませんでした", 502);
    }
  }
};

export default { fetchData };
