import { useCallback, useRef, useState } from "react";
import { generateRecipe, toApiError } from "../services/api.js";

/**
 * Drives the "generate recipe" flow: loading/error/data state plus protection
 * against stale responses when the user clicks Generate multiple times.
 *
 * Two layers guard against races:
 *  1. AbortController cancels the previous HTTP request outright.
 *  2. A monotonically increasing requestId double-checks that the response
 *     we're about to apply still belongs to the latest request, even if an
 *     abort didn't take effect in time (e.g. request already resolved).
 */
export function useRecipeGenerator() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const latestRequestIdRef = useRef(0);

  const generate = useCallback(async (ingredients) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const requestId = ++latestRequestIdRef.current;

    setStatus("loading");
    setError(null);

    try {
      const result = await generateRecipe(ingredients, { signal: controller.signal });

      if (requestId !== latestRequestIdRef.current) return; // stale response, ignore

      setRecipe(result);
      setStatus("success");
    } catch (err) {
      if (requestId !== latestRequestIdRef.current) return; // stale error, ignore

      const apiError = toApiError(err);
      if (apiError.code === "CANCELED") return;

      setError(apiError);
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    latestRequestIdRef.current += 1; // invalidate any in-flight request
    setStatus("idle");
    setRecipe(null);
    setError(null);
  }, []);

  // Loads a recipe (e.g. from localStorage) straight into "success" state,
  // bypassing the network call. Also invalidates in-flight requests so a
  // slow generate() response can't clobber the recipe the user just opened.
  const loadRecipe = useCallback((savedRecipe) => {
    abortControllerRef.current?.abort();
    latestRequestIdRef.current += 1;
    setError(null);
    setRecipe(savedRecipe);
    setStatus("success");
  }, []);

  return { status, recipe, error, generate, reset, loadRecipe };
}
