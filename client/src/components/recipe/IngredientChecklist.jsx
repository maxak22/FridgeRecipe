import { formatQuantity, scaleQuantity } from "../../utils/quantity.js";

export default function IngredientChecklist({
  ingredients,
  baseServings,
  servings,
  checked,
  onToggle,
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Ingredients
      </h3>
      <ul className="space-y-2.5">
        {ingredients.map((item, index) => {
          const scaled = scaleQuantity(item.quantity, baseServings, servings);
          const isChecked = checked.has(index);
          return (
            <li key={`${item.name}-${index}`}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-0.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(index)}
                  className="focus-ring mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-brand-600 accent-brand-600 dark:border-neutral-700"
                />
                <span
                  className={`text-sm leading-snug transition ${
                    isChecked
                      ? "text-neutral-400 line-through dark:text-neutral-600"
                      : "text-neutral-700 dark:text-neutral-200"
                  }`}
                >
                  {scaled > 0 && (
                    <span className="font-medium tabular-nums">
                      {formatQuantity(scaled)} {item.unit}{" "}
                    </span>
                  )}
                  {item.name}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
