// Thin persistence layer around localStorage so components never touch
// window.localStorage or JSON.parse/stringify directly.
const STORAGE_KEY = "fridgechef.savedRecipes";

export function loadSavedRecipes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSavedRecipes(recipes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — fail silently,
    // saving recipes is a nice-to-have, not core functionality.
  }
}
