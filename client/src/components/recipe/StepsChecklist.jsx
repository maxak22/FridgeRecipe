import { PartyPopper, RotateCcw } from "lucide-react";

export default function StepsChecklist({ steps, checked, onToggle, onReset }) {
  const completedCount = checked.size;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;
  const isComplete = steps.length > 0 && completedCount === steps.length;

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-neutral-900 sm:p-6 ${
        isComplete
          ? "border-brand-300 dark:border-brand-700/70"
          : "border-neutral-200 dark:border-neutral-800"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Cooking Steps
        </h3>
        {completedCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="focus-ring inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      <div className="mb-5">
        <div className="mb-1.5 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span>Progress</span>
          <span className="tabular-nums">
            {completedCount}/{steps.length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <div
            className={`h-full rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out ${
              isComplete ? "from-brand-500 to-accent-500" : "from-brand-400 to-brand-600"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {isComplete && (
          <div className="animate-celebrate-in mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-50 to-accent-50 px-3 py-2 text-sm font-medium text-brand-700 dark:from-brand-900/30 dark:to-accent-900/20 dark:text-brand-300">
            <PartyPopper size={16} />
            Recipe complete — nice work!
          </div>
        )}
      </div>

      <ol className="space-y-2.5">
        {steps.map((step, index) => {
          const isChecked = checked.has(index);
          return (
            <li key={index}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-0.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(index)}
                  className="focus-ring mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-brand-600 accent-brand-600 dark:border-neutral-700"
                />
                <span
                  className={`text-sm leading-relaxed transition ${
                    isChecked
                      ? "text-neutral-400 line-through dark:text-neutral-600"
                      : "text-neutral-700 dark:text-neutral-200"
                  }`}
                >
                  <span className="mr-1.5 font-semibold text-neutral-400 dark:text-neutral-500">
                    {index + 1}.
                  </span>
                  {step}
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
