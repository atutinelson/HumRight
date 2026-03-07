import type { Request, Response } from "express";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AuthController {
  static async getSession(req: Request, res: Response) {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
        return res.status(401).json({ user: null });
      }
      
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        },});
      return res.json({
        user,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ user: null });
    }
  }

  static async getMe(req: Request, res: Response) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.json(session);
  }
}