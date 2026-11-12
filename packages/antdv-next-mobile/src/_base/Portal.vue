<script lang="ts">
import type { PropType, SlotsType } from 'vue'
import type { GetContainer } from '../_util/type'
import { computed, defineComponent, h, Teleport } from 'vue'
import { resolveContainer } from '../_util'
import { useConfig, usePopupTheme } from '../config-provider/context'
import { provideNoCompact } from './compact'

export interface PortalSlotContext {
  /** class / style / dir of the theme scope; empty when rendered in place (it inherits naturally) */
  theme: { class?: string[], style?: Record<string, string>, dir?: string }
  teleported: boolean
}

const inlineTheme = {}

/**
 * Base of every layer that leaves the normal flow (Popup, Mask, Toast, Message, Popover,
 * Dropdown panel, NumberKeyboard, ImagePreview ...).
 *
 * It resolves the mount node (`getContainer` prop > ConfigProvider `getPopupContainer` > body)
 * and hands the theme scope of the current ConfigProvider to the slot, so a teleported root
 * keeps its theme:
 *
 * ```vue
 * <Portal :get-container="getContainer" v-slot="{ theme }">
 *   <div class="am-foo-root" :class="theme.class" :style="theme.style" :dir="theme.dir" />
 * </Portal>
 * ```
 *
 * Written as a render function on purpose: the slot content must be a direct child of
 * `<Teleport>`. Going through `<slot>` would wrap it in a fragment whose anchor nodes live in
 * the target container and break unmounting when that container was emptied first.
 */
export default defineComponent({
  name: 'AmPortal',
  props: {
    /** `false` renders in place, `undefined` uses the ConfigProvider default (body) */
    getContainer: { type: [String, Object, Function, Boolean] as PropType<GetContainer>, default: undefined },
    /** target when `getContainer` is undefined: `'body'` (default) or `'inline'` */
    fallback: { type: String as PropType<'body' | 'inline'>, default: 'body' },
  },
  slots: Object as SlotsType<{ default?: (ctx: PortalSlotContext) => any }>,
  setup(props, { slots }) {
    const config = useConfig()
    const popupTheme = usePopupTheme()
    // a popup opened from a field inside Space.Compact is not part of that group
    provideNoCompact()

    const container = computed(() => {
      if (props.getContainer === false)
        return null
      if (props.getContainer !== undefined)
        return resolveContainer(props.getContainer)
      if (props.fallback === 'inline')
        return null
      return config.getPopupContainer.value?.() ?? resolveContainer()
    })

    return () => {
      const target = container.value
      return h(
        Teleport,
        { to: target ?? 'body', disabled: !target },
        slots.default?.({ theme: target ? popupTheme.value : inlineTheme, teleported: !!target }),
      )
    }
  },
})
</script>
