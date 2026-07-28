import { Bookmark, BookmarkCheck, Copy } from "lucide-react";

export default function RecipeActions({ onCopy, onSave, saved }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={onCopy}
        className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <Copy size={15} />
        Copy Recipe
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saved}
        className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-transparent bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-default disabled:bg-brand-600 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:disabled:bg-brand-500 dark:disabled:text-white"
      >
        {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        {saved ? "Saved" : "Save Recipe"}
      </button>
    </div>
  );
}
