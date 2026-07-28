import { useMemo, useRef } from "react";
import { Loader2, Sparkles } from "lucide-react";
import IngredientChips from "./IngredientChips.jsx";
import { parseIngredientChips } from "../utils/parseIngredients.js";

const PLACEHOLDER = "Eggs\nMilk\nCheese\nBread\nTomatoes";

export default function IngredientForm({ value, onChange, onSubmit, isLoading }) {
  const textareaRef = useRef(null);
  const chips = useMemo(() => parseIngredientChips(value), [value]);

  const handleRemoveChip = (chip) => {
    onChange(chips.filter((c) => c !== chip).join(", "));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim() || isLoading) return;
    onSubmit();
  };

  // Cmd/Ctrl + Enter submits without leaving the keyboard, matching
  // conventions in Notion/Linear-style AI inputs.
  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-soft transition dark:border-neutral-800 dark:bg-neutral-900 sm:p-6"
    >
      <label htmlFor="ingredients" className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        What's in your fridge?
      </label>
      <textarea
        id="ingredients"
        ref={textareaRef}
        autoFocus
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Example:\n\n${PLACEHOLDER}`}
        rows={6}
        className="focus-ring w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-800 placeholder:text-neutral-400 transition focus:border-brand-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600"
      />

      <IngredientChips chips={chips} onRemove={handleRemoveChip} />

      <div className="mt-4 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Tip: separate ingredients by line or comma. ⌘/Ctrl + Enter to generate.
        </p>
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:from-neutral-300 disabled:to-neutral-300 disabled:text-neutral-500 disabled:shadow-none dark:disabled:from-neutral-800 dark:disabled:to-neutral-800 dark:disabled:text-neutral-500"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating Recipe...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Recipe
            </>
          )}
        </button>
      </div>
    </form>
  );
}
