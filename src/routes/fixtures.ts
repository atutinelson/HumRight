import { Router } from "express";
import { FixtureController } from "../controllers/FixtureController.js";

const router = Router();

// Fixture routes
router.post("/create", FixtureController.createFixture);
router.get("/by-date", FixtureController.getFixturesByDate);

export default router;