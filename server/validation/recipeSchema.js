import { z } from "zod";

// The AI is never trusted. Every field is validated and coerced defensively so a
// single missing/odd field from the model doesn't blow up the whole response.
// Numbers frequently come back as strings from LLMs, so we coerce them.
export const ingredientSchema = z.object({
  name: z.string().trim().min(1),
  quantity: z.coerce.number().finite().nonnegative(),
  unit: z.string().trim().max(30).default(""),
});

export const swapSchema = z.object({
  ingredient: z.string().trim().min(1),
  swap: z.string().trim().min(1),
});

export const recipeSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(500),
  time: z.string().trim().min(1).max(60),
  difficulty: z.string().trim().min(1).max(30),
  servings: z.coerce.number().int().positive().max(50),
  cuisine: z.string().trim().min(1).max(60),
  estimatedCalories: z.coerce.number().nonnegative().max(20000),
  ingredients: z.array(ingredientSchema).min(1),
  steps: z.array(z.string().trim().min(1)).min(1),
  swaps: z.array(swapSchema).default([]),
});

/**
 * Parses raw text from the model into a validated recipe object.
 * Throws a typed error the controller can translate into a clean HTTP response.
 */
export function parseRecipeResponse(rawText) {
  let json;
  try {
    json = JSON.parse(rawText);
  } catch {
    const error = new Error("AI response was not valid JSON.");
    error.code = "INVALID_JSON";
    throw error;
  }

  const result = recipeSchema.safeParse(json);
  if (!result.success) {
    const error = new Error("AI response did not match the expected recipe schema.");
    error.code = "SCHEMA_MISMATCH";
    error.issues = result.error.issues;
    throw error;
  }

  return result.data;
}
