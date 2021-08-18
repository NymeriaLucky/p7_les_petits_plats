import data from "./data";
import state from "./state";

import { normalizeText } from "./utils";

/**
 *Obtenir une liste de tous les ingredients de recettes
 * @return  {array}   Liste des ingredients
 */
const getAllIngredients = () => {
  let ingredients = [];
  data.recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      if (!ingredients.includes(ing.ingredient.toLowerCase()))
        ingredients.push(ing.ingredient.toLowerCase());
    });
  });
  return ingredients.map((ing) => ({
    type: "ing",
    name: ing,
  }));
};

/**
 * Obtenir une liste de tous les appareils ménagers de toutes les recettes
 * @return  {array} Liste des appareils
 */
const getAllAppliances = () => {
  let appliances = [];
  data.recipes.forEach((recipe) => {
    if (!appliances.includes(recipe.appliance.toLowerCase()))
      appliances.push(recipe.appliance.toLowerCase());
  });
  return appliances.map((app) => ({
    type: "app",
    name: app,
  }));
};

/**
 * Obtenir une liste de tous les ustensils de cuisine de toutes les recettes
 * @return  {array}  Liste des ustensils
 */
const getAllUstensils = () => {
  let ustensils = [];
  data.recipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      if (!ustensils.includes(ustensil.toLowerCase()))
        ustensils.push(ustensil.toLowerCase());
    });
  });
  return ustensils.map((ust) => ({
    type: "ust",
    name: ust,
  }));
};

/**
 * Obtenir une liste de tous les identifiants de recettes
 * @return  {array}  liste des identifiants
 */
const getAllRecipeIds = () => {
  return data.recipes.map((elt) => elt.id);
};

/**
 * Initialiser l'état avec les données initiales
 * @returns {void}
 */
const initializeState = () => {
  state.displayedIng = getAllIngredients();
  state.displayedApp = getAllAppliances();
  state.displayedUst = getAllUstensils();
  state.displayedRecipes = getAllRecipeIds();
  state.ingObj = getIngredientsObject();
  state.appObj = getAppliancesObject();
  state.ustObj = getUstensilsObject();
};

/**
 * Obtenir une seule chaîne avec tous les ingrédients d'une recette
 * @param   {object} recipe
 * @returns {string}  
 */
const getIngredientsStringFromRecipe = (recipe) => {
  let ingredientsString = "";
  recipe.ingredients.forEach((ing) => {
    ingredientsString += ` ${normalizeText(ing.ingredient)}`;
  });
  return ingredientsString;
};

/**
 * Obtenir une liste de tous les ingredients(Objets) de toutes les recettes sous forme de tableau
 * @param   {array}  tagList  Tableau des filtres
 * @return  {object}
 */
const createTagObject = (tagList) => {
  let tagObj = {};
  tagList.forEach((tag) => (tagObj[normalizeText(tag.name)] = []));

  return tagObj;
};

/**
 * Obtenir un objet avec tous les noms d'ingrédients
 * @return  {object}
 */
const getIngredientsObject = () => {
  let ingredientsObject = createTagObject(getAllIngredients());
  data.recipes.forEach((recipe) => {
    recipe.ingredients.forEach((elt) => {
      const objKey = normalizeText(elt.ingredient);
      ingredientsObject[objKey].push(recipe.id);
    });
  });
  return ingredientsObject;
};

/**
 * Obtenir un objet avec tous les noms d'appareils
 * @return  {object}
 */
const getAppliancesObject = () => {
  let appliancesObject = createTagObject(getAllAppliances());

  data.recipes.forEach((recipe) => {
    const objKey = normalizeText(recipe.appliance);
    appliancesObject[objKey].push(recipe.id);
  });

  return appliancesObject;
};

/**
 * Obtenir un objet avec tous les noms d'ustensils
 * @return  {object}
 */
const getUstensilsObject = () => {
  let ustensilsObject = createTagObject(getAllUstensils());

  data.recipes.forEach((recipe) => {
    recipe.ustensils.forEach((elt) => {
      const objKey = normalizeText(elt);
      ustensilsObject[objKey].push(recipe.id);
    });
  });

  return ustensilsObject;
};

/**
 * Obtenir les données de recettes complètes à partir des identifiants sous forme de tableau
 * @return  {array}
 */
const getFullRecipesFromIds = (idsArray) => {
  return data.recipes.filter((recipe) => idsArray.includes(recipe.id));
};

export {
  initializeState,
  getIngredientsStringFromRecipe,
  getFullRecipesFromIds,
  getAllRecipeIds,
};
