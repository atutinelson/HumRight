import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { createFixtureSchema } from "../lib/validator.js";
import { z } from "zod";

const prisma = new PrismaClient();

export class FixtureController {
  static async createFixture(req: Request, res: Response) {
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
        },});
     
      if (!user) {
        return res.status(401).json({ error: "User not found" });
         }
      if (user.role !== "ADMIN") {
        return res.status(403).json({ 
            error: "Forbidden: Only admins can create fixtures",
         });
      }

      const data = createFixtureSchema.parse(req.body);

      const fixture = await prisma.fixture.create({
        data: {
          matchDate: new Date(data.matchDate),
          homeTeam: data.homeTeam,
          awayTeam: data.awayTeam,
          fixtureTip: data.fixtureTip,
          competition: data.competition,
          ...(data.result && { result: data.result }),
          status: data.status ?? "SCHEDULED",
        },
      });

      res.status(201).json({ success: true, data: fixture });
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.issues });
      }
      res.status(500).json({ error: "Failed to create fixture" });
    }
  }

  static async getFixturesByDate(req: Request, res: Response) {
    try {
      const { date } = req.query;

      if (!date || typeof date !== 'string') {
        return res.status(400).json({ error: "Date parameter is required" });
      }

      // Parse the date string and create start/end of day
      const targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD format" });
      }

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const fixtures = await prisma.fixture.findMany({
        where: {
          matchDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: {
          matchDate: 'asc',
        },
      });

      res.json({
        success: true,
        count: fixtures.length,
        data: fixtures,
        date: date,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch fixtures" });
    }
  }
}