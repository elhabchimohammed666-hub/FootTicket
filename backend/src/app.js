import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import matchRoutes from "./routes/matches.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);
app.use(errorHandler);

export default app;
