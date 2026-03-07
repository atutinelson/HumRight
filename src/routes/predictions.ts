import { Router } from "express";
import { PredictionController } from "../controllers/PredictionController.js";

const router = Router();

// Prediction routes
router.get("/:day", PredictionController.getPredictionBasedOnDate);
router.post("/create", PredictionController.createPrediction);

export default router;