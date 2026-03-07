import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { z } from "zod";

const prisma = new PrismaClient();

const createJackpotSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startDatetime: z.string().datetime(),
  endDatetime: z.string().datetime(),
  amount: z.number().positive(),
  fixtureIds: z.array(z.number()).min(1),
});

export class JackpotController {
  static async createJackpot(req: Request, res: Response) {
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
        return res.status(403).json({ error: "Forbidden: Only admins can create jackpots" });
      }

      const data = createJackpotSchema.parse(req.body);

      const jackpot = await prisma.jackpot.create({
        data: {
          name: data.name,
          startDatetime: new Date(data.startDatetime),
          endDatetime: new Date(data.endDatetime),
          amount: data.amount,
          fixtures: {
            connect: data.fixtureIds.map(id => ({ id })),
          },
        },
        include: {
          fixtures: true,
        },
      });
      res.status(201).json({ success: true, data: jackpot });
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.issues });
      }
      res.status(500).json({ error: "Failed to create jackpot" });
    }
  }

  static async getJackpotByName(req: Request, res: Response) {
    try {
      const { name } = req.params;

      if (!name) {
        return res.status(400).json({ error: "Name parameter is required" });
      }

      if (!name || Array.isArray(name)) {
             return res.status(400).json({ error: "Name parameter is required and must be a string" });
      }

      const jackpots = await prisma.jackpot.findMany({
        where: {
          name: {
            contains: name,  
          },
          isActive: true, // Only fetch active jackpots
        },
        include: {
          fixtures: true,
        },
      });

      if (jackpots.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Jackpot ${name} not found`,
          count: 0,
          data: [],
        });
      }

      // Check if any jackpot is active
      const activeJackpots = jackpots.filter(j => j.isActive);
      const inactiveJackpots = jackpots.filter(j => !j.isActive);

      if (activeJackpots.length > 0) {
        return res.json({
          success: true,
          count: activeJackpots.length,
          data: activeJackpots,
          message: `Active jackpots for ${name}`,
        });
      }

      // If no active jackpots but inactive ones exist
      if (inactiveJackpots.length > 0) {
        return res.status(403).json({
          success: false,
          message: `${inactiveJackpots[0]?.name ?? "Jackpot"} is not active`,
          count: 0,
          data: [],
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch jackpot",
      });
    }
  }
}