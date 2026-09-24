import { DAY_LABELS } from "./config.js";
import { categoryIcon, daysAgo, formatMoney, getProductById } from "./utils.js";

export function renderCatalog(state) {
  const query = (state.query || "").trim().toLowerCase();

  const visibleCategories = state.categories.filter((category) => {
    const items = state.products.filter((product) => product.categoryId === category.id);
    if (!query) return items.length > 0;
    return items.some((product) => product.name.toLowerCase().includes(query));
  });

  if (!visibleCategories.length) {
    return `
      <section class="card">
        <div class="empty-state">Aucun produit ne correspond à votre recherche.</div>
      </section>
    `;
  }

  return visibleCategories.map((category) => {
    const items = state.products.filter((product) => product.categoryId === category.id);
    const filtered = query ? items.filter((product) => product.name.toLowerCase().includes(query)) : items;

    if (!filtered.length) return "";

    const remaining = filtered.filter((product) => !product.purchased).length;

    return `
      <section class="card category-card" data-category-id="${category.id}">
        <div class="category-header" data-action="toggle-category" data-id="${category.id}">
          <span class="collapse-indicator ${state.currentView === "store" ? "is-open" : ""}">›</span>
          <div class="title">
            <span class="category-icon">${categoryIcon(category.name)}</span>
            <span class="category-name">${category.name}</span>
          </div>
          <span class="category-count">${state.currentView === "store" ? `${remaining}/${filtered.length}` : filtered.length}</span>
        </div>

        ${filtered.map((product) => {
          const metaText = daysAgo(product.lastPurchase);
          const suggestBadge = product.frequency > 0 && product.lastPurchase ? `<span class="badge warning">Rappel</span>` : "";

          if (state.currentView === "store") {
            return `
              <div class="store-row">
                <input type="checkbox" data-action="toggle-purchased" data-id="${product.id}" ${product.purchased ? "checked" : ""} />
                <div class="grow ${product.purchased ? "is-done" : ""}">${product.name}</div>
                ${suggestBadge}
                <span class="badge success">${product.listQuantity || 1}</span>
              </div>
            `;
          }

          return `
            <div class="product-row">
              <button class="favorite-button ${product.favorite ? "is-active" : ""}" data-action="toggle-favorite" data-id="${product.id}" aria-label="Ajouter aux favoris">★</button>

              <div class="product-main">
                <div class="product-name">${product.name} ${suggestBadge}</div>
                <div class="product-meta">${metaText}</div>
              </div>

              <div class="product-actions">
                <button class="qty-button" data-action="adjust-quantity" data-id="${product.id}" data-delta="-1">−</button>
                <span class="qty-value">${product.listQuantity || 1}</span>
                <button class="qty-button" data-action="adjust-quantity" data-id="${product.id}" data-delta="1">＋</button>
                <button class="icon-button" data-action="toggle-list" data-id="${product.id}">${product.inList ? "✓" : "+"}</button>
              </div>
            </div>
          `;
        }).join("")}
      </section>
    `;
  }).join("");
}

export function renderMenu(state) {
  const days = DAY_LABELS;

  return `
    <section class="card">
      <div class="card-header">
        <h2>Menu de la semaine</h2>
      </div>

      <div class="wrapper">
        ${days.map((day) => {
          const entry = state.weeklyMenu[day];
          const mealOptions = [
            "<option value=''>Aucun repas</option>",
            ...["Pâtes", "Poulet", "Salade", "Risotto", "Poisson", "Burger", "Gratin"].map(
              (meal) => `<option value="${meal}" ${entry.midi === meal || entry.soir === meal ? "selected" : ""}>${meal}</option>`
            )
          ].join("");

          return `
            <div class="menu-day">
              <div class="menu-toggle" data-action="toggle-menu-day" data-id="${day}">
                <span>${day.charAt(0).toUpperCase() + day.slice(1)}</span>
                <span class="collapse-indicator ${entry.collapsed ? "" : "is-open"}">›</span>
              </div>

              ${!entry.collapsed ? `
                <div class="menu-body">
                  <div>
                    <div class="meta">Midi</div>
                    <select class="menu-select" data-action="set-menu-meal" data-day="${day}" data-slot="midi">
                      ${mealOptions}
                    </select>
                  </div>

                  <div>
                    <div class="meta">Soir</div>
                    <select class="menu-select" data-action="set-menu-meal" data-day="${day}" data-slot="soir">
                      ${mealOptions}
                    </select>
                  </div>
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

export function renderBudget(state) {
  const totalSpent = state.shoppingHistory.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const average = state.shoppingHistory.length ? totalSpent / state.shoppingHistory.length : 0;

  return `
    <section class="card">
      <div class="card-header">
        <h2>Budget</h2>
      </div>

      <div class="summary-metrics">
        <div class="metric">
          <span class="metric-label">Total dépensé</span>
          <span class="metric-value">${formatMoney(totalSpent)}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Moyenne</span>
          <span class="metric-value">${formatMoney(average)}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Courses enregistrées</span>
          <span class="metric-value">${state.shoppingHistory.length}</span>
        </div>
      </div>

      <div class="card-header" style="margin-top: 20px;">
        <h3>Historique</h3>
      </div>

      ${state.shoppingHistory.length ? state.shoppingHistory.map((item) => `
        <div class="row-spread" style="padding: 8px 0; border-bottom: 1px solid var(--border);">
          <span>${new Date(item.date).toLocaleDateString("fr-FR")}</span>
          <strong>${formatMoney(item.amount)}</strong>
        </div>
      `).join("") : `<div class="empty-state">Aucun achat enregistré.</div>`}
    </section>
  `;
}

export function renderStore(state) {
  const listProducts = state.products.filter((product) => product.inList);

  return `
    <section class="card">
      <div class="card-header">
        <h2>Liste de courses</h2>
        <button class="secondary-button" data-action="reset-selection">Réinitialiser</button>
      </div>

      ${listProducts.length === 0 ? `<div class="empty-state">Aucune course dans la liste pour le moment.</div>` : listProducts.map((product) => `
        <div class="store-row">
          <input type="checkbox" data-action="toggle-purchased" data-id="${product.id}" ${product.purchased ? "checked" : ""} />
          <div class="grow ${product.purchased ? "is-done" : ""}">${product.name}</div>
          <div class="row">
            <button class="qty-button" data-action="adjust-quantity" data-id="${product.id}" data-delta="-1">−</button>
            <span class="qty-value">${product.listQuantity || 1}</span>
            <button class="qty-button" data-action="adjust-quantity" data-id="${product.id}" data-delta="1">＋</button>
          </div>
        </div>
      `).join("")}
    </section>
  `;
}

export function renderSuggestions(state) {
  const suggested = state.products.filter((product) => !product.inList && product.frequency > 0);
  if (!suggested.length) return "";

  return `
    <section class="card">
      <div class="card-header">
        <h3>Suggestions</h3>
      </div>

      <div class="wrapper">
        ${suggested.slice(0, 4).map((product) => `
          <div class="row-spread">
            <span>${product.name}</span>
            <button class="primary-button" data-action="toggle-list" data-id="${product.id}">Ajouter</button>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

export function renderApp(state) {
  const subtitle = document.getElementById("subtitle");
  if (subtitle) {
    const labels = {
      catalog: "Catalogue",
      store: "Liste de courses",
      menu: "Menu",
      budget: "Budget",
    };
    subtitle.textContent = labels[state.currentView] || "Catalogue";
  }

  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === state.currentView);
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = state.query;
  }

  const viewMap = {
    catalog: renderCatalog,
    store: renderStore,
    menu: renderMenu,
    budget: renderBudget,
  };

  const content = viewMap[state.currentView]?.(state) || renderCatalog(state);

  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <div class="wrapper">
      ${content}
      ${renderSuggestions(state)}
    </div>
  `;
}
