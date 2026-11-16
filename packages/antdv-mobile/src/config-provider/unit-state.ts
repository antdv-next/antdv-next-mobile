import { ref } from 'vue'

/** Real pixels of one unit of the document: `--am-unit` on `:root` (css or `applyTheme`). */
export const globalUnit = ref(1)
/** Real pixels of one design unit of the document (`--am-design-unit`): the length of a number given by the user. */
export const globalDesignUnit = ref(1)
