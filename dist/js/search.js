import data from "./data";
import state from "./state";
import {
  getIngredientsStringFromRecipe,
  getFullRecipesFromIds,
  getAllRecipeIds,
} from "./datalogic";
import { normalizeText } from "./utils";
import {
  getVisibleFilters,
  createFilterElt,
  clearAllFilters,
  getAllFiltersLength,
} from "./filters";
import {
  createRecipeElement,
  removeRecipeById,
  createAllRecipes,
} from "./recipes";
/* Gérer les conditions de recherche algo
 @param {object} événement de navigateur evt
   @returns {void}*/
const manageSearchInput = (evt) => {
  evt.preventDefault();
  state.currentSearch = evt.target.value;
  completeSearch();
};
/* Rechercher des recettes à partir de l'entrée de recherche
 @returns {void}*/
const searchByInput = () => {
  const mainContentElt = document.getElementById("main-content");
  const value = state.currentSearch;
  state.displayedRecipes = [];

  if (value.length > 2) {
    let recipesFromTitle = [];
    let recipesFromDescription = [];

    data.recipes.forEach((recipe) => {
      if (normalizeText(recipe.name).includes(normalizeText(value))) {
        removeRecipeById(recipe.id);
        mainContentElt.appendChild(createRecipeElement(recipe));
        state.displayedRecipes.push(recipe.id);
      } else {
        recipesFromTitle.push(recipe);
        removeRecipeById(recipe.id);
      }
    });

    recipesFromTitle.forEach((recipe) => {
      if (normalizeText(recipe.description).includes(normalizeText(value))) {
        removeRecipeById(recipe.id);
        mainContentElt.appendChild(createRecipeElement(recipe));
        state.displayedRecipes.push(recipe.id);
      } else {
        recipesFromDescription.push(recipe);
        removeRecipeById(recipe.id);
      }
    });

    recipesFromDescription.forEach((recipe) => {
      if (
        getIngredientsStringFromRecipe(recipe).includes(normalizeText(value))
      ) {
        removeRecipeById(recipe.id);
        mainContentElt.appendChild(createRecipeElement(recipe));
        state.displayedRecipes.push(recipe.id);
      } else {
        removeRecipeById(recipe.id);
      }
    });
  } else {
    mainContentElt.innerHTML = "";
  }
};
/*Rechercher des recettes à partir de filtres
  @returns {void}*/
const searchByTag = () => {
  const {
    ingLabels,
    appLabels,
    ustLabels,
    displayedRecipes,
    ingObj,
    appObj,
    ustObj,
    currentSearch,
  } = state;

  let arrayOfRecipes = displayedRecipes;

  if (currentSearch.length < 3 && getAllFiltersLength() > 0) {
    arrayOfRecipes = getAllRecipeIds();
    createAllRecipes();
  }

  arrayOfRecipes.forEach((idRecipe) => {
    const displayedRecipe = document.getElementById(idRecipe);

    ingLabels.forEach((ing) => {
      if (!ingObj[ing].includes(idRecipe))
        displayedRecipe.style.display = "none";
    });

    appLabels.forEach((app) => {
      if (!appObj[app].includes(idRecipe))
        displayedRecipe.style.display = "none";
    });

    ustLabels.forEach((ust) => {
      if (!ustObj[ust].includes(idRecipe))
        displayedRecipe.style.display = "none";
    });
  });
};

/*Afficher les filtres des recettes affichées
 @returns {void}*/
const displayRemainingTags = () => {
  let recipesToConsider = [];

  if (state.currentSearch.length < 3 && getAllFiltersLength() === 0) {
    recipesToConsider = data.recipes;
  } else {
    const allRecipes = document.querySelectorAll("#main-content article");
    const visileRecipesIds = Array.from(allRecipes)
      .filter((elt) => elt.style.display === "block")
      .map((elt) => parseInt(elt.id));
    recipesToConsider = getFullRecipesFromIds(visileRecipesIds);
  }

  clearAllFilters();
  recipesToConsider.forEach((recipe) => displayFiltersFromRecipes(recipe));
};
/*Afficher les filtres d'ingrédients inclus dans les recettes affichées
  @param {object} recette la recette ajoutée
  @returns {void}*/
const displayFiltersFromRecipes = (recipe) => {
  displayIngredientsFromRecipe(recipe);
  displayAppliancesFromRecipe(recipe);
  displayUstensilsFromRecipe(recipe);
};

/*Afficher les filtres d'ingrédients inclus dans les recettes affichées
  @param {object} recette la recette ajoutée
  @returns {void}*/
const displayIngredientsFromRecipe = (recipe) => {
  const ingListElt = document.getElementById("ing-filter-list");
  const visibleIngFilters = getVisibleFilters("ing");

  recipe.ingredients.forEach((ing) => {
    if (!visibleIngFilters.includes(ing.ingredient.toLowerCase()))
      ingListElt.appendChild(
        createFilterElt("ing", ing.ingredient.toLowerCase())
      );
  });
};

/*Afficher les filtres de l'appareil inclus dans les recettes affichées
 @param   {object} recipe : la recette ajoutée
 @returns {void}*/
const displayAppliancesFromRecipe = (recipe) => {
  const appListElt = document.getElementById("app-filter-list");
  const visibleAppFilters = getVisibleFilters("app");

  if (!visibleAppFilters.includes(recipe.appliance.toLowerCase()))
    appListElt.appendChild(
      createFilterElt("app", recipe.appliance.toLowerCase())
    );
};

/*Afficher les filtres à ustensiles inclus dans les recettes affichées
 @param {object} recette la recette ajoutée
  @returns {void}*/
const displayUstensilsFromRecipe = (recipe) => {
  const ustListElt = document.getElementById("ust-filter-list");
  const visibleUstFilters = getVisibleFilters("ust");

  recipe.ustensils.forEach((ust) => {
    if (!visibleUstFilters.includes(ust.toLowerCase()))
      ustListElt.appendChild(createFilterElt("ust", ust.toLowerCase()));
  });
};

/*Afficher "aucun résultat" lorsqu'aucune recette n'est affichée
 @returns {void}*/
const checkSearchResults = () => {
  const allRecipes = document.querySelectorAll("#main-content article");
  const mainContentElt = document.getElementById("result");

  const hiddenRecipes = Array.from(allRecipes).filter(
    (elt) => elt.style.display === "none"
  );

  if (allRecipes.length === 0 || hiddenRecipes.length === allRecipes.length) {
    if (state.currentSearch.length < 3 && getAllFiltersLength() === 0) {
      mainContentElt.textContent = "";
    } else {
      mainContentElt.textContent =
        "Aucune recette ne correspond à ce critère…";
    }
  } else {
    mainContentElt.textContent = "";
  }
};

/*Toutes les étapes de la recherche
 @returns {void}*/
const completeSearch = () => {
  searchByInput();
  searchByTag();
  displayRemainingTags();
  checkSearchResults();
};

export { manageSearchInput, completeSearch };
