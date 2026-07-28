import { ChefHat, Moon, Sun } from "lucide-react";

export default function Navbar({ theme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200/70 bg-white/80 backdrop-blur-lg dark:border-neutral-800/70 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-soft">
            <ChefHat size={20} strokeWidth={2.25} />
          </span>
          <div className="leading-tight">
            <p className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              FridgeChef AI
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Turn ingredients into recipes
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:text-white"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
