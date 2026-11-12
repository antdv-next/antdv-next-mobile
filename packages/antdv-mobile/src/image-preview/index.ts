import type { ImagePreviewShowHandler, ImagePreviewShowOptions } from './interface'
import { h, ref } from 'vue'
import { inBrowser } from '../_util'
import { mountComponent } from '../_util/mount'
import { withInstall } from '../_util/withInstall'
import ImagePreviewVue from './ImagePreview.vue'

export type * from './interface'

const instances = new Set<ImagePreviewShowHandler>()

/** Opens a full-screen image viewer without declaring the component. */
function show(options: ImagePreviewShowOptions): ImagePreviewShowHandler {
  const { index, footer, onChange, onClose, afterClose, current: initial = 0, ...rest } = options
  if (!inBrowser)
    return { close() {} }

  const open = ref(true)
  const current = ref(initial)

  const handler: ImagePreviewShowHandler = {
    close() {
      open.value = false
    },
  }

  const { unmount } = mountComponent(() =>
    h(
      ImagePreviewVue,
      {
        ...rest,
        'open': open.value,
        'current': current.value,
        'onUpdate:open': (value: boolean) => {
          open.value = value
        },
        'onUpdate:current': (value: number) => {
          current.value = value
        },
        'onChange': (value: number) => onChange?.(value),
        'onClose': () => onClose?.(),
        'onAfterOpenChange': (value: boolean) => {
          if (!value) {
            instances.delete(handler)
            unmount()
            afterClose?.()
          }
        },
      },
      {
        ...(index ? { index } : {}),
        ...(footer ? { footer } : {}),
      },
    ),
  )

  instances.add(handler)
  return handler
}

/** Closes every viewer opened with `ImagePreview.show`. */
function clear() {
  instances.forEach(instance => instance.close())
}

const ImagePreview = withInstall(ImagePreviewVue, 'AmImagePreview', { show, clear })

export default ImagePreview
