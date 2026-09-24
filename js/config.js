export const STORAGE_KEY = "smartcourses-v2";

export const DAY_LABELS = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];

export const APP_NAME = "SmartCourses";

export const DEFAULT_STATE = {
  theme: "light",
  currentView: "catalog",
  query: "",
  showSuggestions: true,
  showFavorites: true,
  categories: [
    { id: "fruit", name: "Fruits & légumes", order: 1 },
    { id: "dairy", name: "Produits laitiers", order: 2 },
    { id: "bakery", name: "Boulangerie", order: 3 },
    { id: "cleaning", name: "Nettoyage", order: 4 },
  ],
  products: [
    { id: "p1", categoryId: "fruit", name: "Pommes", favorite: false, inList: false, listQuantity: 1, purchased: false, lastPurchase: null, frequency: 0, purchaseHistory: [] },
    { id: "p2", categoryId: "fruit", name: "Bananes", favorite: true, inList: false, listQuantity: 1, purchased: false, lastPurchase: null, frequency: 0, purchaseHistory: [] },
    { id: "p3", categoryId: "dairy", name: "Lait", favorite: false, inList: false, listQuantity: 1, purchased: false, lastPurchase: null, frequency: 0, purchaseHistory: [] },
    { id: "p4", categoryId: "dairy", name: "Yaourt", favorite: true, inList: false, listQuantity: 1, purchased: false, lastPurchase: null, frequency: 0, purchaseHistory: [] },
    { id: "p5", categoryId: "bakery", name: "Pain", favorite: false, inList: false, listQuantity: 1, purchased: false, lastPurchase: null, frequency: 0, purchaseHistory: [] },
    { id: "p6", categoryId: "cleaning", name: "Lessive", favorite: false, inList: false, listQuantity: 1, purchased: false, lastPurchase: null, frequency: 0, purchaseHistory: [] },
  ],
  weeklyMenu: {
    lundi: { midi: "", soir: "", collapsed: false },
    mardi: { midi: "", soir: "", collapsed: false },
    mercredi: { midi: "", soir: "", collapsed: false },
    jeudi: { midi: "", soir: "", collapsed: false },
    vendredi: { midi: "", soir: "", collapsed: false },
    samedi: { midi: "", soir: "", collapsed: false },
    dimanche: { midi: "", soir: "", collapsed: false },
  },
  shoppingHistory: [],
  budget: 0,
};
