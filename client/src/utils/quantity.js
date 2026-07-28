// Small pure-function helpers for scaling and formatting ingredient quantities.
// Kept separate from components so the scaling math is independently testable.

/**
 * Scales a base quantity from its original servings to a target serving count.
 */
export function scaleQuantity(baseQuantity, baseServings, targetServings) {
  if (!baseServings || baseServings <= 0) return baseQuantity;
  return (baseQuantity * targetServings) / baseServings;
}

// Common fractions AI recipes tend to imply, used to render friendlier text
// than long decimals (e.g. 0.5 -> "1/2").
const FRACTION_MAP = [
  [0.125, "1/8"],
  [0.25, "1/4"],
  [0.333, "1/3"],
  [0.5, "1/2"],
  [0.667, "2/3"],
  [0.75, "3/4"],
];

/**
 * Formats a scaled numeric quantity as a compact, human-friendly string.
 */
export function formatQuantity(value) {
  if (!Number.isFinite(value) || value <= 0) return "";

  const whole = Math.floor(value);
  const remainder = value - whole;

  const closestFraction = FRACTION_MAP.find(
    ([decimal]) => Math.abs(remainder - decimal) < 0.03
  );

  if (closestFraction) {
    const [, label] = closestFraction;
    return whole > 0 ? `${whole} ${label}` : label;
  }

  // Fall back to at most 2 decimal places, trimming trailing zeros.
  const rounded = Math.round(value * 100) / 100;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
