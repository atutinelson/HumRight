// auth.ts
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
const prisma = new PrismaClient();
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;
export const auth = betterAuth({
    secret: process.env.AUTH_SECRET || "c2d4a7f8e39b4f6d1e2c3a9b8d0f1e2c3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    baseURL: BASE_URL,
    trustedOrigins: [
        BASE_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    session: {
        cookie: {
            domain: COOKIE_DOMAIN,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production",
        },
        cookieCache: {
            maxAge: 60 * 60 * 24, // 1 day in seconds
            enabled: true,
            strategy: "compact",
            refreshCache: { updateAge: 60 * 60 }
        },
        expiresIn: 60 * 60 * 24, // optional, 1 day
        updateAge: 60 * 60, // // 1 day in seconds
    }
});
//# sourceMappingURL=auth.js.map