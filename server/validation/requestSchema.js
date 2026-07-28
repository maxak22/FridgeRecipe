import { z } from "zod";

// Guards the inbound request before it ever reaches the Groq call.
export const generateRecipeRequestSchema = z.object({
  ingredients: z
    .string()
    .trim()
    .min(2, "Please list at least one ingredient.")
    .max(2000, "That's a lot of ingredients — please shorten the list."),
});
