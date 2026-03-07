import { Router } from "express";
import { JackpotController } from "../controllers/JackpotController";

const router = Router();

router.post("/", JackpotController.createJackpot);
router.get("/:name", JackpotController.getJackpotByName);

export default router;