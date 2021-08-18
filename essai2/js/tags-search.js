import { recipes } from './recipes.js';

export let recipesFilteredByInput = recipes;
export let recipesFilteredByTags = recipesFilteredByInput;
let tags = { appliances: [], ingredients: [], ustensils: [] }; 
/**
 * fonction qui va créer un dropdown pour chaque nouveau tableau 
 * @param {array} recipes 
 * @returns 
 */
export const manageTags = (recipes, updateAll) => {
  recipesFilteredByInput = recipes;
  getCategories().forEach(createDropdown(updateAll))
};
/**
 * const res prend un tableau de categoryIds que l'on map en tableau clé / valeur [['appliances', newSet(), ...]]
 * et Object.fromEntries le transforme en objet pour pouvoir être manipulé
 * enfin Object.entries(res) tranforme l'objet res en tableau clé/valeur pour pouvoir map 
 * l'objet Set étant un ensemble de valeur unique, on doit donc réinjecter ses valeurs dans un tableau
 *  
 * @returns 
 */
const getCategories = () => { 
  const res = Object.fromEntries(['appliances', 'ingredients', 'ustensils'].map((id) => [id, new Set()]));  
  recipesFilteredByInput.forEach(({appliance, ingredients, ustensils}) => {
    res.appliances.add(appliance);
    ingredients.forEach(({ingredient}) => res.ingredients.add(ingredient));
    ustensils.forEach((ustensil) => res.ustensils.add(ustensil));
  });
  return Object.entries(res).map(([id, set]) => [id, [...set]]);
};
/**
 * Fontion filterInput prend en paramètre input qui
 * renvoie une fonction filterInput qui prend en paramètre value
 * cette syntaxe permet de simplifié l'écriture et la lecture
 * si on sait que l'on doit utilisé des fonctions avec map/filter
 * array.filter(func(input)) au lieu de array.filter((value) => func(input)(value)
 * @param {string} input
 * @param {string} value
 * @returns 
 */
const filterInput = (input) => (value) => value.toLowerCase().includes(input.toLowerCase());
/**
 * Fonction qui gère la création des templates de chaque dropdown
 * @param {function} updateAll
 * @param {string, key} categoryID 
 * @param {arrays} values
 */
const createDropdown = (updateAll) => ([categoryId, values]) => {
  const list = document.getElementById(`${categoryId}__filter-list`);
  const listWrapper = document.getElementById(`filters__all--${categoryId}`);
  const btnDown = document.getElementById(`${categoryId}__btn--down`);
  const btnUp = document.getElementById(`${categoryId}__btn--up`);
  const input = document.getElementById(`${categoryId}__input`);
  /**
   * Fonction qui gère la visibilité des dropdown en modifiant leur style
   * en utilisant des opérateurs ternaire
   */
  const setDisplay = (flag) => () => {
    listWrapper.style.display = flag ? 'block' : 'none';
    btnUp.style.display = flag ? 'block' : 'none';
    btnDown.style.display = flag ? 'none' : 'block';
  };
  /**
   * Fonction qui prend l'ensemble des tableaux d'ingredients, appliances, ustensils
   * qui va mettre à jour les dropdowns en créant des listes pour chaque object du tableau
   * @param {arrays} values 
   */
  const update = (values) => {
    list.innerHTML = '';
    values.map((value) => {
      const item = document.createElement('li');
      item.classList.add(`${categoryId}__list`);
      //si le tag contient la valeur un style est appliqué pour qu'il display "none" du dropdown
      if (tags[categoryId].includes(value)) item.classList.add(`list--disabled`);
      item.textContent = value;
      item.addEventListener('click', () => {
        addTag(categoryId, value);
        createTag(categoryId, item, updateAll);
        recipesFilteredByTags = filterByTags();
        updateAll(recipesFilteredByInput, recipesFilteredByTags);
      });
      list.appendChild(item);
    });
  };  
  /** 
   * Methode qui écoute les events sur les boutons et 
   * les champs inputs des dropdowns
   */
  btnDown.addEventListener('click', setDisplay(true));
  btnUp.addEventListener('click', setDisplay(false));
  input.addEventListener('keyup', () => update(values.filter(filterInput(input.value))));
  update(values);  
};
/**
 * Fonction addTag va stocker dans l'objet clé valeur initialisé à vide avec les nouvelles valeur reçu
 * Fonction RemoveTag va enlever de l'objet clé valeur si il y a une différence entre la value reçu et la valeur filtrée
 * @param {string, key} categoryId 
 * @param {string} value 
 * @returns 
 */
const addTag = (categoryId, value) => tags = {...tags, [categoryId]: [...tags[categoryId], value]};
const removeTag = (categoryId, value) => tags = {...tags, [categoryId]: tags[categoryId].filter((tagValue)=>tagValue !== value)};
/**
 * Fonction qui va filtrer le tableau de recette qui à déja été filtré par rapport à l'input du champ de recherche.
 * prend toutes les données de l'objet clé valeur tags et toutes les valeurs de l'array values pour les filtrés 
 * en catégorie 
 * @returns 
 */
const filterByTags = () => 
 recipesFilteredByInput.filter((recipe) => 
    Object.entries(tags).every(([categoryId, values]) => 
      values.every((value) => filterRecipeByCategoryValue(categoryId, value, recipe))))
/**
 * les fonctions vont traiter les informations stockées dans le tableau de recette filtré avec la valeur entrée si
 * égal ou inclus puis chercher une équivalence entre categoryId et le string ('apliances', 'ingredients', 'ustensils')
 * et return la foncion correspondante 
 * @param {array} recipe 
 * @param {string} value 
 * @returns 
 */
const filterRecipeByAppliance = (recipe, value) => recipe.appliance.toLowerCase() === value.toLowerCase(); 
const filterRecipeByIngredient = (recipe, value) => recipe.ingredients.map(({ingredient}) => ingredient.toLowerCase()).includes(value.toLowerCase()); 
const filterRecipeByUstensil = (recipe, value) => recipe.ustensils.map((ustensil) => ustensil.toLowerCase()).includes(value.toLowerCase());
const filterRecipeByCategoryValue = (categoryId, value, recipe) => {
  if (categoryId === 'appliances') return filterRecipeByAppliance(recipe, value);
  if (categoryId === 'ingredients') return filterRecipeByIngredient(recipe, value);
  if (categoryId === 'ustensils') return filterRecipeByUstensil(recipe, value);
}
/**
 * Fonction qui gère la création des tags épinglés
 * actualise les dropdowns quand il y a un click sur la fermeture 
 * @param {string} categoryId 
 * @param {object} item 
 * 
 * @returns 
 */
const createTag = (categoryId, item, updateAll) => {  
  const tagList = document.querySelector('.tag__list');
  const tag = document.createElement('div');
  tag.classList.add('tag', `tag--${categoryId}`);
  const tagText = document.createElement('p');
  tagText.classList.add('tag__text');
  tagText.textContent = item.textContent;
  const tagIcon = document.createElement('i');
  tagIcon.classList.add('far', 'fa-times-circle', 'tag__close');
  tagIcon.addEventListener('click', () => {
    removeTag(categoryId, item.textContent);
    recipesFilteredByTags = filterByTags();
    updateAll(recipesFilteredByInput, recipesFilteredByTags);
    tag.style.display = 'none'
  });
  tag.appendChild(tagText);
  tag.appendChild(tagIcon);
  tagList.appendChild(tag);
};

 

















