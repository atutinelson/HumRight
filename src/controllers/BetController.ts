import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BetController {
  static async getFreeBets(req: Request, res: Response) {
    try {
      const { day } = req.params;
      const targetDate = day === "today" ? new Date() :
        day === "yesterday" ? new Date(Date.now() - 24 * 60 * 60 * 1000) :
        day === "tomorrow" ? new Date(Date.now() + 24 * 60 * 60 * 1000) :
        new Date();

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
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch free bets",
      });
    }
  }

  static async getAllFreeBets(req: Request, res: Response) {
    try {
      const freeBets = await prisma.prediction.findMany({
        where: {
          plan: null,
          isPublished: true,
        },
        include: {
          fixture: true,
        },
        orderBy: {
          tipDate: "asc",
        },
      });

      const grouped = freeBets.reduce((acc: any, bet) => {
        const date = bet.tipDate.toISOString().split("T")[0]; // yyyy-mm-dd

        if (!acc[date!]) {
          acc[date!] = [];
        }

        acc[date!].push(bet);
        return acc;
      }, {});

      res.json({ data: grouped });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}