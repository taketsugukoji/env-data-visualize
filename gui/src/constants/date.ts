import dayjs from "dayjs";

export const oneMonthAgo = dayjs().subtract(1, "month");
// 参照: https://coastwatch.pfeg.noaa.gov/erddap/info/NOAA_DHW_monthly/index.html
export const serviceStartedDate = dayjs("1985-01");

export type LatLonRange = { start: number; end: number };

export const defaultLatRangeOfSpatial = { start: 40, end: 46 };
export const defaultLonRangeOfSpatial = { start: 150, end: 160 };

export const defaultDateOfTemporal = dayjs("2020-01");

export const defaultLatRangeOfTemporal = { start: 40, end: 40 };
export const defaultLonRangeOfTemporal = { start: 150, end: 150 };

export type DateRange = { start: Date; end: Date };
