import { Refrigerator } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="animate-fade-in flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 bg-white/60 px-6 py-16 text-center dark:border-neutral-800 dark:bg-neutral-900/40">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-600 dark:from-brand-900/40 dark:to-accent-900/30 dark:text-brand-400">
        <Refrigerator size={36} strokeWidth={1.6} />
      </div>
      <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
        What's in your fridge?
      </h2>
      <p className="mt-1.5 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        Add your ingredients and let AI cook. You'll get a full recipe with steps,
        swaps, and a checklist you can follow along in the kitchen.
      </p>
    </div>
  );
}
