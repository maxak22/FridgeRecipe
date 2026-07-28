// Splits the free-form textarea value into a clean, deduped list of ingredient
// labels for the live chip preview. Purely cosmetic — the raw string is still
// what gets sent to the backend, so this never changes the AI contract.
export function parseIngredientChips(raw) {
  if (!raw) return [];

  const seen = new Set();
  const chips = [];

  raw
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((label) => {
      const key = label.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      chips.push(label);
    });

  return chips;
}
