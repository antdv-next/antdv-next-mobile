<script setup lang="ts">
import type { CollapseTransitionEmits, CollapseTransitionProps, CollapseTransitionSlots } from './interface'
import { computed, ref, watch } from 'vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCollapseTransition', inheritAttrs: false })

const props = withDefaults(defineProps<CollapseTransitionProps>(), {
  open: false,
  forceRender: false,
  destroyOnHidden: false,
  appear: false,
  tag: 'div',
})
const emit = defineEmits<CollapseTransitionEmits>()
defineSlots<CollapseTransitionSlots>()

// lazy: nothing is rendered until the first expand
const visited = ref(props.open)
watch(() => props.open, (open) => {
  if (open)
    visited.value = true
})
const shouldRender = computed(() => props.open || props.forceRender || (visited.value && !props.destroyOnHidden))

function onBeforeEnter(el: Element) {
  (el as HTMLElement).style.height = '0px'
}
function onEnter(el: Element) {
  const node = el as HTMLElement
  void node.offsetHeight
  node.style.height = `${node.scrollHeight}px`
}
function onBeforeLeave(el: Element) {
  const node = el as HTMLElement
  node.style.height = `${node.offsetHeight}px`
}
function onLeave(el: Element) {
  const node = el as HTMLElement
  void node.offsetHeight
  node.style.height = '0px'
}
function clearHeight(el: Element) {
  (el as HTMLElement).style.height = ''
}
// the first expand runs the enter hooks twice (`v-if` insert + `v-show`): report it once
let settled: boolean | undefined
function settle(el: Element, open: boolean) {
  clearHeight(el)
  if (settled !== open) {
    settled = open
    emit('afterOpenChange', open)
  }
}
const onAfterEnter = (el: Element) => settle(el, true)
const onAfterLeave = (el: Element) => settle(el, false)
</script>

<template>
  <Transition
    name="am-collapse-transition"
    :appear="appear"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @enter-cancelled="clearHeight"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
    @leave-cancelled="clearHeight"
  >
    <component
      :is="tag"
      v-if="shouldRender"
      v-show="open"
      v-bind="$attrs"
      class="am-collapse-transition"
      :class="[rootClass, classes?.root]"
      :style="styles?.root"
    >
      <slot />
    </component>
  </Transition>
</template>
