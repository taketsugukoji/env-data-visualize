import { useCallback, useState } from "react";
import { DateRange, LatLonRange } from "../constants/date.ts";

export interface FetchDataArgs {
  lat: LatLonRange;
  lon: LatLonRange;
  date: DateRange;
}

type Row = [string, number, number, number];

export type ERDDAPResponse = {
  table: {
    columnNames: ["time", "latitude", "longitude", "sea_surface_temperature"];
    columnTypes: ["String", "float", "float", "float"];
    columnUnits: ["UTC", "degrees_north", "degrees_east", "degree_C"];
    rows: Row[];
  };
};

type Stats = { minRow: Row; maxRow: Row; avg: number; median: number };

export type StatsContainedResponse = {
  table: ERDDAPResponse["table"];
  stats: Stats;
};

interface FetchDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  execute: (input: FetchDataArgs) => void;
}

export const useFetchData = (): FetchDataResult<StatsContainedResponse> => {
  const [data, setData] = useState<StatsContainedResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (input: FetchDataArgs) => {
    const queryParams = new URLSearchParams({
      latStart: input.lat.start.toString(),
      latEnd: input.lat.end.toString(),
      lonStart: input.lon.start.toString(),
      lonEnd: input.lon.end.toString(),
      dateStart: input.date.start.toISOString(),
      dateEnd: input.date.end.toISOString(),
    });

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/getTemp?${queryParams}`,
      );
      if (!response.ok) {
        throw new Error("fetch failed");
      }
      const result: StatsContainedResponse = await response.json();
      setData(result);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { data, isLoading, error, execute };
};
