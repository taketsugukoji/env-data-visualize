import express from "express";
import getTemperature from "../controllers/getTemperature";

const router = express.Router();

router.get("/", getTemperature.getTemperature);

export default router;
