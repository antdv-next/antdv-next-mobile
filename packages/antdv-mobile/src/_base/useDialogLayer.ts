import type { Ref } from 'vue'
import { onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, watch } from 'vue'

interface DialogLayer {
  element: Ref<HTMLElement | undefined>
  open: () => boolean
  zIndex: () => number | undefined
  modal?: () => boolean
  onKeydown: (event: KeyboardEvent) => void
}

// Only the frontmost layer handles a key, including when it declines Escape.
// For equal z-indices the most recently opened layer wins.
const layers = new Map<DialogLayer, HTMLElement | null>()

function topLayer() {
  let top: DialogLayer | undefined
  for (const layer of layers.keys()) {
    if (!top || (layer.zIndex() ?? 0) >= (top.zIndex() ?? 0))
      top = layer
  }
  return top
}

const focusable = 'a[href], button, input, select, textarea, iframe, summary, audio[controls], video[controls], [contenteditable], [tabindex]'

function tabStops(dialog: HTMLElement) {
  const controls = Array.from(dialog.querySelectorAll<HTMLElement>(focusable)).filter(el =>
    (el.tabIndex >= 0 || (el.isContentEditable && !el.hasAttribute('tabindex')))
    && !el.matches(':disabled') && !el.closest('[inert]') && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden',
  )
  // A radio group has one stop in sequential keyboard navigation.
  return controls.filter((el) => {
    if (!(el instanceof HTMLInputElement) || el.type !== 'radio' || !el.name)
      return true
    const group = controls.filter((item): item is HTMLInputElement =>
      item instanceof HTMLInputElement && item.type === 'radio' && item.name === el.name && item.form === el.form,
    )
    return (group.find(item => item.checked) ?? group[0]) === el
  }).sort((a, b) => (a.tabIndex > 0 ? a.tabIndex : Number.MAX_SAFE_INTEGER) - (b.tabIndex > 0 ? b.tabIndex : Number.MAX_SAFE_INTEGER))
}

function onKeydown(event: KeyboardEvent) {
  const top = topLayer()
  if (!top || event.defaultPrevented)
    return
  const dialog = top.element.value
  if (event.key !== 'Tab' || !top.modal?.() || !dialog) {
    top.onKeydown(event)
    return
  }

  const elements = tabStops(dialog)
  const active = document.activeElement
  const first = elements[0]
  const last = elements[elements.length - 1]
  if (!first || !dialog.contains(active) || active === dialog || (event.shiftKey ? active === first : active === last)) {
    event.preventDefault()
    const target = (event.shiftKey ? last : first) ?? dialog
    target.focus({ preventScroll: true })
  }
}

/** Share keyboard handling between regular popups, previews and guided tours. */
export function useDialogLayer(layer: DialogLayer) {
  const active = ref(false)
  const remove = () => {
    if (!layers.has(layer))
      return
    const wasTop = topLayer() === layer
    const trigger = layers.get(layer)
    layers.delete(layer)
    if (!layers.size)
      window.removeEventListener('keydown', onKeydown)

    // An outer dialog can disappear while its nested dialog is still open.
    for (const [nested, target] of layers) {
      if (target && layer.element.value?.contains(target))
        layers.set(nested, trigger ?? null)
    }
    if (wasTop && layer.modal?.()) {
      const next = topLayer()
      if (trigger?.isConnected && (!next?.modal?.() || next.element.value?.contains(trigger)))
        trigger.focus({ preventScroll: true })
      else if (next?.modal?.())
        next.element.value?.focus({ preventScroll: true })
    }
  }

  watch([active, layer.open, layer.element, () => layer.modal?.()], ([enabled, open, el]) => {
    if (!enabled || !open || !el) {
      remove()
      return
    }
    if (!layers.has(layer)) {
      if (!layers.size)
        window.addEventListener('keydown', onKeydown)
      layers.set(layer, document.activeElement instanceof HTMLElement ? document.activeElement : null)
    }
    if (topLayer() === layer && layer.modal?.() && !el.contains(document.activeElement))
      el.focus({ preventScroll: true })
  }, { flush: 'post' })

  const activate = () => {
    active.value = true
  }
  onMounted(activate)
  onActivated(activate)
  onDeactivated(() => {
    active.value = false
    remove()
  })
  onBeforeUnmount(remove)
}
