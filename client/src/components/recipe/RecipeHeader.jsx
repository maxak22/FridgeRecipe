import { ChefHat, Clock, Flame, Globe2, Users } from "lucide-react";

const STAT_ITEMS = [
  { key: "time", icon: Clock, label: (recipe) => recipe.time },
  { key: "difficulty", icon: ChefHat, label: (recipe) => recipe.difficulty },
  { key: "cuisine", icon: Globe2, label: (recipe) => recipe.cuisine },
  { key: "calories", icon: Flame, label: (recipe) => `${recipe.estimatedCalories} cal` },
];

export default function RecipeHeader({ recipe, servings }) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-2xl">
        {recipe.title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {recipe.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {STAT_ITEMS.map(({ key, icon: Icon, label }) => (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-300"
          >
            <Icon size={13} />
            {label(recipe)}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-900/50 dark:bg-brand-900/20 dark:text-brand-400">
          <Users size={13} />
          {servings} servings
        </span>
      </div>
    </div>
  );
}
