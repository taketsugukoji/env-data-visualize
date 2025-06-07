import { Request, Response } from "express";
import fetchTempErddapData from "../models/fetchTempErddapData";
import { HttpError } from "../errors/HttpError";

const getTemperature = async (req: Request, res: Response): Promise<void> => {
  try {
    const latStart = Number(req.query.latStart);
    const latEnd = Number(req.query.latEnd);
    const lonStart = Number(req.query.lonStart);
    const lonEnd = Number(req.query.lonEnd);

    // new Dateの引数は string でないとエラーが出るため念のためバリデーションしておく
    if (
      typeof req.query.dateStart !== "string" ||
      typeof req.query.dateEnd !== "string"
    ) {
      res.status(400).json({
        error:
          "リクエストパラメータdateStartとdateEndは文字列である必要があります",
      });
      return;
    }

    const dateStart = new Date(req.query.dateStart as string);
    const dateEnd = new Date(req.query.dateEnd as string);

    const lat: { start: number; end: number } = {
      start: latStart,
      end: latEnd,
    };
    const lon: { start: number; end: number } = {
      start: lonStart,
      end: lonEnd,
    };
    const date: { start: Date; end: Date } = {
      start: dateStart,
      end: dateEnd,
    };

    const data = await fetchTempErddapData.fetchData(lat, lon, date);
    res.json(data);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: "予期しないエラーが発生しました" });
    }
  }
};

export default { getTemperature };
