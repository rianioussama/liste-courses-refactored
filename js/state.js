import { DEFAULT_STATE, STORAGE_KEY } from "./config.js";

export function ensureState(rawState) {
  const base = structuredClone(DEFAULT_STATE);
  const candidate = rawState && typeof rawState === "object" ? rawState : {};

  return {
    ...base,
    ...candidate,
    categories: Array.isArray(candidate.categories) ? candidate.categories : base.categories,
    products: Array.isArray(candidate.products) ? candidate.products : base.products,
    weeklyMenu: { ...base.weeklyMenu, ...(candidate.weeklyMenu || {}) },
    shoppingHistory: Array.isArray(candidate.shoppingHistory) ? candidate.shoppingHistory : base.shoppingHistory,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    return ensureState(JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function uid() {
  return crypto.randomUUID();
}
