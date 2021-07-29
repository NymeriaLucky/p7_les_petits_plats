import { initializeState } from "./datalogic";
import { initializeFilters } from "./filters";
import { manageSearchInput } from "./search";

import "../style/main.scss";

//Initialiser l'application//
initializeState();
initializeFilters();

// Ajouter un écouteur(listener) à la barre de recherche//
const searchBarElt = document.getElementById("search-bar");
searchBarElt.addEventListener("input", manageSearchInput);
