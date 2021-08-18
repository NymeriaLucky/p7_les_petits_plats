import { recipes } from "./recipes.js";
import { createMedia } from "./media.js";
import { manageTags } from "./tags-search.js"

createMedia(recipes)
manageTags(recipes)

