import { useContext } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { ToastContext } from "../hooks/useToast.js";

const ICONS = {
  success: <CheckCircle2 size={17} className="text-brand-600 dark:text-brand-400" />,
  error: <TriangleAlert size={17} className="text-red-500" />,
  info: <Info size={17} className="text-neutral-500" />,
};

export default function ToastViewport() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;
  const { toasts, dismiss } = ctx;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="animate-fade-in pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-soft dark:border-neutral-800 dark:bg-neutral-900"
        >
          {ICONS[toast.type] || ICONS.info}
          <p className="flex-1 text-sm text-neutral-700 dark:text-neutral-200">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss notification"
            className="focus-ring rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
