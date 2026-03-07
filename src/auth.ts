// auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET || "c2d4a7f8e39b4f6d1e2c3a9b8d0f1e2c3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  baseURL: "http://localhost:3000",
  

  database: prismaAdapter(prisma,{
    provider:"mysql"
  }),
  session: {
    
    cookieCache:{
        secure: false, // Set to true in production
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax"
    }, // 1 day in seconds
    fields: {
      user: {
        role: "role"
      }
    }
  },
});