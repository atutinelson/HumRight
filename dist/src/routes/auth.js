import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
const router = Router();
// Auth routes
router.get("/session", AuthController.getSession);
router.get("/me", AuthController.getMe);
export default router;
//# sourceMappingURL=auth.js.map