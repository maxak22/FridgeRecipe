import { useCallback, useEffect, useState } from "react";
import { loadSavedRecipes, persistSavedRecipes } from "../services/savedRecipes.js";

/**
 * Owns the "saved recipes" list backed by localStorage, exposing simple
 * save/remove/isSaved helpers so components don't touch storage directly.
 */
export function useSavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState(() => loadSavedRecipes());

  useEffect(() => {
    persistSavedRecipes(savedRecipes);
  }, [savedRecipes]);

  const isSaved = useCallback(
    (title) => savedRecipes.some((r) => r.title === title),
    [savedRecipes]
  );

  const saveRecipe = useCallback((recipe) => {
    setSavedRecipes((prev) => {
      if (prev.some((r) => r.title === recipe.title)) return prev;
      return [{ ...recipe, savedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeRecipe = useCallback((title) => {
    setSavedRecipes((prev) => prev.filter((r) => r.title !== title));
  }, []);

  return { savedRecipes, isSaved, saveRecipe, removeRecipe };
}
