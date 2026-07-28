import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",");

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
