import { Router } from "express";
import { PlanController } from "../controllers/PlanController.js";

const router = Router();

// Plan routes
router.get("/plan", PlanController.getPlans);
// remove extra "id" segment for clarity
router.get("/plan/:planId/predictions/today", PlanController.getplanPredictionsToday);
router.post("/plan", PlanController.createPlan);

export default router;