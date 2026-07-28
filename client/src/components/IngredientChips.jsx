import { X } from "lucide-react";

// Real-time "fridge magnet" preview of whatever's been typed so far. Purely a
// UX affordance — clicking the × just rewrites the textarea value, it never
// touches what actually gets sent to the AI.
export default function IngredientChips({ chips, onRemove }) {
  if (!chips.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-1.5" aria-live="polite">
      {chips.map((chip) => (
        <span
          key={chip}
          className="animate-pop-in group inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 py-1 pl-3 pr-1.5 text-xs font-medium text-brand-800 transition hover:border-brand-300 dark:border-brand-800/60 dark:bg-brand-900/20 dark:text-brand-300"
        >
          {chip}
          <button
            type="button"
            onClick={() => onRemove(chip)}
            aria-label={`Remove ${chip}`}
            className="focus-ring rounded-full p-0.5 text-brand-500 transition hover:bg-brand-200/70 hover:text-brand-800 dark:text-brand-400 dark:hover:bg-brand-800/60 dark:hover:text-brand-200"
          >
            <X size={11} strokeWidth={2.5} />
          </button>
        </span>
      ))}
    </div>
  );
}
