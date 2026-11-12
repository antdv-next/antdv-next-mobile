<script setup lang="ts">
import type { AvatarGroupProps, AvatarGroupSlots } from './interface'
import { computed, provide } from 'vue'
import RenderNode from '../_util/RenderNode'
import { flattenChildren } from '../space/util'
import Avatar from './Avatar.vue'
import { avatarGroupContextKey } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmAvatarGroup', inheritAttrs: false })

const props = defineProps<AvatarGroupProps>()
const slots = defineSlots<AvatarGroupSlots>()

provide(avatarGroupContextKey, {
  size: computed(() => props.size),
  shape: computed(() => props.shape),
})

// Slot content is collected while rendering (by the first `v-for`) so that it stays reactive.
let rest = 0
function collectChildren() {
  const children = flattenChildren(slots.default?.())
  const count = props.max?.count
  if (typeof count === 'number' && count >= 0 && children.length > count) {
    rest = children.length - count
    return children.slice(0, count)
  }
  rest = 0
  return children
}
const getRest = () => rest
</script>

<template>
  <div v-bind="$attrs" class="am-avatar-group" :class="rootClass">
    <RenderNode v-for="(child, index) in collectChildren()" :key="index" :node="child" />
    <Avatar v-if="getRest() > 0" class="am-avatar-group-overflow" :style="max?.style">
      <slot name="overflow" :count="getRest()">
        +{{ getRest() }}
      </slot>
    </Avatar>
  </div>
</template>
