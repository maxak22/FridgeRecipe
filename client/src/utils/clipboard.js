// Builds a clean plain-text version of a recipe for copy-to-clipboard / sharing,
// since the AI response itself should never be shown raw.
export function recipeToPlainText(recipe, servings) {
  const lines = [];
  lines.push(recipe.title);
  lines.push(recipe.description);
  lines.push("");
  lines.push(
    `⏱ ${recipe.time}  •  ${recipe.difficulty}  •  🍽 ${servings} servings  •  ${recipe.cuisine}  •  ~${recipe.estimatedCalories} cal`
  );
  lines.push("");
  lines.push("Ingredients:");
  recipe.ingredients.forEach((item) => {
    lines.push(`- ${[item.quantity, item.unit, item.name].filter(Boolean).join(" ")}`);
  });
  lines.push("");
  lines.push("Steps:");
  recipe.steps.forEach((step, index) => {
    lines.push(`${index + 1}. ${step}`);
  });

  if (recipe.swaps?.length) {
    lines.push("");
    lines.push("Swaps:");
    recipe.swaps.forEach((swap) => {
      lines.push(`- ${swap.ingredient} → ${swap.swap}`);
    });
  }

  return lines.join("\n");
}
