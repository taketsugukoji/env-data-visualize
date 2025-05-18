import express from "express";
import getTempartue from "../controllers/getTempartue";

const router = express.Router();

router.get("/", getTempartue.getTempartue);

export default router;
