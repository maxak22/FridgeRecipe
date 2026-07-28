import { Router } from "express";
import rateLimit from "express-rate-limit";
import { generateRecipe } from "../controllers/recipeController.js";

const router = Router();

// Basic abuse protection around the (metered) Groq call.
const recipeRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "RATE_LIMITED", message: "Too many requests. Please slow down." },
});

router.post("/generate", recipeRateLimiter, generateRecipe);

export default router;
