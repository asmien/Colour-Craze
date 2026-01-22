// src/components/TargetColor.js

// List of target colors (kid-friendly, 30 levels)
export const MIXING_RULES = {
  purple: ["red", "blue"],
  orange: ["red", "yellow"],
  green: ["blue", "yellow"],
  pink: ["red", "white"],
  teal: ["blue", "green"],
  brown: ["red", "yellow", "blue"],
  lime: ["yellow", "green"],
  coral: ["red", "orange"],
  magenta: ["red", "blue"],
  peach: ["red", "yellow", "white"],
  sky: ["blue", "white"],
  turquoise: ["blue", "green", "white"],
  gold: ["yellow", "orange"],
  silver: ["white", "gray"],
  navy: ["blue", "black"],
  mint: ["green", "white"],
  aqua: ["blue", "white", "green"],
  lavender: ["blue", "white", "red"],
  maroon: ["red", "brown"],
  beige: ["brown", "white"],
  amber: ["yellow", "orange", "brown"],
  cream: ["white", "yellow"],
  olive: ["green", "brown"],
  ruby: ["red", "pink"],
  sapphire: ["blue", "purple"],
  jade: ["green", "blue"],
  chocolate: ["brown", "red"],
  lemon: ["yellow", "white"],
  salmon: ["pink", "orange"],
  blush: ["pink", "white"],
};

// Extra colors palette for each target (required + distractors)
// Ensure the target itself is never included
export const EXTRA_COLORS = {
  purple: ["red", "blue", "pink", "yellow"],
  orange: ["red", "yellow", "pink", "green"],
  green: ["blue", "yellow", "red", "white"],
  pink: ["red", "white", "yellow", "blue"],
  teal: ["blue", "green", "white", "yellow"],
  brown: ["red", "yellow", "blue", "green"],
  lime: ["yellow", "green", "white", "orange"],
  coral: ["red", "orange", "pink", "yellow"],
  magenta: ["red", "blue", "pink", "purple"],
  peach: ["red", "yellow", "white", "pink"],
  sky: ["blue", "white", "yellow", "green"],
  turquoise: ["blue", "green", "white", "yellow"],
  gold: ["yellow", "orange", "brown", "white"],
  silver: ["white", "gray", "blue", "black"],
  navy: ["blue", "black", "white", "gray"],
  mint: ["green", "white", "blue", "yellow"],
  aqua: ["blue", "green", "white", "yellow"],
  lavender: ["blue", "white", "red", "pink"],
  maroon: ["red", "brown", "pink", "orange"],
  beige: ["brown", "white", "yellow", "green"],
  amber: ["yellow", "orange", "brown", "red"],
  cream: ["white", "yellow", "pink", "orange"],
  olive: ["green", "brown", "yellow", "white"],
  ruby: ["red", "pink", "white", "orange"],
  sapphire: ["blue", "purple", "white", "pink"],
  jade: ["green", "blue", "white", "yellow"],
  chocolate: ["brown", "red", "orange", "yellow"],
  lemon: ["yellow", "white", "green", "orange"],
  salmon: ["pink", "orange", "red", "white"],
  blush: ["pink", "white", "red", "yellow"],
};

// Check if the mix is correct
export function checkMix(target, droppedColors) {
  const required = MIXING_RULES[target];
  const sortedDropped = [...droppedColors].sort();
  const sortedRequired = [...required].sort();

  return (
    sortedDropped.length === sortedRequired.length &&
    sortedDropped.every((color, i) => color === sortedRequired[i])
  );
}
