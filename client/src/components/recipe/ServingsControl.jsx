import { Minus, Plus } from "lucide-react";

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 24;

export default function ServingsControl({ servings, onChange }) {
  const decrement = () => onChange(Math.max(MIN_SERVINGS, servings - 1));
  const increment = () => onChange(Math.min(MAX_SERVINGS, servings + 1));

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Servings</span>
      <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
        <button
          type="button"
          onClick={decrement}
          disabled={servings <= MIN_SERVINGS}
          aria-label="Decrease servings"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-l-xl text-neutral-600 transition hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <Minus size={15} />
        </button>
        <span className="w-9 text-center text-sm font-semibold tabular-nums text-neutral-900 dark:text-neutral-50">
          {servings}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={servings >= MAX_SERVINGS}
          aria-label="Increase servings"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-r-xl text-neutral-600 transition hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
