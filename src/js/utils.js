/**
 *Créer un DOM element avec une classe
 * @param   {string}  eltTag     tag's name
 * @param   {string}  eltClass   tag's class
 * @return  {node}
 */
const createGenericElt = (eltTag, eltClass = null) => {
  const elt = document.createElement(eltTag);
  if (eltClass) elt.className = eltClass;
  return elt;
};

/**
 * Créer un element lien avec une classe
 * @param   {string}  eltHref     lien
 * @param   {string}  eltContent  contenu à afficher
 * @param   {string}  eltClass    tag's class
 * @return  {node}
 */
const createLinkElt = (eltHref, eltContent, eltClass = null) => {
  const elt = createGenericElt("a", eltClass);
  elt.setAttribute("href", eltHref);
  elt.setAttribute("title", eltContent);
  elt.textContent = eltContent;
  return elt;
};

/**
 * Obtienir une version normalisée d'un texte
 * @param   {string}  text  text to normalize
 * @return  {string}
 */
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export { createGenericElt, createLinkElt, normalizeText };
