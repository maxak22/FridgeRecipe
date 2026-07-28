import { useState } from "react";
import IngredientForm from "../components/IngredientForm.jsx";
import EmptyState from "../components/EmptyState.jsx";
import RecipeSkeleton from "../components/RecipeSkeleton.jsx";
import ErrorState from "../components/ErrorState.jsx";
import RecipeCard from "../components/recipe/RecipeCard.jsx";
import SavedRecipesPanel from "../components/SavedRecipesPanel.jsx";
import { useRecipeGenerator } from "../hooks/useRecipeGenerator.js";
import { useSavedRecipes } from "../hooks/useSavedRecipes.js";
import { useToast } from "../hooks/useToast.js";

export default function HomePage() {
  const [ingredients, setIngredients] = useState("");
  // Bumped on every new recipe (generated or loaded) so RecipeCard remounts
  // and its local servings/checklist state resets, even if the title repeats.
  const [recipeKey, setRecipeKey] = useState(0);

  const { status, recipe, error, generate, loadRecipe } = useRecipeGenerator();
  const { savedRecipes, isSaved, saveRecipe, removeRecipe } = useSavedRecipes();
  const { notify } = useToast();

  const handleGenerate = () => {
    setRecipeKey((key) => key + 1);
    generate(ingredients);
  };

  const handleLoadSaved = (savedRecipe) => {
    setRecipeKey((key) => key + 1);
    loadRecipe(savedRecipe);
    notify(`Loaded "${savedRecipe.title}".`, { type: "info" });
  };

  const handleRemoveSaved = (title) => {
    removeRecipe(title);
    notify("Recipe removed from saved list.", { type: "info" });
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <IngredientForm
        value={ingredients}
        onChange={setIngredients}
        onSubmit={handleGenerate}
        isLoading={status === "loading"}
      />

      {status === "idle" && <EmptyState />}
      {status === "loading" && <RecipeSkeleton />}
      {status === "error" && <ErrorState error={error} onRetry={handleGenerate} />}
      {status === "success" && recipe && (
        <RecipeCard
          key={recipeKey}
          recipe={recipe}
          onSaveRecipe={saveRecipe}
          isSaved={isSaved(recipe.title)}
        />
      )}

      <SavedRecipesPanel
        savedRecipes={savedRecipes}
        onLoad={handleLoadSaved}
        onRemove={handleRemoveSaved}
      />
    </main>
  );
}
