import type { ActionSheetAction, ActionSheetShowConfig, ActionSheetShowHandler } from './interface'
import { h, ref } from 'vue'
import { mountComponent } from '../_util/mount'
import ActionSheetVue from './ActionSheet.vue'

/** `ActionSheet.show({ actions })`: open an action sheet imperatively. */
export function show(config: ActionSheetShowConfig): ActionSheetShowHandler {
  const open = ref(true)
  let unmount: (() => void) | undefined

  function close() {
    open.value = false
  }

  const { onAction, onCancel, onClose, afterClose, appContext, ...rest } = config

  const mounted = mountComponent(() => h(ActionSheetVue, {
    ...rest,
    'open': open.value,
    'destroyOnHidden': true,
    'onAction': (action: ActionSheetAction, index: number) => onAction?.(action, index),
    'onCancel': () => onCancel?.(),
    'onClose': () => onClose?.(),
    'onUpdate:open': (value: boolean) => {
      open.value = value
    },
    'onAfterOpenChange': (visible: boolean) => {
      if (!visible) {
        afterClose?.()
        unmount?.()
      }
    },
  }), appContext)
  unmount = mounted.unmount

  return { close }
}
