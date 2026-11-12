<script setup lang="ts">
import type { SpaceAddonProps, SpaceAddonSlots } from './interface'
import { useCompactItemContext } from '../_base/compact'
import { useDisabled, useSize } from '../config-provider/context'
import '../style'
import './style/compact.css'

defineOptions({ name: 'AmSpaceAddon', inheritAttrs: false })

const props = withDefaults(defineProps<SpaceAddonProps>(), {
  variant: 'outlined',
  disabled: undefined,
})
defineSlots<SpaceAddonSlots>()

const compact = useCompactItemContext()
const size = useSize(() => props.size ?? compact.size.value)
const disabled = useDisabled(() => props.disabled)
</script>

<template>
  <div
    v-bind="$attrs"
    class="am-space-addon"
    :class="[
      `am-space-addon-${variant}`,
      {
        'am-space-addon-sm': size === 'small',
        'am-space-addon-lg': size === 'large',
        'am-space-addon-disabled': disabled,
      },
      compact.classes.value,
      rootClass,
    ]"
  >
    <slot />
  </div>
</template>
