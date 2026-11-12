import { h } from 'vue'
import DefaultImage from './DefaultImage.vue'
import SimpleImage from './SimpleImage.vue'

/** Default illustration. Render functions, so that every Empty gets its own vnode. */
export const PRESENTED_IMAGE_DEFAULT = () => h(DefaultImage)
/** Smaller, line-art illustration for compact areas (list / select placeholders). */
export const PRESENTED_IMAGE_SIMPLE = () => h(SimpleImage)
