import { DEFAULT_STATE, STORAGE_KEY } from "./config.js";
import { renderApp } from "./render.js";
import { loadState, saveState } from "./state.js";
import { getProductById } from "./utils.js";

const state = loadState();

function applyAction(action, payload = {}) {
  if (action === "set-view") {
    state.currentView = payload.view || "catalog";
    renderApp(state);
    saveState(state);
    return;
  }

  if (action === "toggle-favorite") {
    const product = getProductById(state, payload.id);
    if (!product) return;
    product.favorite = !product.favorite;
  }

  if (action === "toggle-list") {
    const product = getProductById(state, payload.id);
    if (!product) return;
    product.inList = !product.inList;
    if (product.inList && !product.listQuantity) product.listQuantity = 1;
  }

  if (action === "adjust-quantity") {
    const product = getProductById(state, payload.id);
    if (!product) return;
    product.listQuantity = Math.max(1, (product.listQuantity || 1) + Number(payload.delta || 0));
  }

  if (action === "toggle-purchased") {
    const product = getProductById(state, payload.id);
    if (!product) return;
    product.purchased = !product.purchased;
    if (product.purchased) {
      product.lastPurchase = new Date().toISOString();
      product.frequency = (product.frequency || 0) + 1;
      product.purchaseHistory.push({ date: product.lastPurchase, amount: 1 });
    }
  }

  if (action === "reset-selection") {
    state.products = state.products.map((product) => ({
      ...product,
      inList: false,
      purchased: false,
      listQuantity: 1,
    }));
  }

  if (action === "set-menu-meal") {
    if (!state.weeklyMenu[payload.day]) return;
    state.weeklyMenu[payload.day][payload.slot] = payload.value;
  }

  if (action === "toggle-menu-day") {
    if (!state.weeklyMenu[payload.day]) return;
    state.weeklyMenu[payload.day].collapsed = !state.weeklyMenu[payload.day].collapsed;
  }

  saveState(state);
  renderApp(state);
}

export { state, applyAction };
