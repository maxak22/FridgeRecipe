import { useMemo, useState } from "react";
import RecipeHeader from "./RecipeHeader.jsx";
import ServingsControl from "./ServingsControl.jsx";
import IngredientChecklist from "./IngredientChecklist.jsx";
import StepsChecklist from "./StepsChecklist.jsx";
import SwapsList from "./SwapsList.jsx";
import RecipeActions from "./RecipeActions.jsx";
import { recipeToPlainText } from "../../utils/clipboard.js";
import { useToast } from "../../hooks/useToast.js";

/**
 * Composes the full interactive recipe experience. Owns servings + checklist
 * state locally (reset whenever a new recipe object is generated) while
 * delegating persistence (saved recipes) to the parent via props.
 */
export default function RecipeCard({ recipe, onSaveRecipe, isSaved }) {
  const { notify } = useToast();
  const [servings, setServings] = useState(recipe.servings);
  const [checkedIngredients, setCheckedIngredients] = useState(() => new Set());
  const [checkedSteps, setCheckedSteps] = useState(() => new Set());

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const toggleStep = (index) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const resetSteps = () => setCheckedSteps(new Set());

  const scaledIngredientsText = useMemo(() => recipeToPlainText(recipe, servings), [recipe, servings]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scaledIngredientsText);
      notify("Recipe copied to clipboard.", { type: "success" });
    } catch {
      notify("Couldn't copy — your browser may have blocked clipboard access.", {
        type: "error",
      });
    }
  };

  const handleSave = () => {
    onSaveRecipe(recipe);
    notify(`"${recipe.title}" saved.`, { type: "success" });
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-soft dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <RecipeHeader recipe={recipe} servings={servings} />
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-neutral-100 pt-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
          <ServingsControl servings={servings} onChange={setServings} />
          <div className="sm:w-64">
            <RecipeActions onCopy={handleCopy} onSave={handleSave} saved={isSaved} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <IngredientChecklist
          ingredients={recipe.ingredients}
          baseServings={recipe.servings}
          servings={servings}
          checked={checkedIngredients}
          onToggle={toggleIngredient}
        />
        <StepsChecklist
          steps={recipe.steps}
          checked={checkedSteps}
          onToggle={toggleStep}
          onReset={resetSteps}
        />
      </div>

      <SwapsList swaps={recipe.swaps} />
    </div>
  );
}
