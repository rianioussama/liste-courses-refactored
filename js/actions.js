import { DEFAULT_STATE } from "./config.js";
import { renderApp } from "./render.js";
import { loadState, saveState } from "./state.js";
import { getProductById } from "./utils.js";

export function setCurrentView(state, view) {
  state.currentView = view;
  renderApp(state);
}

export function addToList(state, id) {
  const product = getProductById(state, id);
  if (!product) return state;
  product.inList = true;
  product.listQuantity = Math.max(product.listQuantity || 1, 1);
  saveState(state);
  renderApp(state);
  return state;
}

export function toggleFavorite(state, id) {
  const product = getProductById(state, id);
  if (!product) return state;
  product.favorite = !product.favorite;
  saveState(state);
  renderApp(state);
  return state;
}

export function toggleList(state, id) {
  const product = getProductById(state, id);
  if (!product) return state;
  product.inList = !product.inList;
  if (product.inList && !product.listQuantity) product.listQuantity = 1;
  saveState(state);
  renderApp(state);
  return state;
}

export function adjustQuantity(state, id, delta) {
  const product = getProductById(state, id);
  if (!product) return state;
  product.listQuantity = Math.max(1, (product.listQuantity || 1) + Number(delta));
  saveState(state);
  renderApp(state);
  return state;
}

export function togglePurchased(state, id) {
  const product = getProductById(state, id);
  if (!product) return state;
  product.purchased = !product.purchased;

  if (product.purchased) {
    const now = new Date().toISOString();
    product.lastPurchase = now;
    product.frequency = (product.frequency || 0) + 1;
    product.purchaseHistory.push({ date: now, amount: 1 });
  }

  saveState(state);
  renderApp(state);
  return state;
}

export function setMenuMeal(state, day, slot, value) {
  if (!state.weeklyMenu[day]) return state;
  state.weeklyMenu[day][slot] = value;
  saveState(state);
  renderApp(state);
  return state;
}

export function toggleMenuDay(state, day) {
  if (!state.weeklyMenu[day]) return state;
  state.weeklyMenu[day].collapsed = !state.weeklyMenu[day].collapsed;
  saveState(state);
  renderApp(state);
  return state;
}

export function resetSelection(state) {
  state.products = state.products.map((product) => ({
    ...product,
    inList: false,
    purchased: false,
    listQuantity: 1,
  }));
  saveState(state);
  renderApp(state);
  return state;
}

export function addShoppingEntry(state, amount) {
  state.shoppingHistory.unshift({ date: new Date().toISOString(), amount: Number(amount || 0) });
  state.products = state.products.map((product) => ({
    ...product,
    inList: false,
    purchased: false,
    listQuantity: 1,
  }));
  saveState(state);
  renderApp(state);
  return state;
}

export function handleAction(state, action, payload = {}) {
  switch (action) {
    case "set-view":
      return { ...state, currentView: payload.view || "catalog" };
    case "toggle-category":
      return state;
    case "toggle-favorite":
      return toggleFavorite(state, payload.id);
    case "toggle-list":
      return toggleList(state, payload.id);
    case "adjust-quantity":
      return adjustQuantity(state, payload.id, Number(payload.delta || 0));
    case "toggle-purchased":
      return togglePurchased(state, payload.id);
    case "set-menu-meal":
      return setMenuMeal(state, payload.day, payload.slot, payload.value);
    case "toggle-menu-day":
      return toggleMenuDay(state, payload.day);
    case "reset-selection":
      return resetSelection(state);
    case "quick-add":
      return addToList(state, payload.id);
    default:
      return state;
  }
}
