import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import { auth } from "./auth";
import { toNodeHandler } from "better-auth/node";

// Import routes
import authRoutes from "./routes/auth";
import planRoutes from "./routes/plans";
import fixtureRoutes from "./routes/fixtures";
import predictionRoutes from "./routes/predictions";
import betRoutes from "./routes/bets";
import jackpotRoutes from "./routes/jackpots";
import { AuthController } from "./controllers/AuthController";

//middlewares


dotenv.config();
const app = express();

//middlewire

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.0.105:3000"
  ],
  credentials: true,}));

app.use("/api/auth/*splat", toNodeHandler(auth));// For ExpressJS v5




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
app.use("/api", (await import("./routes/paymentRoutes")).default);

//server

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});