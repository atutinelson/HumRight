import { Router } from "express";
import { BetController } from "../controllers/BetController";

const router = Router();

// Bet routes
router.get("/allFreeBets", BetController.getAllFreeBets);
router.get("/:day", BetController.getFreeBets);

export default router;