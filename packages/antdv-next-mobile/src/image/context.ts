import type { ComputedRef, InjectionKey } from 'vue'
import type { ImagePreviewImage } from '../image-preview/interface'
import { inject } from 'vue'

export interface ImagePreviewGroupContext {
  /** preview is enabled on the group */
  enabled: ComputedRef<boolean>
  fallback: ComputedRef<string | undefined>
  /** registers a previewable image, returns the unregister function */
  register: (id: symbol, getImage: () => ImagePreviewImage | undefined) => () => void
  open: (id: symbol) => void
}

export const imagePreviewGroupContextKey: InjectionKey<ImagePreviewGroupContext> = Symbol('AmImagePreviewGroupContext')

export function useImagePreviewGroup() {
  return inject(imagePreviewGroupContextKey, undefined)
}
