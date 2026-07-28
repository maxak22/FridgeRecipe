import { ArrowRight, Shuffle } from "lucide-react";

export default function SwapsList({ swaps }) {
  if (!swaps?.length) return null;

  return (
    <div className="rounded-2xl border border-accent-200 bg-accent-50/50 p-5 shadow-soft dark:border-accent-900/50 dark:bg-accent-900/10 sm:p-6">
      <h3 className="mb-4 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-accent-700 dark:text-accent-400">
        <Shuffle size={14} />
        Ingredient Swaps
      </h3>
      <ul className="space-y-2">
        {swaps.map((swap, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-200"
          >
            <span className="font-medium">{swap.ingredient}</span>
            <ArrowRight size={14} className="shrink-0 text-accent-500" />
            <span>{swap.swap}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
