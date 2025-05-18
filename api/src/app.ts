import express from "express";
import getTemperature from "./routes/getTemperature";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/getTemp", getTemperature);

export default app;
