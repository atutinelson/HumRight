import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import { auth } from "./auth.js";
import { toNodeHandler } from "better-auth/node";
// Import routes
import authRoutes from "./routes/auth.js";
import planRoutes from "./routes/plans.js";
import fixtureRoutes from "./routes/fixtures.js";
import predictionRoutes from "./routes/predictions.js";
import betRoutes from "./routes/bets.js";
import jackpotRoutes from "./routes/jackpots.js";
import { AuthController } from "./controllers/AuthController.js";
//middlewares
dotenv.config();
const app = express();
//middlewire
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use("/api/auth/*splat", toNodeHandler(auth)); // For ExpressJS v5
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
// Use the route modules
app.use("/api/session", AuthController.getSession);
app.use("/api/me", AuthController.getMe);
app.use("/api/plans", planRoutes);
app.use("/api/fixtures", fixtureRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/bets", betRoutes);
app.use("/api/jackpots", jackpotRoutes);
app.use("/api", (await import("./routes/paymentRoutes.js")).default);
//server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map