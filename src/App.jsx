import { useEffect, useMemo, useState, useRef } from "react";
import pkg from "../package.json";

const initialIngredients = [
  { id: 1, name: "Tomatoes", quantity: 6, unit: "pcs", note: "Fresh", expiryDate: "2026-06-10" },
  { id: 2, name: "Olive Oil", quantity: 1, unit: "bottle", note: "Extra virgin", expiryDate: "2026-12-01" },
  { id: 3, name: "Garlic", quantity: 3, unit: "cloves", note: "Peeled", expiryDate: "2026-06-08" },
  { id: 4, name: "Milk", quantity: 2, unit: "carton", note: "Low fat", expiryDate: "2026-06-09" },
  { id: 5, name: "Lettuce", quantity: 1, unit: "head", note: "Crisp", expiryDate: "2026-06-07" },
  { id: 6, name: "Strawberries", quantity: 12, unit: "pcs", note: "Sweet", expiryDate: "2026-06-11" },
  { id: 7, name: "Bread", quantity: 1, unit: "loaf", note: "Whole grain", expiryDate: "2026-06-08" },
  { id: 8, name: "Yogurt", quantity: 4, unit: "cups", note: "Plain", expiryDate: "2026-06-14" },
  { id: 9, name: "Basil", quantity: 1, unit: "bunch", note: "Fresh", expiryDate: "2026-06-09" },
  { id: 10, name: "Limes", quantity: 3, unit: "pcs", note: "Juicy", expiryDate: "2026-06-12" }
];

const initialRecipes = [
  {
    id: 1,
    title: "Spaghetti Bolognese",
    source: "Default recipe",
    description: "A hearty Italian classic with a rich meat sauce simmered slowly and tossed with spaghetti for a comforting dinner.",
    ingredients: ["Spaghetti", "Ground beef", "Tomato sauce", "Onion", "Garlic", "Olive oil"],
    instructions: [
      "Heat olive oil in a saucepan and cook chopped onion and garlic until translucent.",
      "Add ground beef and cook until browned.",
      "Pour in tomato sauce, season with salt and pepper, and simmer for 20 minutes.",
      "Cook spaghetti according to package directions.",
      "Serve the sauce over pasta with grated Parmesan."
    ]
  },
  {
    id: 2,
    title: "Chicken Caesar Salad",
    source: "Default recipe",
    description: "A fresh and crisp salad with grilled chicken, crunchy romaine, and creamy Caesar dressing for a simple weeknight meal.",
    ingredients: ["Romaine lettuce", "Chicken breast", "Croutons", "Parmesan", "Caesar dressing"],
    instructions: [
      "Grill or pan-sear chicken breast until fully cooked, then slice.",
      "Toss chopped romaine lettuce with Caesar dressing.",
      "Add croutons, shaved Parmesan, and sliced chicken.",
      "Toss gently and serve chilled."
    ]
  },
  {
    id: 3,
    title: "Pancakes",
    source: "Default recipe",
    description: "Fluffy pancakes made from scratch and served warm with butter and maple syrup for an easy breakfast or brunch.",
    ingredients: ["Flour", "Milk", "Eggs", "Baking powder", "Butter", "Maple syrup"],
    instructions: [
      "Mix flour, baking powder, milk, and eggs until smooth.",
      "Heat a nonstick pan and melt a little butter.",
      "Pour batter in rounds and cook until bubbles form.",
      "Flip pancakes and cook until golden.",
      "Serve with maple syrup."
    ]
  },
  {
    id: 4,
    title: "Beef Tacos",
    source: "Default recipe",
    description: "Build tacos with seasoned ground beef, fresh toppings, and crispy shells for a fast and flavorful meal.",
    ingredients: ["Taco shells", "Ground beef", "Cheddar cheese", "Lettuce", "Tomato", "Sour cream"],
    instructions: [
      "Cook ground beef in a skillet with taco seasoning.",
      "Warm taco shells in the oven or microwave.",
      "Fill shells with beef, shredded lettuce, chopped tomato, and cheese.",
      "Top with sour cream and serve immediately."
    ]
  },
  {
    id: 5,
    title: "Margherita Pizza",
    source: "Default recipe",
    description: "A simple pizza topped with tomato sauce, fresh mozzarella, and basil for a bright and classic flavor profile.",
    ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil", "Olive oil"],
    instructions: [
      "Preheat the oven to 475°F (245°C).",
      "Spread tomato sauce over rolled pizza dough.",
      "Top with sliced mozzarella and fresh basil leaves.",
      "Drizzle with olive oil and bake until crust is golden.",
      "Slice and serve hot."
    ]
  },
  {
    id: 6,
    title: "Vegetable Stir Fry",
    source: "Default recipe",
    description: "A vibrant stir fry of crisp vegetables tossed in savory sauce, ready in minutes and served over steamed rice.",
    ingredients: ["Broccoli", "Bell peppers", "Carrots", "Soy sauce", "Garlic", "Sesame oil"],
    instructions: [
      "Heat sesame oil in a wok or large pan.",
      "Add garlic, then stir-fry vegetables until crisp-tender.",
      "Add soy sauce and toss to coat evenly.",
      "Cook for another minute and serve over rice."
    ]
  },
  {
    id: 7,
    title: "Chicken Curry",
    source: "Default recipe",
    description: "A fragrant curry with tender chicken simmered in coconut milk and spices, perfect for pairing with rice or naan.",
    ingredients: ["Chicken thighs", "Curry powder", "Coconut milk", "Onion", "Garlic", "Rice"],
    instructions: [
      "Sauté chopped onion and garlic until soft.",
      "Add chicken and cook until lightly browned.",
      "Stir in curry powder and cook for 1 minute.",
      "Pour in coconut milk and simmer until chicken is cooked through.",
      "Serve with rice."
    ]
  },
  {
    id: 8,
    title: "Omelette",
    source: "Default recipe",
    description: "A quick egg omelette filled with cheese and chives, ideal for breakfast or a simple protein-packed meal.",
    ingredients: ["Eggs", "Milk", "Butter", "Cheddar cheese", "Chives"],
    instructions: [
      "Whisk eggs with a splash of milk and season with salt and pepper.",
      "Melt butter in a nonstick skillet over medium heat.",
      "Pour egg mixture into the pan and cook until edges set.",
      "Add cheese and chives, then fold the omelette in half.",
      "Slide onto a plate and serve."
    ]
  },
  {
    id: 9,
    title: "Greek Salad",
    source: "Default recipe",
    description: "A refreshing Mediterranean salad with crisp cucumber, juicy tomatoes, briny olives, and creamy feta cheese.",
    ingredients: ["Cucumber", "Tomatoes", "Olives", "Feta cheese", "Olive oil", "Red onion"],
    instructions: [
      "Chop cucumber, tomatoes, and red onion.",
      "Combine vegetables with olives and crumbled feta.",
      "Drizzle with olive oil and toss gently.",
      "Season with salt and pepper and serve chilled."
    ]
  },
  {
    id: 10,
    title: "Chocolate Chip Cookies",
    source: "Default recipe",
    description: "Soft-baked cookies with melty chocolate chips for an easy homemade dessert everyone will love.",
    ingredients: ["Flour", "Sugar", "Butter", "Eggs", "Chocolate chips", "Baking soda"],
    instructions: [
      "Preheat the oven to 350°F (175°C).",
      "Cream butter and sugar together, then add eggs.",
      "Mix in flour, baking soda, and chocolate chips.",
      "Drop spoonfuls of dough onto a baking sheet.",
      "Bake until cookies are golden brown."
    ]
  }
];

const initialOrders = [];

const STORAGE_KEY = "kitchen-app-state";

function readSavedState() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

function saveState(state) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore write errors
  }
}

const defaultSettings = {
  units: "metric", // or 'imperial'
  language: "en", // 'en' or 'es'
  contrast: "normal", // or 'high'
  // Allow build-time default via Vite env var `VITE_REMOTE_PROXY_URL`.
  // For deployed apps, set VITE_REMOTE_PROXY_URL in Vercel Environment Variables
  // to `https://<your-deployment>.vercel.app/api/proxy` (or your proxy URL).
  remoteProxyUrl: import.meta.env.VITE_REMOTE_PROXY_URL || ""
};

const translations = {
  en: {
    appName: "PantryPal",
    dashboard: "Dashboard",
    pantry: "Pantry",
    recipes: "Recipes",
    orders: "Orders",
    settings: "Settings",
    kitchenDashboard: "Kitchen Dashboard",
    pantrySummary: "A quick view of your pantry, recipes, and orders.",
    pantrySummaryTitle: "Today's Pantry Summary",
    kitchenOrders: "Kitchen Orders",
    importRecipe: "Import Recipe",
    importFetching: "Fetching recipe details from the page...",
    importing: "Importing…",
    recipesSaved: (n) => `${n} recipe(s) saved`,
    expiringIngredients: "Expiring Ingredients",
    pantryInventory: "Pantry Inventory",
    addIngredient: "Add Ingredient",
    recipeImported: "Recipe imported successfully.",
    unableImport: "Unable to import recipe from that URL. Please try a page that permits cross-origin requests.",
    noExpiringIngredients: "No expiring ingredients with a known expiry date.",
    noRecipesYet: "No recipes yet. Import one to begin.",
    backToRecipes: "← Back to recipes",
    ingredients: "Ingredients",
    instructions: "Instructions",
    pantryEmpty: "Your pantry is empty. Add ingredients to get started.",
    ordersSubtitle: "Track kitchen orders and expected delivery times.",
    orderFilters: { active: "Active", pending: "Pending", preparing: "Preparing", ready: "Ready", served: "Served" },
    noOrdersScheduled: "No orders currently scheduled.",
    noFilterOrdersFound: (f) => `No ${f} orders found.`,
    ingredientLabel: "Ingredient",
    quantityLabel: "Quantity",
    unitLabel: "Unit",
    expiryDateLabel: "Expiry date",
    notesLabel: "Notes",
    preferencesTitle: "Preferences",
    contrastLabel: "Contrast",
    todayButton: "Today",
    createOrder: "Create Order",
    orderThis: "Order this recipe",
    specialInstructionsPlaceholder: "Special instructions (optional)",
    unitsLabel: "Units",
    languageLabel: "Language",
    useLocalProxyLabel: "Use local proxy (when available)",
    clearSavedData: "Clear saved data",
    recipeURLPlaceholder: "https://example.com/recipes/chicken-curry",
    recipeURLLabel: "Recipe URL",
    recipeImports: "Recipe Imports",
    recipeImportsText: (n) => `${n} recipe(s) imported.`,
    totalIngredients: "Total Ingredients",
    lowStock: "Low Stock",
    expiringSoon: "Expiring Soon",
    savedRecipes: "Saved Recipes"
  },
  es: {
    appName: "PantryPal",
    dashboard: "Panel",
    pantry: "Despensa",
    recipes: "Recetas",
    orders: "Pedidos",
    settings: "Ajustes",
    kitchenDashboard: "Panel de Cocina",
    pantrySummary: "Una vista rápida de tu despensa, recetas y pedidos.",
    pantrySummaryTitle: "Resumen de la despensa de hoy",
    kitchenOrders: "Pedidos de cocina",
    importRecipe: "Importar receta",
    importFetching: "Obteniendo detalles de la receta desde la página...",
    importing: "Importando…",
    recipesSaved: (n) => `${n} recetas guardadas`,
    expiringIngredients: "Ingredientes a punto de caducar",
    pantryInventory: "Inventario de la despensa",
    addIngredient: "Agregar ingrediente",
    recipeImported: "Receta importada correctamente.",
    unableImport: "No se pudo importar la receta desde esa URL. Intenta con una página que permita solicitudes cross-origin.",
    noExpiringIngredients: "No hay ingredientes con fecha de caducidad conocida.",
    noRecipesYet: "No hay recetas todavía. Importa una para comenzar.",
    backToRecipes: "← Volver a recetas",
    ingredients: "Ingredientes",
    instructions: "Instrucciones",
    pantryEmpty: "Tu despensa está vacía. Agrega ingredientes para comenzar.",
    ordersSubtitle: "Sigue los pedidos y los tiempos de entrega.",
    orderFilters: { active: "Activas", pending: "Pendientes", preparing: "Preparando", ready: "Listas", served: "Servidas" },
    noOrdersScheduled: "No hay pedidos programados.",
    noFilterOrdersFound: (f) => `No se encontraron pedidos ${f}.`,
    ingredientLabel: "Ingrediente",
    quantityLabel: "Cantidad",
    unitLabel: "Unidad",
    expiryDateLabel: "Fecha de caducidad",
    notesLabel: "Notas",
    preferencesTitle: "Preferencias",
    contrastLabel: "Contraste",
    todayButton: "Hoy",
    createOrder: "Crear pedido",
    orderThis: "Pedir esta receta",
    specialInstructionsPlaceholder: "Instrucciones especiales (opcional)",
    unitsLabel: "Unidades",
    languageLabel: "Idioma",
    useLocalProxyLabel: "Usar proxy local (si está disponible)",
    clearSavedData: "Borrar datos guardados",
    recipeURLPlaceholder: "https://example.com/recipes/chicken-curry",
    recipeURLLabel: "URL de la receta",
    recipeImports: "Importaciones de recetas",
    recipeImportsText: (n) => `${n} recetas importadas.`,
    totalIngredients: "Ingredientes totales",
    lowStock: "Pocas existencias",
    expiringSoon: "Próximos a caducar",
    savedRecipes: "Recetas guardadas"
  },
  fr: {
    appName: "PantryPal",
    dashboard: "Tableau",
    pantry: "Garde-manger",
    recipes: "Recettes",
    orders: "Commandes",
    settings: "Paramètres",
    kitchenDashboard: "Tableau de Cuisine",
    pantrySummary: "Un aperçu rapide de votre garde-manger, recettes et commandes.",
    pantrySummaryTitle: "Résumé du garde-manger d'aujourd'hui",
    kitchenOrders: "Commandes de la cuisine",
    importRecipe: "Importer une recette",
    importFetching: "Récupération des détails de la recette...",
    importing: "Importation…",
    recipesSaved: (n) => `${n} recette(s) enregistrée(s)`,
    expiringIngredients: "Ingrédients périmant bientôt",
    pantryInventory: "Inventaire",
    addIngredient: "Ajouter un ingrédient",
    recipeImported: "Recette importée avec succès.",
    unableImport: "Impossible d'importer la recette depuis cette URL.",
    noExpiringIngredients: "Aucun ingrédient périmant proche connu.",
    noRecipesYet: "Pas encore de recettes. Importez-en une pour commencer.",
    backToRecipes: "← Retour aux recettes",
    ingredients: "Ingrédients",
    instructions: "Instructions",
    pantryEmpty: "Votre garde-manger est vide. Ajoutez des ingrédients pour commencer.",
    ordersSubtitle: "Suivez les commandes et les délais.",
    orderFilters: { active: "Actives", pending: "En attente", preparing: "Préparation", ready: "Prêtes", served: "Servies" },
    noOrdersScheduled: "Aucune commande en cours.",
    noFilterOrdersFound: (f) => `Aucune commande ${f} trouvée.`,
    ingredientLabel: "Ingrédient",
    quantityLabel: "Quantité",
    unitLabel: "Unité",
    expiryDateLabel: "Date de péremption",
    notesLabel: "Notes",
    preferencesTitle: "Préférences",
    contrastLabel: "Contraste",
    todayButton: "Aujourd'hui",
    createOrder: "Créer la commande",
    orderThis: "Commander cette recette",
    specialInstructionsPlaceholder: "Instructions spéciales (optionnel)",
    unitsLabel: "Unités",
    languageLabel: "Langue",
    useLocalProxyLabel: "Utiliser le proxy local (si disponible)",
    clearSavedData: "Effacer les données enregistrées",
    recipeURLPlaceholder: "https://example.com/recipes/chicken-curry",
    recipeURLLabel: "URL de la recette",
    recipeImports: "Importations de recettes",
    recipeImportsText: (n) => `${n} recette(s) importée(s).`,
    totalIngredients: "Ingrédients totaux",
    lowStock: "Stock faible",
    expiringSoon: "Périmant bientôt",
    savedRecipes: "Recettes enregistrées"
  },
  de: {
    appName: "PantryPal",
    dashboard: "Übersicht",
    pantry: "Vorrat",
    recipes: "Rezepte",
    orders: "Bestellungen",
    settings: "Einstellungen",
    kitchenDashboard: "Küchenübersicht",
    pantrySummary: "Ein schneller Überblick über Vorrat, Rezepte und Bestellungen.",
    pantrySummaryTitle: "Heutige Vorratsübersicht",
    kitchenOrders: "Küchenbestellungen",
    importRecipe: "Rezept importieren",
    importFetching: "Rezeptdetails werden abgerufen...",
    importing: "Importiere…",
    recipesSaved: (n) => `${n} Rezept(e) gespeichert`,
    expiringIngredients: "Bald ablaufende Zutaten",
    pantryInventory: "Vorratsinventar",
    addIngredient: "Zutat hinzufügen",
    recipeImported: "Rezept erfolgreich importiert.",
    unableImport: "Das Rezept konnte nicht von dieser URL importiert werden.",
    noExpiringIngredients: "Keine ablaufenden Zutaten mit bekanntem Ablaufdatum.",
    noRecipesYet: "Noch keine Rezepte. Importiere eines zum Start.",
    backToRecipes: "← Zurück zu den Rezepten",
    ingredients: "Zutaten",
    instructions: "Anleitung",
    pantryEmpty: "Ihr Vorrat ist leer. Fügen Sie Zutaten hinzu.",
    ordersSubtitle: "Verfolge Bestellungen und Lieferzeiten.",
    orderFilters: { active: "Aktiv", pending: "Ausstehend", preparing: "In Vorbereitung", ready: "Fertig", served: "Ausgeliefert" },
    noOrdersScheduled: "Derzeit keine Bestellungen geplant.",
    noFilterOrdersFound: (f) => `Keine ${f} Bestellungen gefunden.`,
    ingredientLabel: "Zutat",
    quantityLabel: "Menge",
    unitLabel: "Einheit",
    expiryDateLabel: "Ablaufdatum",
    notesLabel: "Notizen",
    preferencesTitle: "Einstellungen",
    contrastLabel: "Kontrast",
    todayButton: "Heute",
    createOrder: "Bestellung erstellen",
    orderThis: "Dieses Rezept bestellen",
    specialInstructionsPlaceholder: "Besondere Anweisungen (optional)",
    unitsLabel: "Einheiten",
    languageLabel: "Sprache",
    useLocalProxyLabel: "Lokalen Proxy verwenden (falls verfügbar)",
    clearSavedData: "Gespeicherte Daten löschen",
    recipeURLPlaceholder: "https://example.com/recipes/chicken-curry",
    recipeURLLabel: "Rezept-URL",
    recipeImports: "Rezeptimporte",
    recipeImportsText: (n) => `${n} Rezept(e) importiert.`,
    totalIngredients: "Gesamtzutaten",
    lowStock: "Geringer Bestand",
    expiringSoon: "Bald ablaufend",
    savedRecipes: "Gespeicherte Rezepte"
  },
  pt: {
    appName: "PantryPal",
    dashboard: "Painel",
    pantry: "Despensa",
    recipes: "Receitas",
    orders: "Pedidos",
    settings: "Configurações",
    kitchenDashboard: "Painel da Cozinha",
    pantrySummary: "Uma visão rápida da sua despensa, receitas e pedidos.",
    pantrySummaryTitle: "Resumo da despensa de hoje",
    kitchenOrders: "Pedidos da cozinha",
    importRecipe: "Importar receita",
    importFetching: "Buscando detalhes da receita na página...",
    importing: "Importando…",
    recipesSaved: (n) => `${n} receita(s) salvas`,
    expiringIngredients: "Ingredientes expirando",
    pantryInventory: "Inventário da despensa",
    addIngredient: "Adicionar ingrediente",
    recipeImported: "Receita importada com sucesso.",
    unableImport: "Não foi possível importar a receita a partir dessa URL.",
    noExpiringIngredients: "Nenhum ingrediente expirando com data conhecida.",
    noRecipesYet: "Ainda sem receitas. Importe uma para começar.",
    backToRecipes: "← Voltar para receitas",
    ingredients: "Ingredientes",
    instructions: "Instruções",
    pantryEmpty: "Sua despensa está vazia. Adicione ingredientes para começar.",
    ordersSubtitle: "Acompanhe pedidos e tempos de entrega.",
    orderFilters: { active: "Ativos", pending: "Pendente", preparing: "Preparando", ready: "Pronto", served: "Servido" },
    noOrdersScheduled: "Nenhum pedido agendado.",
    noFilterOrdersFound: (f) => `Nenhum pedido ${f} encontrado.`,
    ingredientLabel: "Ingrediente",
    quantityLabel: "Quantidade",
    unitLabel: "Unidade",
    expiryDateLabel: "Data de validade",
    notesLabel: "Notas",
    preferencesTitle: "Preferências",
    contrastLabel: "Contraste",
    todayButton: "Hoje",
    createOrder: "Criar Pedido",
    orderThis: "Pedir esta receita",
    specialInstructionsPlaceholder: "Instruções especiais (opcional)",
    unitsLabel: "Unidades",
    languageLabel: "Idioma",
    useLocalProxyLabel: "Usar proxy local (quando disponível)",
    clearSavedData: "Limpar dados salvos",
    recipeURLPlaceholder: "https://example.com/recipes/chicken-curry",
    recipeURLLabel: "URL da receita",
    recipeImports: "Importações de receitas",
    recipeImportsText: (n) => `${n} receita(s) importada(s).`,
    totalIngredients: "Ingredientes totais",
    lowStock: "Estoque baixo",
    expiringSoon: "Expirando em breve",
    savedRecipes: "Receitas salvas"
  }
};

function getTranslation(lang, key, ...args) {
  const group = translations[lang] || translations.en;
  const entry = group[key];
  if (typeof entry === "function") return entry(...args);
  return entry || translations.en[key] || key;
}

function formatQuantity(quantity, unit, unitsPref) {
  if (!unit) return `${quantity}`;
  const u = (unit || "").toLowerCase();
  if (unitsPref === "metric") {
    if (u === "oz" || u === "ounce" || u === "ounces") {
      const g = Number(quantity) * 28.3495;
      return `${Math.round(g)} g`;
    }
    if (u === "lb" || u === "pound" || u === "pounds") {
      const kg = Number(quantity) * 0.453592;
      return `${kg.toFixed(2)} kg`;
    }
    if (u.includes("cup")) {
      const ml = Number(quantity) * 240;
      return `${Math.round(ml)} ml`;
    }
    return `${quantity} ${unit}`;
  }

  // imperial
  if (u === "g" || u === "gram" || u === "grams") {
    const oz = Number(quantity) / 28.3495;
    return `${Math.round(oz)} oz`;
  }
  if (u === "kg" || u === "kilogram" || u === "kilograms") {
    const lb = Number(quantity) / 0.453592;
    return `${lb.toFixed(2)} lb`;
  }
  if (u.includes("ml")) {
    const cups = Number(quantity) / 240;
    return `${cups.toFixed(2)} cups`;
  }

  return `${quantity} ${unit}`;
}

function convertIngredientsUnits(ingredients, fromUnits, toUnits) {
  if (!fromUnits || fromUnits === toUnits) return ingredients;
  const mapped = ingredients.map((item) => {
    if (!item || typeof item !== 'object') return item;
    const qty = Number(item.quantity || 0);
    const u = (item.unit || '').toLowerCase();
    let newQty = qty;
    let newUnit = item.unit;

    if (fromUnits === 'imperial' && toUnits === 'metric') {
      if (u === 'oz' || u === 'ounce' || u === 'ounces') {
        newQty = qty * 28.3495; newUnit = 'g';
      } else if (u === 'lb' || u === 'pound' || u === 'pounds') {
        newQty = qty * 0.453592; newUnit = 'kg';
      } else if (u.includes('cup')) {
        newQty = qty * 240; newUnit = 'ml';
      } else if (u === 'tbsp') {
        newQty = qty * 15; newUnit = 'ml';
      } else if (u === 'tsp') {
        newQty = qty * 5; newUnit = 'ml';
      }
    }

    if (fromUnits === 'metric' && toUnits === 'imperial') {
      if (u === 'g' || u === 'gram' || u === 'grams') {
        newQty = qty / 28.3495; newUnit = 'oz';
      } else if (u === 'kg' || u === 'kilogram' || u === 'kilograms') {
        newQty = qty / 0.453592; newUnit = 'lb';
      } else if (u === 'ml') {
        newQty = qty / 240; newUnit = 'cups';
      } else if (u === 'l') {
        newQty = qty * 4.22675; newUnit = 'cups';
      }
    }

    const roundedQty = typeof newQty === 'number' && !Number.isNaN(newQty)
      ? (Math.round((newQty + Number.EPSILON) * 100) / 100)
      : item.quantity;

    return { ...item, quantity: roundedQty, unit: newUnit };
  });
  return mapped;
}

async function fetchRecipeFromUrl(urlString) {
  try {
    // read saved settings if available to check for a remote proxy
    let saved = {};
    try { saved = readSavedState() || {}; } catch {}
    const currentSettings = saved.settings || defaultSettings;
    // Try direct fetch first (may fail due to CORS on many sites)
    let response = null;
    try {
      response = await fetch(urlString);
    } catch (err) {
      response = null;
    }

    if (response && response.ok) {
      const html = await response.text();
      return extractRecipeFromHtml(html, urlString);
    }

    // Fallback to a public CORS proxy (AllOrigins) which returns raw HTML
    // If a remote proxy is configured in settings, try it before public proxies
    try {
      if (currentSettings.remoteProxyUrl && currentSettings.remoteProxyUrl.trim()) {
        const base = currentSettings.remoteProxyUrl.trim();
        const proxyUrl = base + (base.includes('?') ? '&' : (base.endsWith('/') ? '' : '')) + "?url=" + encodeURIComponent(urlString);
        const proxyResp = await fetch(proxyUrl);
        if (proxyResp && proxyResp.ok) {
          const html = await proxyResp.text();
          return extractRecipeFromHtml(html, urlString);
        }
      }
    } catch (err) {
      // ignore and try public proxy next
    }

    try {
      const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(urlString);
      const proxyResp = await fetch(proxyUrl);
      if (proxyResp && proxyResp.ok) {
        const html = await proxyResp.text();
        return extractRecipeFromHtml(html, urlString);
      }
    } catch (err) {
      // ignore and try next fallback
    }

    // As a last resort try jina.ai text proxy which can extract page content
    try {
      const jinaUrl = "https://r.jina.ai/http://" + urlString.replace(/^https?:\/\//, "");
      const jinaResp = await fetch(jinaUrl);
      if (jinaResp && jinaResp.ok) {
        const html = await jinaResp.text();
        return extractRecipeFromHtml(html, urlString);
      }
    } catch (err) {
      // ignore
    }

    return null;
  } catch {
    return null;
  }
}

function extractRecipeFromHtml(html, source) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const title = extractTitle(doc, source);
  const description = extractDescription(doc) || "Imported recipe details pulled from the source page.";
  const jsonLd = extractJsonLdRecipe(doc);

  const ingredients = jsonLd?.ingredients || findSectionItems(doc, /ingredient/);
  const instructions = jsonLd?.instructions || findSectionItems(doc, /(instruction|direction|method|preparation)/);

  return {
    title: title || "Imported Recipe",
    source,
    description,
    ingredients: ingredients.length ? ingredients : createFallbackIngredients(title),
    instructions: instructions.length ? instructions : createFallbackInstructions(title)
  };
}

function extractTitle(doc, source) {
  return (
    doc.querySelector('meta[property="og:title"]')?.content ||
    doc.querySelector('meta[name="twitter:title"]')?.content ||
    doc.querySelector('title')?.textContent?.trim() ||
    source
  );
}

function extractDescription(doc) {
  return (
    doc.querySelector('meta[property="og:description"]')?.content ||
    doc.querySelector('meta[name="description"]')?.content ||
    doc.querySelector('meta[name="twitter:description"]')?.content ||
    ""
  ).trim();
}

function extractJsonLdRecipe(doc) {
  const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
  for (const script of scripts) {
    try {
      const raw = JSON.parse(script.textContent || "");
      const nodes = Array.isArray(raw) ? raw : [raw];
      for (const node of nodes) {
        const recipe = findRecipeObject(node);
        if (recipe) return recipe;
      }
    } catch {
      continue;
    }
  }
  return null;
}

function findRecipeObject(item) {
  if (!item || typeof item !== "object") return null;

  const type = item["@type"] || item["@type"];
  const types = Array.isArray(type) ? type : [type];
  if (types.includes("Recipe")) {
    return {
      ingredients: normalizeIngredients(item.recipeIngredient || item.ingredients || []),
      instructions: normalizeInstructions(item.recipeInstructions || item.recipeDirection || [])
    };
  }

  if (item["@graph"]) {
    const graph = Array.isArray(item["@graph"]) ? item["@graph"] : [item["@graph"]];
    for (const node of graph) {
      const recipe = findRecipeObject(node);
      if (recipe) return recipe;
    }
  }

  if (Array.isArray(item)) {
    for (const node of item) {
      const recipe = findRecipeObject(node);
      if (recipe) return recipe;
    }
  }

  return null;
}

function normalizeIngredients(raw) {
  if (!raw) return [];
  if (typeof raw === "string") {
    return raw
      .split(/\r?\n|,|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return raw.map((item) => (typeof item === "string" ? item.trim() : item?.name || "")).filter(Boolean);
}

function normalizeInstructions(raw) {
  if (!raw) return [];
  if (typeof raw === "string") {
    return raw
      .split(/\r?\n|\.|;/)
      .map((step) => step.trim())
      .filter(Boolean);
  }
  if (Array.isArray(raw)) {
    return raw
      .flatMap((item) => {
        if (typeof item === "string") return item.trim();
        if (item?.text) return item.text.trim();
        if (Array.isArray(item?.itemListElement)) {
          return item.itemListElement.map((entry) => entry.text?.trim() || "").filter(Boolean);
        }
        return "";
      })
      .filter(Boolean);
  }
  return [];
}

function createFallbackIngredients(title) {
  const words = title
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  const fallback = ["Salt", "Pepper", "Olive oil", "Water", "Garlic", "Onion"];
  return [...new Set([...words, ...fallback])].slice(0, 6);
}

function createFallbackInstructions(title) {
  const lower = title.toLowerCase();
  if (lower.includes("salad")) {
    return [
      "Chop fresh vegetables and combine them in a large bowl.",
      "Add dressing and toss gently until coated.",
      "Top with cheese or protein if desired.",
      "Serve immediately."
    ];
  }

  if (lower.includes("curry")) {
    return [
      "Sauté aromatics such as onion and garlic in oil.",
      "Add your protein or vegetables and cook until slightly browned.",
      "Stir in curry spices and add liquid.",
      "Simmer until everything is tender and serve with rice."
    ];
  }

  if (lower.includes("pancake") || lower.includes("pancakes")) {
    return [
      "Mix dry ingredients in one bowl and wet ingredients in another.",
      "Combine them gently until the batter is smooth.",
      "Cook rounds on a hot griddle until bubbles form.",
      "Flip and cook until golden brown."
    ];
  }

  if (lower.includes("taco") || lower.includes("tacos")) {
    return [
      "Cook seasoned protein or vegetables in a skillet.",
      "Warm tortillas or shells.",
      "Fill with your cooked mixture and toppings.",
      "Serve immediately."
    ];
  }

  if (lower.includes("pizza")) {
    return [
      "Preheat the oven and prepare pizza dough.",
      "Spread sauce over the dough and add cheese and toppings.",
      "Bake until the crust is crisp and cheese is melted.",
      "Slice and serve hot."
    ];
  }

  if (lower.includes("omelette") || lower.includes("omelet")) {
    return [
      "Whisk eggs with salt and pepper.",
      "Cook in a hot, buttered pan until the edges begin to set.",
      "Add fillings, fold, and cook until just done.",
      "Slide onto a plate and serve."
    ];
  }

  if (lower.includes("cookie") || lower.includes("cookies")) {
    return [
      "Preheat the oven and prepare a baking sheet.",
      "Mix wet and dry ingredients into a dough.",
      "Scoop dough onto the sheet and bake until golden.",
      "Cool briefly before serving."
    ];
  }

  return [
    "Gather your ingredients and prepare the workspace.",
    "Follow your recipe steps carefully, cooking until everything is done.",
    "Taste and adjust seasoning as needed.",
    "Serve warm or at room temperature."
  ];
}


export default function App() {
  const savedState = readSavedState();
  const [activePage, setActivePage] = useState(savedState.activePage || "dashboard");
  const [selectedRecipeId, setSelectedRecipeId] = useState(savedState.selectedRecipeId ?? null);
  const [ingredients, setIngredients] = useState(savedState.ingredients ?? initialIngredients);
  const [recipes, setRecipes] = useState(savedState.recipes ?? initialRecipes);
  const [orders, setOrders] = useState(savedState.orders ?? initialOrders);

  const [settings, setSettings] = useState(savedState.settings ?? defaultSettings);
  const [orderDraft, setOrderDraft] = useState(savedState.orderDraft ?? null);

  const prevUnitsRef = useRef(settings.units);
  useEffect(() => {
    if (prevUnitsRef.current && prevUnitsRef.current !== settings.units) {
      setIngredients((current) => convertIngredientsUnits(current, prevUnitsRef.current, settings.units));
    }
    prevUnitsRef.current = settings.units;
  }, [settings.units]);

  useEffect(() => {
    saveState({ activePage, selectedRecipeId, ingredients, recipes, orders, settings, orderDraft });
  }, [activePage, selectedRecipeId, ingredients, recipes, orders, settings, orderDraft]);

  const lowStockCount = useMemo(
    () => ingredients.filter((item) => item.quantity <= 2).length,
    [ingredients]
  );

  const expiringNowCount = useMemo(() => {
    const now = new Date();
    const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return ingredients.filter((item) => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      return expiry >= now && expiry <= soon;
    }).length;
  }, [ingredients]);

  const expiringIngredients = useMemo(
    () =>
      [...ingredients]
        .filter((item) => item.expiryDate)
        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
        .slice(0, 10),
    [ingredients]
  );

  const selectedRecipe = useMemo(
    () => recipes.find((recipe) => recipe.id === selectedRecipeId) || null,
    [recipes, selectedRecipeId]
  );

  const openRecipe = (recipeId) => {
    setSelectedRecipeId(recipeId);
    setActivePage("recipe");
  };

  const closeRecipe = () => {
    setSelectedRecipeId(null);
    setActivePage("recipes");
  };

  const t = (k, ...args) => getTranslation(settings.language, k, ...args);

  // Build contrast-aware overrides
  const contrast = settings?.contrast || 'normal';
  const appStyle = contrast === 'high'
    ? {
        ...styles.app,
        background: '#ffffff',
        color: '#000'
      }
    : styles.app;

  // Generate a few derived style overrides for high contrast
  const highContrastOverrides = contrast === 'high' ? {
    sidebar: { ...styles.sidebar, background: '#000', color: '#fff', borderRight: '2px solid #fff' },
    main: { ...styles.main, background: '#fff', color: '#000' },
    primaryButton: { ...styles.primaryButton, background: '#000', color: '#fff' },
    input: { ...styles.input, background: '#fff', color: '#000', border: '2px solid #000' },
    listCard: { ...styles.listCard, background: '#fff', border: '2px solid #000' }
  } : {};

  const appliedStyles = {
    app: appStyle,
    sidebar: highContrastOverrides.sidebar || styles.sidebar,
    main: highContrastOverrides.main || styles.main,
    primaryButton: highContrastOverrides.primaryButton || styles.primaryButton,
    input: highContrastOverrides.input || styles.input,
    listCard: highContrastOverrides.listCard || styles.listCard,
  };

  // Helper to read app version
  const appVersion = pkg?.version || '0.0.0';

  return (
    <div style={appliedStyles.app}>
      <div style={appliedStyles.sidebar}>
        <div style={styles.logo}>🌿 {t('appName')}</div>

        {[
          { key: "dashboard", icon: "🏠", label: t("dashboard") },
          { key: "pantry", icon: "🥫", label: t("pantry") },
          { key: "recipes", icon: "📚", label: t("recipes") },
          { key: "orders", icon: "🧾", label: t("orders") },
          { key: "settings", icon: "⚙️", label: t("settings") }
        ].map(({key, icon, label}) => (
          <button
            key={key}
            style={activePage === key ? styles.activeBtn : styles.btn}
            onClick={() => {
              setActivePage(key);
              if (key !== "recipe") setSelectedRecipeId(null);
            }}
          >
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div style={appliedStyles.main}>
        {activePage === "dashboard" && (
          <Dashboard
            ingredients={ingredients}
            recipes={recipes}
            orders={orders}
            lowStockCount={lowStockCount}
            expiringNowCount={expiringNowCount}
            expiringIngredients={expiringIngredients}
            settings={settings}
            t={(k, ...args) => getTranslation(settings.language, k, ...args)}
          />
        )}

        {activePage === "pantry" && (
          <Pantry ingredients={ingredients} setIngredients={setIngredients} settings={settings} t={(k)=>getTranslation(settings.language,k)} />
        )}

        {activePage === "recipes" && (
          <Recipes
            recipes={recipes}
            setRecipes={setRecipes}
            onOpenRecipe={openRecipe}
            settings={settings}
            t={(k)=>getTranslation(settings.language,k)}
            setOrderDraft={setOrderDraft}
            setActivePage={setActivePage}
          />
        )}

        {activePage === "recipe" && selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={closeRecipe}
            settings={settings}
            t={(k)=>getTranslation(settings.language,k)}
            setOrderDraft={setOrderDraft}
            setActivePage={setActivePage}
          />
        )}

        {activePage === "orders" && (
          <Orders
            orders={orders}
            setOrders={setOrders}
            settings={settings}
            t={(k)=>getTranslation(settings.language,k)}
            recipes={recipes}
            orderDraft={orderDraft}
            setOrderDraft={setOrderDraft}
          />
        )}

        {activePage === "settings" && (
          <Settings settings={settings} setSettings={setSettings} t={(k)=>getTranslation(settings.language,k)} />
        )}
      </div>
    </div>
  );
}

function Dashboard({ ingredients, recipes, orders, lowStockCount, expiringNowCount, expiringIngredients, settings, t }) {
  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <h1 style={{ marginBottom: 8, fontFamily: 'Georgia, serif', fontSize: 44, color: '#2b2b2b' }}>{t('kitchenDashboard')}</h1>
          <p style={styles.subtitle}>{t('pantrySummary')}</p>
        </div>
        <div style={styles.statusBadge}>{orders.length} active orders</div>
      </div>

      <div style={styles.cardRow}>
        <Card title={t('totalIngredients')} value={ingredients.length} />
        <Card title={t('lowStock')} value={lowStockCount} />
        <Card title={t('expiringSoon')} value={expiringNowCount} />
        <Card title={t('savedRecipes')} value={recipes.length} />
      </div>

      <div style={styles.panelRow}>
        <Panel
          title={t('pantrySummaryTitle')}
          text={`You have ${ingredients.length} ingredients in stock. ${lowStockCount} item(s) are low.`}
        />
        <Panel
          title={t('recipeImports')}
          text={recipes.length > 0 ? t('recipeImportsText', recipes.length) : t('noRecipesYet')}
        />
      </div>

      <div style={styles.expiringSection}>
        <div style={styles.fullPanel}>
          <Panel
            title={t('kitchenOrders')}
            text={orders.length > 0 ? `${orders.length} orders are currently open.` : t('noOrdersScheduled')}
          />
        </div>

        <div style={styles.expiringPanel}>
          <div style={styles.sectionHeader}>
            <h2>{t('expiringIngredients')}</h2>
            <span>{expiringIngredients.length} items</span>
          </div>
          {expiringIngredients.length === 0 ? (
            <p style={styles.emptyText}>{t('noExpiringIngredients')}</p>
          ) : (
            <div style={styles.expiringList}>
              {expiringIngredients.map((item) => (
                    <div key={item.id} style={styles.expiringRow}>
                      <div>
                        <strong>{item.name}</strong>
                        <div style={styles.itemMeta}>{formatQuantity(item.quantity, item.unit, settings?.units)}</div>
                      </div>
                      <div style={styles.expiryDate}>{new Date(item.expiryDate).toLocaleDateString()}</div>
                    </div>
                  ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Pantry({ ingredients, setIngredients, settings, t }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pcs");
  const [note, setNote] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const unitOptions = settings?.units === 'metric'
    ? ["pcs", "g", "kg", "ml", "l", "tbsp", "tsp"]
    : ["pcs", "oz", "lb", "cups", "tbsp", "tsp"];

  const addIngredient = () => {
    if (!name.trim()) return;

    setIngredients((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.trim(),
        quantity: Number(quantity) || 1,
        unit: unit || "pcs",
        note: note.trim() || "",
        expiryDate: expiryDate || undefined
      }
    ]);

    setName("");
    setQuantity(1);
    setUnit("pcs");
    setNote("");
    setExpiryDate("");
  };

  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>{t('pantry')}</h1>
      <p style={styles.subtitle}>{t('pantrySummary')}</p>

      <div style={styles.formGrid}>
        <label style={styles.fieldGroup}>
          {t('ingredientLabel')}
          <input
            style={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Basil"
          />
        </label>

        <label style={styles.fieldGroup}>
          {t('quantityLabel')}
          <input
            type="number"
            min="1"
            style={styles.input}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </label>

        <label style={styles.fieldGroup}>
          {t('unitLabel')}
          <select style={styles.input} value={unit} onChange={(event) => setUnit(event.target.value)}>
            {unitOptions.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </label>

        <label style={styles.fieldGroup}>
          {t('expiryDateLabel')}
          <input
            type="date"
            style={styles.input}
            value={expiryDate}
            onChange={(event) => setExpiryDate(event.target.value)}
          />
        </label>

        <label style={styles.fieldGroupFull}>
          {t('notesLabel')}
          <input
            style={styles.input}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Optional note or expiry"
          />
        </label>
      </div>

      <button style={styles.primaryButton} onClick={addIngredient}>{t('addIngredient')}</button>

      <div style={styles.listCard}>
        <div style={styles.sectionHeader}>
          <h2>{t('pantryInventory')}</h2>
          <span>{ingredients.length} ingredient(s)</span>
        </div>

        {ingredients.length === 0 ? (
          <p style={styles.emptyText}>{t('pantryEmpty')}</p>
        ) : (
          <div style={styles.itemGrid}>
            {ingredients.map((item) => (
              <div key={item.id} style={styles.itemRow}>
                <div>
                  <strong>{item.name}</strong>
                  <div style={styles.itemMeta}>{formatQuantity(item.quantity, item.unit, settings?.units)}</div>
                </div>
                <div style={styles.itemMeta}>{item.note || "—"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Recipes({ recipes, setRecipes, onOpenRecipe, settings, t, setOrderDraft, setActivePage }) {
  const [recipeUrl, setRecipeUrl] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const importRecipe = async () => {
    if (!recipeUrl.trim()) return;

    setIsImporting(true);
    setImportStatus(t('importFetching'));

    const parsed = await fetchRecipeFromUrl(recipeUrl.trim());
    if (!parsed) {
      setImportStatus(t('unableImport'));
      setIsImporting(false);
      return;
    }

    setRecipes((current) => [
      ...current,
      {
        id: Date.now(),
        title: parsed.title,
        source: parsed.source,
        description: parsed.description,
        ingredients: parsed.ingredients,
        instructions: parsed.instructions
      }
    ]);

    setRecipeUrl("");
    setImportStatus(t('recipeImported'));
    setIsImporting(false);
  };

  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>{t('recipes')}</h1>
      <p style={styles.subtitle}>{t('importRecipe')}</p>

      <div style={styles.listCard}>
        <div style={styles.sectionHeader}>
          <h2>{t('importRecipe')}</h2>
          <span>{t('recipesSaved', recipes.length)}</span>
        </div>

        <div style={styles.formGrid}>
          <label style={styles.fieldGroupFull}>
            {t('recipeURLLabel')}
            <input
              style={styles.input}
              value={recipeUrl}
              onChange={(event) => setRecipeUrl(event.target.value)}
              placeholder={t('recipeURLPlaceholder')}
            />
          </label>
        </div>

        <button style={styles.primaryButton} onClick={importRecipe} disabled={isImporting}>
          {isImporting ? t('importing') : t('importRecipe')}
        </button>
        {importStatus && <p style={styles.importStatus}>{importStatus}</p>}
      </div>

      <div style={{ ...styles.listCard, marginTop: 20 }}>
        <div style={styles.sectionHeader}>
          <h2>{t('savedRecipes')}</h2>
        </div>

        {recipes.length === 0 ? (
          <p style={styles.emptyText}>{t('noRecipesYet')}</p>
        ) : (
          <div style={styles.recipeGrid}>
            {recipes.map((recipe) => (
              <div key={recipe.id} style={styles.recipeCardClickable}>
                <div style={styles.recipeHeader}>
                  <div style={{ cursor: 'pointer' }} onClick={() => onOpenRecipe(recipe.id)}>
                    <strong>{recipe.title}</strong>
                    <div style={styles.recipeSource}>{recipe.source}</div>
                  </div>
                  <div>
                    <button
                      style={styles.primaryButton}
                      onClick={() => {
                        setOrderDraft({ recipe: recipe.title, servings: 1, instructions: '' });
                        setActivePage('orders');
                      }}
                    >Order</button>
                  </div>
                </div>
                <ul style={styles.recipeList}>
                  {recipe.ingredients.map((line, index) => (
                    <li key={index}>{typeof line === 'object' ? `${formatQuantity(line.quantity, line.unit, settings?.units)} ${line.name}` : line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RecipeDetail({ recipe, onBack, settings, t, setOrderDraft, setActivePage }) {
  const orderThis = () => {
    setOrderDraft({ recipe: recipe.title, servings: 1, instructions: "" });
    setActivePage('orders');
  };

  return (
    <div>
      <button style={styles.backButton} onClick={onBack}>{t('backToRecipes')}</button>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 20, alignItems: "flex-start" }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>{recipe.title}</h1>
          <p style={styles.subtitle}>Imported from: {recipe.source}</p>
          {recipe.description && <p style={styles.recipeDescription}>{recipe.description}</p>}
        </div>
        <div>
          <button style={styles.primaryButton} onClick={orderThis}>{t('orderThis')}</button>
        </div>
      </div>

      <div style={styles.recipeDetailGrid}>
        <div style={styles.listCard}>
          <div style={styles.sectionHeader}>
            <h2>{t('ingredients')}</h2>
          </div>
          <ul style={styles.recipeList}>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{typeof ingredient === 'object' ? `${formatQuantity(ingredient.quantity, ingredient.unit, settings?.units)} ${ingredient.name}` : ingredient}</li>
            ))}
          </ul>
        </div>

        <div style={styles.listCard}>
          <div style={styles.sectionHeader}>
            <h2>{t('instructions')}</h2>
          </div>
          <ol style={styles.instructionsList}>
            {recipe.instructions.map((step, index) => (
              <li key={index} style={styles.instructionItem}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Orders({ orders, setOrders, settings, t, recipes = [], orderDraft = null, setOrderDraft }) {
  const [filter, setFilter] = useState("active");
  const [customer, setCustomer] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [due, setDue] = useState("");
  const [servings, setServings] = useState(1);
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (orderDraft) {
      setRecipeName(orderDraft.recipe || "");
      setServings(orderDraft.servings || 1);
      setInstructions(orderDraft.instructions || "");
    }
  }, [orderDraft]);

  const filterLabels = t('orderFilters');
  const filterOptions = [
    { key: "active", label: filterLabels.active },
    { key: "pending", label: filterLabels.pending },
    { key: "preparing", label: filterLabels.preparing },
    { key: "ready", label: filterLabels.ready },
    { key: "served", label: filterLabels.served }
  ];

  const filteredOrders = filter === "active"
    ? orders
    : orders.filter((order) => order.status.toLowerCase() === filter);

  const addOrder = () => {
    if (!customer.trim() || !recipeName.trim()) return;
    const next = {
      id: Date.now(),
      customer: customer.trim(),
      recipe: recipeName.trim(),
      due: due || "ASAP",
      servings: servings || 1,
      instructions: instructions || "",
      status: "Pending"
    };
    setOrders((cur) => [next, ...cur]);
    setCustomer(""); setRecipeName(""); setDue(""); setServings(1); setInstructions("");
    if (setOrderDraft) setOrderDraft(null);
  };

  const advanceOrder = (id) => {
    setOrders((cur) => cur.map(o => {
      if (o.id !== id) return o;
      const s = (o.status || "").toLowerCase();
      const seq = ["pending", "preparing", "ready", "served"];
      const i = seq.indexOf(s);
      const next = i === -1 ? "pending" : (i < seq.length - 1 ? seq[i+1] : seq[i]);
      return { ...o, status: next.charAt(0).toUpperCase() + next.slice(1) };
    }));
  };

  const cancelOrder = (id) => {
    setOrders((cur) => cur.filter(o => o.id !== id));
  };

  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>{t('orders')}</h1>
      <p style={styles.subtitle}>{t('ordersSubtitle')}</p>

      <div style={{ ...styles.listCard, marginBottom: 18 }}>
        <div style={styles.sectionHeader}>
          <h3 style={{ margin: 0 }}>{t('preferencesTitle')}</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 220px', gap: 12, alignItems: 'center' }}>
          <input placeholder="Customer name" value={customer} onChange={(e)=>setCustomer(e.target.value)} style={styles.input} />

          <select value={recipeName} onChange={(e)=>setRecipeName(e.target.value)} style={styles.input}>
            <option value="">-- Select recipe or type name --</option>
            {recipes.map(r => <option key={r.id} value={r.title}>{r.title}</option>)}
          </select>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select value={servings} onChange={(e)=>setServings(Number(e.target.value))} style={{ ...styles.input, width: 110 }}>
                {Array.from({length:20},(_,i)=>i+1).map(n=> <option key={n} value={n}>{n} serving{n>1?'s':''}</option>)}
            </select>
            <input type="date" value={due} onChange={(e)=>setDue(e.target.value)} style={{ ...styles.input, width: 180 }} />
              <button style={styles.filterButton} onClick={()=> setDue(new Date().toISOString().slice(0,10)) }>{t('todayButton')}</button>
          </div>

          <textarea placeholder={t('specialInstructionsPlaceholder')} value={instructions} onChange={(e)=>setInstructions(e.target.value)} style={{ ...styles.input, gridColumn: '1 / -1', height: 80 }} />

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button style={styles.primaryButton} onClick={addOrder}>{t('createOrder')}</button>
          </div>
        </div>
      </div>

      <div style={styles.orderFilterRow}>
        {filterOptions.map((option) => (
          <button
            key={option.key}
            style={filter === option.key ? styles.filterButtonActive : styles.filterButton}
            onClick={() => setFilter(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div style={styles.listCard}>
        {filteredOrders.length === 0 ? (
          <p style={styles.emptyText}>
            {orders.length === 0
              ? t('noOrdersScheduled')
              : t('noFilterOrdersFound', filterLabels[filter])}
          </p>
        ) : (
          <div style={styles.orderGrid}>
            {filteredOrders.map((order) => (
              <div key={order.id} style={styles.orderRow}>
                <div>
                  <strong>{order.customer}</strong>
                  <div style={styles.itemMeta}>{order.recipe} {order.servings ? `• ${order.servings} serving${order.servings>1?'s':''}` : ''}</div>
                  {order.instructions ? <div style={{ color: '#666', marginTop: 6 }}>{order.instructions}</div> : null}
                </div>
                <div style={styles.orderInfo}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span>{order.due}</span>
                    <span style={styles.statusPill(order.status)}>{order.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={styles.filterButton} onClick={() => advanceOrder(order.id)}>Advance</button>
                    <button style={{ ...styles.filterButton, borderColor: '#f1c0c0' }} onClick={() => cancelOrder(order.id)}>Cancel</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h4 style={{ color: '#6b6b6b', margin: 0, fontSize: 13 }}>{title}</h4>
      <h2 style={{ marginTop: 10, marginBottom: 0, fontSize: 36, fontFamily: 'Georgia, serif', color: '#1f6f3a' }}>{value}</h2>
    </div>
  );
}

function Panel({ title, text }) {
  return (
    <div style={styles.panel}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <a style={{ fontSize: 13, color: '#9aa0a6', textDecoration: 'none' }}>View all</a>
      </div>
      <p style={{ color: "#666", marginTop: 6 }}>{text}</p>
    </div>
  );
}

function Settings({ settings, setSettings, t }) {
  const update = (patch) => setSettings({ ...settings, ...patch });

  const clearData = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>{t('settings')}</h1>
      <div style={{ ...styles.listCard, position: 'relative' }}>
        <div style={styles.sectionHeader}>
          <h2>{t('preferencesTitle')}</h2>
        </div>

        <label style={{ display: 'block', marginBottom: 12 }}>
          {t('unitsLabel')}:
          <select
            value={settings.units}
            onChange={(e) => update({ units: e.target.value })}
            style={{ marginLeft: 8 }}
          >
            <option value="metric">Metric</option>
            <option value="imperial">Imperial</option>
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Notifications:
          <input
            type="checkbox"
            checked={!!settings.notifications}
            onChange={(e) => update({ notifications: !!e.target.checked })}
            style={{ marginLeft: 8 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Theme:
          <select value={settings.theme || 'auto'} onChange={(e)=> update({ theme: e.target.value })} style={{ marginLeft: 8 }}>
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Default servings:
          <input type="number" min="1" max="20" value={settings.defaultServings || 1} onChange={(e)=> update({ defaultServings: Number(e.target.value) })} style={{ marginLeft: 8, width: 80 }} />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Auto-save interval:
          <select value={settings.autosaveInterval || 'off'} onChange={(e)=> update({ autosaveInterval: e.target.value })} style={{ marginLeft: 8 }}>
            <option value="off">Off</option>
            <option value="15">15s</option>
            <option value="30">30s</option>
            <option value="60">60s</option>
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <input type="checkbox" checked={!!settings.showTips} onChange={(e)=> update({ showTips: !!e.target.checked })} />
          <span style={{ marginLeft: 8 }}>Show tips</span>
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          {t('languageLabel')}:
          <select
            value={settings.language}
            onChange={(e) => update({ language: e.target.value })}
            style={{ marginLeft: 8 }}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="pt">Português</option>
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          {t('contrastLabel')}:
          <select
            value={settings.contrast || 'normal'}
            onChange={(e) => update({ contrast: e.target.value })}
            style={{ marginLeft: 8 }}
          >
            <option value="normal">Normal</option>
            <option value="high">High Contrast</option>
          </select>
        </label>

        <div style={{ marginTop: 18 }}>
          <button style={styles.primaryButton} onClick={clearData}>{t('clearSavedData')}</button>
        </div>

        <div style={{ position: 'absolute', right: 12, bottom: 10, color: '#999', fontSize: 12 }}>
          v{appVersion}
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    background: "linear-gradient(180deg, #fbfbfb 0%, #f8f6f4 100%)"
  },

  sidebar: {
    width: 240,
    background: "#ffffff",
    padding: 24,
    borderRight: "1px solid rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: 8
  },

  logo: {
    fontWeight: 800,
    fontSize: 18,
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#2b5a3a"
  },

  btn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "10px 12px",
    marginBottom: 8,
    border: "none",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    color: "#2b2b2b",
    borderRadius: 8,
    fontWeight: 600
  },

  activeBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "10px 12px",
    marginBottom: 8,
    border: "none",
    background: "#2f7a4a",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 800,
    color: "#ffffff",
    borderRadius: 10,
    boxShadow: "0 8px 22px rgba(47,122,74,0.08)"
  },

  main: {
    flex: 1,
    padding: 36,
    overflowY: "auto"
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 20
  },

  subtitle: {
    color: "#7a7a7a",
    marginTop: 0,
    marginBottom: 20,
    fontSize: 14
  },

  importStatus: {
    color: "#555",
    marginTop: 10,
    lineHeight: 1.5,
    fontSize: 14
  },

  recipeDescription: {
    color: "#444",
    marginTop: 12,
    marginBottom: 18,
    maxWidth: 700
  },

  statusBadge: {
    borderRadius: 999,
    background: "#e6f4ea",
    color: "#1f6f3a",
    padding: "10px 16px",
    fontWeight: 600
  },

  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 15,
    marginBottom: 20
  },

  card: {
    background: "white",
    padding: 22,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.04)",
    minHeight: 110,
    boxShadow: "0 6px 20px rgba(15,20,10,0.02)"
  },

  panelRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15,
    marginBottom: 20
  },

  expiringSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: 15,
    marginBottom: 20
  },

  expiringPanel: {
    background: "white",
    padding: 20,
    borderRadius: 16,
    border: "1px solid #eee",
    minHeight: 420,
    overflow: "hidden"
  },

  expiringList: {
    display: "grid",
    gap: 12,
    maxHeight: 340,
    overflowY: "auto",
    paddingRight: 4
  },

  expiringRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    background: "#fafafa",
    border: "1px solid #f0f0f3"
  },

  expiryDate: {
    color: "#555",
    fontSize: 13,
    fontWeight: 600
  },

  fullPanel: {
    marginTop: 10
  },

  panel: {
    background: "white",
    padding: 18,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.04)",
    boxShadow: "0 6px 18px rgba(15,20,10,0.03)"
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 20
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    textAlign: "left"
  },

  fieldGroupFull: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    textAlign: "left"
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #d9d9dd",
    fontSize: 16,
    outline: "none"
  },

  primaryButton: {
    background: "#2f7a4a",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    marginBottom: 20,
    boxShadow: "0 8px 18px rgba(47,122,74,0.06)"
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#1f6f3a",
    cursor: "pointer",
    marginBottom: 16,
    fontSize: 14,
    fontWeight: 700
  },

  recipeDetailGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: 16
  },

  instructionsList: {
    paddingLeft: 18,
    color: "#444"
  },

  instructionItem: {
    marginBottom: 12,
    lineHeight: 1.6
  },

  listCard: {
    background: "white",
    border: "1px solid #eee",
    borderRadius: 16,
    padding: 20
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 10
  },

  emptyText: {
    color: "#7a7a85",
    padding: "24px 0"
  },

  itemGrid: {
    display: "grid",
    gap: 12
  },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    background: "#fafafa",
    border: "1px solid #f0f0f3"
  },

  itemMeta: {
    color: "#777",
    fontSize: 14,
    marginTop: 4
  },

  recipeGrid: {
    display: "grid",
    gap: 16
  },

  recipeCardClickable: {
    background: "#fafafa",
    borderRadius: 14,
    border: "1px solid #ececec",
    padding: 18,
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.2s",
    userSelect: "none"
  },

  recipeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 10
  },

  recipeSource: {
    fontSize: 13,
    color: "#666"
  },

  recipeList: {
    paddingLeft: 18,
    margin: 0,
    color: "#444"
  },

  orderGrid: {
    display: "grid",
    gap: 12
  },

  orderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 14,
    background: "#fafafa",
    border: "1px solid #ececec"
  },

  orderInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
    color: "#555"
  },

  statusPill: (status) => ({
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    background: status === "Ready" ? "#d7f5e4" : "#fff4db",
    color: status === "Ready" ? "#18663b" : "#735b13",
    fontWeight: 600,
    fontSize: 13
  }),

  orderFilterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20
  },

  filterButton: {
    border: "1px solid #d9d9dd",
    background: "white",
    color: "#333",
    padding: "10px 14px",
    borderRadius: 999,
    cursor: "pointer"
  },

  filterButtonActive: {
    border: "1px solid #1f6f3a",
    background: "#e6f4ea",
    color: "#1f6f3a",
    padding: "10px 14px",
    borderRadius: 999,
    cursor: "pointer"
  }
};
