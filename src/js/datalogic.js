import data from "./data";
import state from "./state";
import { normalizeText } from "./utils";

/*Obtenir une liste de tous les identifiants de recettes
 @return {array} : la liste des identifiants.*/
 const getAllRecipeIds = () => {
  return data.recipes.map((elt) => elt.id);
};

/*
 Obtenir les données de recettes complètes à partir des identifiants
 @return  {array}: tableau*/
 const getFullRecipesFromIds = (idsArray) => {
  return data.recipes.filter((recipe) => idsArray.includes(recipe.id));
};

/*
 Chercher et Obtenir une liste de tous les ingrédients de toutes les recettes
  @return  {array}  : La liste des ingrédients.*/
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

/*Obtenir une seule chaîne avec tous les ingrédients d'une recette
 @param   {object}  : recette.
 @returns {string} : chaine d'ingrédients*/
const getIngredientsStringFromRecipe = (recipe) => {
  let ingredientsString = "";
  recipe.ingredients.forEach((ing) => {
    ingredientsString += ` ${normalizeText(ing.ingredient)}`;
  });
  return ingredientsString;
};

/*Obtenir une liste de tous les ingrédients(objets) de toutes les recettes sous forme de tableau
  @param   {array}  tagListe : le tableau des filtres.
  @return  {object} : objet*/
const createTagObject = (tagList) => {
  let tagObj = {};
  tagList.forEach((tag) => (tagObj[normalizeText(tag.name)] = []));

  return tagObj;
};

/*Obtenir un objet avec tous les noms d'ingrédients
 @return  {object} : objet*/
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

/*Obtenir une liste de tous les ustensils de cuisine de toutes les recettes
 @return {array} : la liste sous forme de tableau*/
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

/* Obtenir un objet avec tous les noms d'ustensils
 @return  {object}: objet*/
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

/*Obtenir un objet avec tous les noms d'appareils 
  @return  {object} : objet*/
const getAppliancesObject = () => {
  let appliancesObject = createTagObject(getAllAppliances());

  data.recipes.forEach((recipe) => {
    const objKey = normalizeText(recipe.appliance);
    appliancesObject[objKey].push(recipe.id);
  });

  return appliancesObject;
};

/*Obtenirune liste de tous les appareils ménagers de toutes les recettes
  @return {array} la liste des appareils*/
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

/*Initialiser l'état avec les données initiales
  @returns : {void}*/
  const initializeState = () => {
    state.displayedIng = getAllIngredients();
    state.displayedApp = getAllAppliances();
    state.displayedUst = getAllUstensils();
    state.displayedRecipes = getAllRecipeIds();
    state.ingObj = getIngredientsObject();
    state.appObj = getAppliancesObject();
    state.ustObj = getUstensilsObject();
  };

export {
  initializeState,
  getIngredientsStringFromRecipe,
  getFullRecipesFromIds,
  getAllRecipeIds,
};
