import { PrismaClient } from "@prisma/client";
import * as mpesaService from "../services/mpesaService.js";
const prisma = new PrismaClient();
export class PaymentController {
    static async initiate(req, res) {
        try {
            const { phoneNumber, predictionId } = req.body;
            console.log("Initiating payment for prediction ID:", predictionId, "to mobile number:", phoneNumber);
            if (!phoneNumber || !predictionId) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            const prediction = await prisma.prediction.findUnique({
                where: { id: predictionId },
            });
            if (!prediction) {
                return res.status(404).json({ error: "Prediction not found" });
            }
            // fetch plan to determine amount
            const plan = await prisma.tipPlan.findUnique({
                where: { id: prediction.planId },
            });
            if (!plan) {
                return res.status(404).json({ error: "Associated plan not found" });
            }
            const amount = plan.price;
            const stkResponse = await mpesaService.initiateStkPush(phoneNumber, amount, `PRED${predictionId}`);
            const payment = await prisma.payment.create({
                data: {
                    mobileNumber: phoneNumber,
                    mpesaRequestId: stkResponse.CheckoutRequestID,
                    amount,
                    status: "PENDING",
                    plan: {
                        connect: { id: plan.id },
                    },
                    prediction: {
                        connect: { id: predictionId },
                    },
                },
            });
            return res.json({ success: true, payment, stkResponse });
        }
        catch (error) {
            console.error("initiate payment error", error);
            return res.status(500).json({ success: false, error: "Failed to initiate payment" });
        }
    }
    static async callback(req, res) {
        try {
            const body = req.body;
            // Safaricom nest JSON inside Body.stkCallback
            const callback = body.Body?.stkCallback;
            if (!callback) {
                return res.status(400).json({ error: "Invalid callback payload" });
            }
            const { CheckoutRequestID, ResultCode } = callback;
            const payment = await prisma.payment.findUnique({
                where: { mpesaRequestId: CheckoutRequestID },
            });
            if (!payment) {
                console.log("callback received for unknown request id", CheckoutRequestID);
                return res.status(404).json({ error: "Payment record not found" });
            }
            if (ResultCode === 0) {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: "SUCCESS" },
                });
                // Optionally return prediction details
                const prediction = await prisma.prediction.findUnique({
                    where: { id: payment.predictionId },
                });
                // TODO: deliver prediction via chosen channel
                return res.json({ success: true, prediction });
            }
            else {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: "FAILED" },
                });
                return res.json({ success: false });
            }
        }
        catch (error) {
            console.error("mpesa callback error", error);
            return res.status(500).json({ error: "Callback processing failed" });
        }
    }
}
//# sourceMappingURL=paymentController.js.map