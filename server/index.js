import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",");

// Render (and most PaaS hosts) put the app behind one reverse proxy hop, which
// sets X-Forwarded-For. Trusting exactly one hop lets req.ip reflect the real
// client IP so express-rate-limit can key on it safely; without this it
// refuses to trust the header at all and errors on every rate-limited request.
app.set("trust proxy", 1);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/recipe", recipeRoutes);

// Central fallback error handler in case something throws outside a controller's try/catch.
app.use((err, _req, res, _next) => {
  console.error("[unhandled]", err);
  res.status(500).json({ error: "SERVER_ERROR", message: "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log(`FridgeChef server listening on http://localhost:${PORT}`);
});
