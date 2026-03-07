import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { createPlanSchema } from "../lib/validator.js";
import { z } from "zod";

const prisma = new PrismaClient();

export class PlanController {
  static async getPlans(req: Request, res: Response) {
    try {
      const plans = await prisma.tipPlan.findMany({});
      return res.json({
        success: true,
        count: plans.length,
        data: plans
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch plans",
      });
    }
  }

  static async getplanPredictionsToday(req: Request, res: Response) {
    try {
       const planIdParam = req.params.planId;

     if (!planIdParam || Array.isArray(planIdParam)) {
          return res.status(400).json({ error: "Invalid planId parameter" });
      }

    const planId = parseInt(planIdParam, 10);
      
      // Get today's date range (UTC boundaries) to avoid timezone issues
      const now = new Date();
      const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
      const plan = await prisma.tipPlan.findUnique({
        where: { id: planId },
      });
      console.log("Plan found:", plan);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      const predictions = await prisma.prediction.findMany({
        where: {
          planId: planId,
          tipDate: {
            gte: startOfDay,
            lt: endOfDay
          },
          
        },
        include: {
          fixture: true
        }
      });

      const data = predictions.map(prediction => {
        const { fixture, ...rest } = prediction;
        return { ...rest, fixtures: [fixture] };
      });

      console.log(data);
      return res.json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: `Failed to fetch predictions for plan ID ${req.params.planId}`,
      });
    }
  }

  static async createPlan(req: Request, res: Response) {
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
        return res.status(403).json({ error: "Forbidden: Only admins can create plans" });
      }

      const data = createPlanSchema.parse(req.body);

      const plan = await prisma.tipPlan.create({ data });
      res.status(201).json({ success: true, data: plan });
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.issues });
      }
      res.status(500).json({ error: "Failed to create plan" });
    }
  }
}