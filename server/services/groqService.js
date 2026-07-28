import axios from "axios";
import { SYSTEM_PROMPT, buildUserPrompt } from "../prompts/recipePrompt.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Preferred model first, with fallbacks in case it's retired/unavailable on the caller's account.
const MODEL_CANDIDATES = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
];

const REQUEST_TIMEOUT_MS = 20_000;

function isModelUnavailableError(error) {
  const status = error.response?.status;
  const message = error.response?.data?.error?.message?.toLowerCase() || "";
  return status === 404 || (status === 400 && message.includes("model"));
}

/**
 * Calls Groq's chat completions endpoint asking for a recipe as raw JSON text.
 * Tries each candidate model in order, falling back only when the model itself
 * is unavailable (not for content/validation errors, which are the caller's job).
 */
export async function requestRecipeCompletion(ingredients, { signal } = {}) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    const error = new Error("GROQ_API_KEY is not configured on the server.");
    error.code = "MISSING_API_KEY";
    throw error;
  }

  let lastError;

  for (const model of MODEL_CANDIDATES) {
    try {
      const response = await axios.post(
        GROQ_URL,
        {
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(ingredients) },
          ],
          temperature: 0.6,
          max_tokens: 1500,
          response_format: { type: "json_object" },
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: REQUEST_TIMEOUT_MS,
          signal,
        }
      );

      const text = response.data?.choices?.[0]?.message?.content;
      if (!text || !text.trim()) {
        const error = new Error("Groq returned an empty response.");
        error.code = "EMPTY_RESPONSE";
        throw error;
      }

      return { text, modelUsed: model };
    } catch (error) {
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        throw error;
      }

      if (isModelUnavailableError(error)) {
        lastError = error;
        continue; // try the next model candidate
      }

      throw translateAxiosError(error);
    }
  }

  throw translateAxiosError(lastError);
}

function translateAxiosError(error) {
  if (!error) {
    const fallback = new Error("Groq request failed for an unknown reason.");
    fallback.code = "UPSTREAM_ERROR";
    return fallback;
  }

  if (error.code === "ECONNABORTED") {
    const timeoutError = new Error("The request to Groq timed out.");
    timeoutError.code = "TIMEOUT";
    return timeoutError;
  }

  const status = error.response?.status;
  if (status === 429) {
    const rateLimitError = new Error("Groq rate limit exceeded. Please try again shortly.");
    rateLimitError.code = "RATE_LIMITED";
    rateLimitError.retryAfter = error.response.headers?.["retry-after"];
    return rateLimitError;
  }

  if (status >= 500) {
    const upstreamError = new Error("Groq is currently unavailable.");
    upstreamError.code = "UPSTREAM_UNAVAILABLE";
    return upstreamError;
  }

  if (!error.response) {
    const networkError = new Error("Network error while contacting Groq.");
    networkError.code = "NETWORK_ERROR";
    return networkError;
  }

  const genericError = new Error(
    error.response.data?.error?.message || "Groq request failed."
  );
  genericError.code = "UPSTREAM_ERROR";
  return genericError;
}
