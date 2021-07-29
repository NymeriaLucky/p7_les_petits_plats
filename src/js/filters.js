import state from "./state";
import { completeSearch } from "./search";
import { createGenericElt, createLinkElt, normalizeText } from "./utils";

import { createAllLabels } from "./labels";

/**
 * DOM Variables
 */
const overlayElt = document.getElementById("overlay");
const ingFiltersListElt = document.getElementById("ing-filter-list");
const appFiltersListElt = document.getElementById("app-filter-list");
const ustFiltersListElt = document.getElementById("ust-filter-list");
const ingBtnElt = document.getElementById("ing-btn");
const appBtnElt = document.getElementById("app-btn");
const ustBtnElt = document.getElementById("ust-btn");
const ingInputElt = document.getElementById("ing-input");
const appInputElt = document.getElementById("app-input");
const ustInputElt = document.getElementById("ust-input");

/**
 * Créer un élément filtrant 
 * @param   {string} type ing, app or ust
 * @param   {string} name the filter's content
 * @returns {node}
 */
const createFilterElt = (type, name) => {
  const liElt = createGenericElt("li");
  const aElt = createLinkElt("/", name, "filter-tag");
  liElt.appendChild(aElt);
  liElt.addEventListener("click", addFilter(type, name));

  return liElt;
};

/**
 * Ajouter un filtre au Click
 * @param   {string}    type  ing, app or ust
 * @param   {string}    name  the filter's name
 * @return  {void}
 */
const addFilter = (type, name) => {
  return function (evt) {
    evt.preventDefault();
    const formattedName = normalizeText(name);

    if (type === "ing") {
      if (!state.ingLabels.includes(formattedName))
        state.ingLabels.push(formattedName);
    }
    if (type === "app") {
      if (!state.appLabels.includes(formattedName))
        state.appLabels.push(formattedName);
    }
    if (type === "ust") {
      if (!state.ustLabels.includes(formattedName))
        state.ustLabels.push(formattedName);
    }
    putFiltersToInitialState();
    createAllLabels();
    completeSearch();
  };
};

/**
 * Créer un élément de liste avec tous les filtres d'un type
 * @param   {array} list  liste des filtres à afficher
 * @return  {node}
 */
const createFiltersList = (listElt, list) => {
  listElt.innerHTML = "";
  list.forEach((elt) => {
    const liElt = createFilterElt(elt.type, elt.name);
    listElt.appendChild(liElt);
  });
};

/**
 * Remplit la liste des filtres avec les données de l'élément
 * @returns {void}
 */
const fillAllFilterLists = () => {
  createFiltersList(ingFiltersListElt, state.displayedIng);
  createFiltersList(appFiltersListElt, state.displayedApp);
  createFiltersList(ustFiltersListElt, state.displayedUst);
};

/**
 * Affiche les filtres initiaux
 * @returns {void}
 */
const initializeFilters = () => {
  fillAllFilterLists();
  ingBtnElt.addEventListener("click", toggleFilterList);
  appBtnElt.addEventListener("click", toggleFilterList);
  ustBtnElt.addEventListener("click", toggleFilterList);
  overlayElt.addEventListener("click", putFiltersToInitialState);

  ingInputElt.addEventListener("focus", scaleFilterUp);
  appInputElt.addEventListener("focus", scaleFilterUp);
  ustInputElt.addEventListener("focus", scaleFilterUp);

  ingInputElt.addEventListener("input", manageCompletion);
  appInputElt.addEventListener("input", manageCompletion);
  ustInputElt.addEventListener("input", manageCompletion);
};

/**
 * Gérer les mouvements de la liste de filtres
 * @param   {object}   evt  Evenement de navigateur evt
 * @return  {void}
 */
const toggleFilterList = (evt) => {
  evt.preventDefault();
  if (evt.target.tagName !== "SPAN") return;

  if (evt.target.className === "fas fa-chevron-down") {
    scaleFilterUp(evt);
  } else {
    closeAllFilterLists();
    scaleAllFiltersDown();
  }
};

/**
 * Fermer tous les filtres
 * @return  {void}
 */
const closeAllFilterLists = () => {
  overlayElt.style.display = "none";

  ingFiltersListElt.parentNode.classList.remove("open");
  appFiltersListElt.parentNode.classList.remove("open");
  ustFiltersListElt.parentNode.classList.remove("open");

  ingBtnElt.className = "fas fa-chevron-down";
  appBtnElt.className = "fas fa-chevron-down";
  ustBtnElt.className = "fas fa-chevron-down";

  removeFilterInputsValue();
  resetTagsDisplay();
};

/**
 *Agrandir le filtre d'entrée
 * @param   {object}   evt  (Browser event)
 * @return  {void}
 */
const scaleFilterUp = (evt) => {
  evt.preventDefault();
  scaleAllFiltersDown();
  const parentElt = evt.target.parentNode;
  parentElt.className += " scaled";
  openFilterList(parentElt.childNodes[3], parentElt.childNodes[2].id);
};

/**
 * Ouvrir la liste de filtres
 * @param   {node}    elt  l'élément auquel la classe ouverte est ajoutée
 * @param   {string}  buttonId  l'identifiant du bouton cliqué
 * @return  {void}
 */
const openFilterList = (elt, buttonId) => {
  closeAllFilterLists();
  elt.className += " open";
  const buttonElt = document.getElementById(buttonId);
  buttonElt.className = "fas fa-chevron-up";
  overlayElt.style.display = "block";
};

/**
 * Réduire le filtre d'entrée
 * @return  {void}
 */
const scaleAllFiltersDown = () => {
  const filtersElts = document.querySelectorAll(".filters-elt");
  filtersElts.forEach((elt) => elt.classList.remove("scaled"));
};

/**
 * Ferme et réduit tous les filtres 
 * @return  {void}
 */
const putFiltersToInitialState = () => {
  closeAllFilterLists();
  scaleAllFiltersDown();
};

/**
 * Obtenir la liste des filtres actuellement affichés
 * @param   {string} type ing, app ou ust
 * @returns {array} tableau
 */
const getVisibleFilters = (type) => {
  const listNodes = document.querySelectorAll(`#${type}-filter-list li a`);
  const listContentArray = Array.from(listNodes).map((elt) =>
    elt.textContent.toLowerCase()
  );
  return listContentArray;
};

/**
 * Effacer les éléments des filtres DOM
 * @returns {void}
 */
const clearAllFilters = () => {
  ingFiltersListElt.innerHTML = "";
  appFiltersListElt.innerHTML = "";
  ustFiltersListElt.innerHTML = "";
};

/**
 * Obtenir le nombre de filtres ajoutés(ing + app + ust)
 * @returns {number}
 */
const getAllFiltersLength = () => {
  const fullTagArray = state.ingLabels
    .concat(state.appLabels)
    .concat(state.ustLabels);
  return fullTagArray.length;
};

/**
 * Effacer la valeur dans les entrées des filtres
 * @returns {void}
 */
const removeFilterInputsValue = () => {
  ingInputElt.value = "";
  appInputElt.value = "";
  ustInputElt.value = "";
};

/**
 * Complétion automatique lors de la saisie des entrées du filtre
 * @returns {void}
 */
const manageCompletion = (evt) => {
  const idTarget = evt.target.parentNode.id;
  const formattedValue = normalizeText(evt.target.value);
  const allTags = document.querySelectorAll(`#${idTarget} li a`);

  allTags.forEach((tag) => {
    if (!tag.textContent.includes(formattedValue))
      tag.parentNode.style.display = "none";
    else tag.parentNode.style.display = "block";
  });
};

/**
 * Afficher tous les tags dans le DOM
 * @returns {void}
 */
const resetTagsDisplay = () => {
  const allIngTags = document.querySelectorAll(`#ing-filter-list li`);
  const allAppTags = document.querySelectorAll(`#app-filter-list li`);
  const allUstTags = document.querySelectorAll(`#ust-filter-list li`);

  allIngTags.forEach((ing) => (ing.style.display = "block"));
  allAppTags.forEach((app) => (app.style.display = "block"));
  allUstTags.forEach((ust) => (ust.style.display = "block"));
};

export {
  initializeFilters,
  getVisibleFilters,
  createFilterElt,
  clearAllFilters,
  getAllFiltersLength,
};
