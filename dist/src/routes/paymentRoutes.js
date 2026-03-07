import { Router } from "express";
import { PaymentController } from "../controllers/paymentController.js";
const router = Router();
// Initiate STK Push
router.post("/mpesa/stk", PaymentController.initiate);
// Callback endpoint
router.post("/mpesa/callback", PaymentController.callback);
export default router;
//# sourceMappingURL=paymentRoutes.js.map