import { RotateCcw, TriangleAlert } from "lucide-react";

// Friendlier copy for known error codes; anything else falls back to the
// server-provided message so we never show something cryptic to the user.
const FALLBACK_MESSAGE = "AI returned an invalid recipe.";

export default function ErrorState({ error, onRetry }) {
  const message = error?.message || FALLBACK_MESSAGE;

  return (
    <div className="animate-fade-in flex flex-col items-center rounded-2xl border border-red-200 bg-red-50/70 px-6 py-12 text-center dark:border-red-900/50 dark:bg-red-950/20">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-400">
        <TriangleAlert size={26} strokeWidth={1.8} />
      </div>
      <h2 className="text-base font-semibold text-neutral-800 dark:text-neutral-100">{message}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        This can happen if the AI is overloaded or returned something we couldn't parse.
        Your ingredients are still there — just try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="focus-ring mt-5 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        <RotateCcw size={15} />
        Retry
      </button>
    </div>
  );
}
