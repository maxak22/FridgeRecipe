import { BookMarked, Trash2 } from "lucide-react";

export default function SavedRecipesPanel({ savedRecipes, onLoad, onRemove }) {
  if (!savedRecipes.length) return null;

  return (
    <div className="animate-fade-in rounded-2xl border border-neutral-200 bg-white p-5 shadow-soft dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
      <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        <BookMarked size={14} />
        Saved Recipes
      </h3>
      <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {savedRecipes.map((recipe) => (
          <li key={recipe.title} className="flex items-center justify-between gap-3 py-2.5">
            <button
              type="button"
              onClick={() => onLoad(recipe)}
              className="focus-ring flex-1 truncate text-left text-sm font-medium text-neutral-700 transition hover:text-brand-600 dark:text-neutral-200 dark:hover:text-brand-400"
            >
              {recipe.title}
            </button>
            <button
              type="button"
              onClick={() => onRemove(recipe.title)}
              aria-label={`Remove ${recipe.title}`}
              className="focus-ring rounded-lg p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
