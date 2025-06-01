export type Row = [string, number, number, number];

export type ERDDAPResponse = {
  table: {
    columnNames: ["time", "latitude", "longitude", "sea_surface_temperature"];
    columnTypes: ["String", "float", "float", "float"];
    columnUnits: ["UTC", "degrees_north", "degrees_east", "degree_C"];
    rows: Row[];
  };
};

export type Stats = { minRow: Row; maxRow: Row; avg: number; median: number };

export type StatsContainedResponse = {
  table: ERDDAPResponse["table"];
  stats: Stats;
};
