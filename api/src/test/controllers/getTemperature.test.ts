import { Request, Response } from "express";
import fetchTempErddapData from "../models/fetchTempErddapData.test";

const getTemperature = async (req: Request, res: Response): Promise<void> => {
  const latStart = Number(req.query.latStart);
  const latEnd = Number(req.query.latEnd);
  const lonStart = Number(req.query.lonStart);
  const lonEnd = Number(req.query.lonEnd);

  if (
    typeof req.query.dateStart !== "string" ||
    typeof req.query.dateEnd !== "string"
  ) {
    throw new Error(
      "dateStart, dateEnd は string にしてリクエストしてください",
    );
  }

  const dateStart = new Date(req.query.dateStart as string);
  const dateEnd = new Date(req.query.dateEnd as string);

  const lat: { start: number; end: number } = { start: latStart, end: latEnd };
  const lon: { start: number; end: number } = { start: lonStart, end: lonEnd };
  const date: { start: Date; end: Date } = {
    start: dateStart,
    end: dateEnd,
  };

  try {
    const data = await fetchTempErddapData.fetchData(lat, lon, date);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default { getTemperature };
