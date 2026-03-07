import { PrismaClient } from "@prisma/client";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { createPredictionSchema } from "../lib/validator.js";
import { z } from "zod";
const prisma = new PrismaClient();
export class PredictionController {
    static async getPredictionBasedOnDate(req, res) {
        try {
            const { day } = req.params;
            const targetDate = day === "today" ? new Date() : day === "yesterday"
                ? new Date(Date.now() - 24 * 60 * 60 * 1000) : day === "tomorrow"
                ? new Date(Date.now() + 24 * 60 * 60 * 1000) : new Date();
            const startOfDay = new Date(targetDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(targetDate);
            endOfDay.setHours(23, 59, 59, 999);
            const freeBets = await prisma.prediction.findMany({
                where: {
                    plan: null,
                    isPublished: true,
                    tipDate: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                },
                include: {
                    fixture: true
                },
                orderBy: {
                    tipDate: "asc"
                }
            });
            return res.json({
                success: true,
                date: startOfDay,
                count: freeBets.length,
                data: freeBets,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch free bets",
            });
        }
    }
    static async createPrediction(req, res) {
        try {
            // Check authentication
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers),
            });
            if (!session) {
                return res.status(401).json({ error: "Unauthorized: Please log in" });
            }
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                },
            });
            if (!user) {
                return res.status(401).json({ error: "User not found" });
            }
            // Check if user is admin
            if (user.role !== "ADMIN") {
                return res.status(403).json({ error: "Forbidden: Only admins can create predictions" });
            }
            // Validate request body - expect fixtureIds array from client
            const clientData = req.body;
            const data = createPredictionSchema.parse(clientData);
            // Handle multiple fixtures - create separate predictions for each fixture
            const fixtureIds = Array.isArray(clientData.fixtureIds)
                ? clientData.fixtureIds
                : [data.fixtureId];
            // Verify all fixtures exist
            const fixtures = await prisma.fixture.findMany({
                where: { id: { in: fixtureIds } },
            });
            if (fixtures.length !== fixtureIds.length) {
                return res.status(404).json({ error: "One or more fixtures not found" });
            }
            // Verify plan exists if provided
            if (data.planId) {
                const plan = await prisma.tipPlan.findUnique({
                    where: { id: data.planId },
                });
                if (!plan) {
                    return res.status(404).json({ error: "Plan not found" });
                }
            }
            // Create predictions for each fixture
            const predictions = await Promise.all(fixtureIds.map((fixtureId) => prisma.prediction.create({
                data: {
                    tipText: data.tipText,
                    odd: data.odd,
                    tipDate: new Date(data.tipDate),
                    isPublished: data.isPublished ?? false,
                    fixtureId: fixtureId,
                    ...(data.planId && { planId: data.planId }),
                    // Temporarily commented out until migration is run
                    // ...(data.confidence && { confidence: data.confidence }),
                    // ...(data.category && { category: data.category }),
                    // ...(data.priority && { priority: data.priority }),
                },
                include: {
                    fixture: true,
                    plan: true,
                },
            })));
            res.status(201).json({
                success: true,
                count: predictions.length,
                data: predictions
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: "Validation failed", details: error.issues });
            }
            res.status(500).json({ error: "Failed to create prediction" });
        }
    }
}
//# sourceMappingURL=PredictionController.js.map