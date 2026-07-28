import { generateRecipeRequestSchema } from "../validation/requestSchema.js";
import { parseRecipeResponse } from "../validation/recipeSchema.js";
import { requestRecipeCompletion } from "../services/groqService.js";

// Maps our internal error codes to HTTP status + a user-safe message.
// Keeping this in one place means the client always gets predictable shapes.
const ERROR_STATUS_MAP = {
  MISSING_API_KEY: 500,
  INVALID_JSON: 502,
  SCHEMA_MISMATCH: 502,
  EMPTY_RESPONSE: 502,
  TIMEOUT: 504,
  RATE_LIMITED: 429,
  UPSTREAM_UNAVAILABLE: 503,
  NETWORK_ERROR: 502,
  UPSTREAM_ERROR: 502,
};

const USER_MESSAGES = {
  MISSING_API_KEY: "The server is not configured correctly. Please contact the site owner.",
  INVALID_JSON: "AI returned an invalid recipe.",
  SCHEMA_MISMATCH: "AI returned an invalid recipe.",
  EMPTY_RESPONSE: "AI returned an empty response.",
  TIMEOUT: "The AI took too long to respond. Please try again.",
  RATE_LIMITED: "Too many requests right now. Please wait a moment and try again.",
  UPSTREAM_UNAVAILABLE: "The AI service is temporarily unavailable. Please try again shortly.",
  NETWORK_ERROR: "Couldn't reach the AI service. Check your connection and try again.",
  UPSTREAM_ERROR: "Something went wrong generating your recipe.",
  VALIDATION_ERROR: "Please provide a valid list of ingredients.",
};

export async function generateRecipe(req, res) {
  const parsedBody = generateRecipeRequestSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: parsedBody.error.issues[0]?.message || USER_MESSAGES.VALIDATION_ERROR,
    });
  }

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  try {
    const { text } = await requestRecipeCompletion(parsedBody.data.ingredients, {
      signal: controller.signal,
    });
    const recipe = parseRecipeResponse(text);
    return res.status(200).json({ recipe });
  } catch (error) {
    if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
      // Client disconnected/aborted; nothing to send back.
      return;
    }

    const code = error.code || "UPSTREAM_ERROR";
    const status = ERROR_STATUS_MAP[code] || 500;

    console.error(`[generateRecipe] ${code}:`, error.message, error.issues ?? "");

    return res.status(status).json({
      error: code,
      message: USER_MESSAGES[code] || "Something went wrong generating your recipe.",
    });
  }
}
