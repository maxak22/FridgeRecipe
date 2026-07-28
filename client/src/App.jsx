import Navbar from "./components/Navbar.jsx";
import ToastViewport from "./components/Toast.jsx";
import HomePage from "./pages/HomePage.jsx";
import { useDarkMode } from "./hooks/useDarkMode.js";
import { ToastContext, useToastState } from "./hooks/useToast.js";

export default function App() {
  const { theme, toggleTheme } = useDarkMode();
  const toastState = useToastState();

  return (
    <ToastContext.Provider value={toastState}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <HomePage />
        <ToastViewport />
      </div>
    </ToastContext.Provider>
  );
}
