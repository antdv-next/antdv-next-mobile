<script setup lang="ts">
import type { VNode } from 'vue'
import type { SpaceCompactProps, SpaceCompactSlots } from './interface'
import { computed, h, inject } from 'vue'
import { CompactItem, compactItemContextKey } from '../_base/compact'
import { flattenChildren } from '../_util/vnode'
import { useSize } from '../config-provider/context'
import '../style'
import './style/compact.css'

defineOptions({ name: 'AmSpaceCompact', inheritAttrs: false })

const props = withDefaults(defineProps<SpaceCompactProps>(), {
  block: false,
  vertical: undefined,
})
const slots = defineSlots<SpaceCompactSlots>()

// a nested Space.Compact continues the outer group: only its outer edges keep their radius
const parent = inject(compactItemContextKey, null)

const size = useSize(() => props.size ?? parent?.value.size)
const orientation = computed(() => {
  if (props.vertical !== undefined)
    return props.vertical ? 'vertical' : 'horizontal'
  return props.orientation ?? props.direction ?? 'horizontal'
})

/** Each child gets its own context with its position in the group. */
function Items() {
  const children = flattenChildren(slots.default?.())
  const last = children.length - 1
  return children.map((child, index) =>
    h(
      CompactItem,
      {
        key: (child as VNode)?.key ?? `am-compact-${index}`,
        size: size.value,
        orientation: orientation.value,
        isFirstItem: index === 0 && (!parent || parent.value.isFirstItem),
        isLastItem: index === last && (!parent || parent.value.isLastItem),
      },
      () => child,
    ),
  )
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="am-space-compact"
    :class="[
      {
        'am-space-compact-block': block,
        'am-space-compact-vertical': orientation === 'vertical',
        'am-space-compact-sm': size === 'small',
        'am-space-compact-lg': size === 'large',
      },
      rootClass,
    ]"
  >
    <Items />
  </div>
</template>
