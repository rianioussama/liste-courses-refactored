export function categoryIcon(name = "") {
  const input = name.toLowerCase();

  if (input.includes("fruit") || input.includes("légume") || input.includes("legume")) return "🍋";
  if (input.includes("lait") || input.includes("yaourt") || input.includes("fromage")) return "🥛";
  if (input.includes("pain") || input.includes("boul") || input.includes("viennoiserie")) return "🥖";
  if (input.includes("lessive") || input.includes("nettoyage") || input.includes("menage")) return "🧽";
  if (input.includes("boisson") || input.includes("eau") || input.includes("jus")) return "🥤";
  return "🛒";
}

export function daysAgo(date) {
  if (!date) return "Jamais acheté";

  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);

  if (diff <= 0) return "Acheté aujourd'hui";
  if (diff === 1) return "Acheté hier";
  return `Acheté il y a ${diff} jours`;
}

export function formatMoney(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value || 0);
}

export function getProductById(state, id) {
  return state.products.find((product) => product.id === id);
}

export function getCategoryById(state, id) {
  return state.categories.find((category) => category.id === id);
}

export function getFilteredProducts(state) {
  const query = (state.query || "").trim().toLowerCase();
  if (!query) return state.products;
  return state.products.filter((product) => product.name.toLowerCase().includes(query));
}

export function getSuggestedProducts(state) {
  return state.products.filter((product) => !product.inList && product.frequency > 0 && product.lastPurchase);
}

export function getFavoriteProducts(state) {
  return state.products.filter((product) => product.favorite && !product.inList);
}

export function nextListQuantity(product) {
  return Math.max(1, product.listQuantity || 1);
}
