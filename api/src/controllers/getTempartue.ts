import { Request, Response } from "express";
import fetchTempErddapData from "../models/fetchTempErddapData";

const getTempartue = async (req: Request, res: Response): Promise<void> => {
  const latStart = Number(req.query.latStart);
  const latEnd = Number(req.query.latEnd);
  const lonStart = Number(req.query.lonStart);
  const lonEnd = Number(req.query.lonEnd);

  // TODO: 番号で返す、あとdateの型変換、latlonみたいに分けるかも考える
  if (
    typeof req.query.dateStart !== "string" ||
    typeof req.query.dateEnd !== "string"
  ) {
    throw new Error("指定したdateの型が不正です");
  }

  const lat: { start: number; end: number } = { start: latStart, end: latEnd };
  const lon: { start: number; end: number } = { start: lonStart, end: lonEnd };
  const date = {
    start: new Date(req.query.dateStart),
    end: new Date(req.query.dateEnd),
  };

  try {
    const data = await fetchTempErddapData.fetchData(lat, lon, date);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// TODO: typoあとで直す
export default { getTempartue };
