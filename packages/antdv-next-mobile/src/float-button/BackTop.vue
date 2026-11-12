<script setup lang="ts">
import type { BackTopEmits, BackTopProps, BackTopSlots } from './interface'
import { VerticalAlignTopOutlined } from '@antdv-next/icons'
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { cancelRaf, raf } from '../_util'
import { useEventListener } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import FloatButton from './FloatButton.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmBackTop', inheritAttrs: false })

const props = withDefaults(defineProps<BackTopProps>(), {
  visibilityHeight: 400,
  duration: 450,
  icon: undefined,
  content: undefined,
  type: 'default',
})
const emit = defineEmits<BackTopEmits>()
defineSlots<BackTopSlots>()

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''

const visible = ref(false)
const scrollTarget = shallowRef<HTMLElement | Window>()
let rafId = -1

function isWindow(target: HTMLElement | Window): target is Window {
  return target === window
}

function getScrollTop(target: HTMLElement | Window) {
  return Math.max(isWindow(target) ? target.scrollY : target.scrollTop, 0)
}

function setScrollTop(target: HTMLElement | Window, value: number) {
  if (isWindow(target))
    target.scrollTo(target.scrollX, value)
  else
    target.scrollTop = value
}

function getTarget() {
  return props.target?.() ?? window
}

function onScroll() {
  const target = scrollTarget.value
  if (target)
    visible.value = getScrollTop(target) >= props.visibilityHeight
}

useEventListener('scroll', onScroll, { target: scrollTarget, passive: true })

onMounted(() => {
  scrollTarget.value = getTarget()
  onScroll()
})
onBeforeUnmount(() => cancelRaf(rafId))

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function scrollToTop() {
  const target = scrollTarget.value ?? getTarget()
  const from = getScrollTop(target)
  const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  cancelRaf(rafId)
  if (reduced || props.duration <= 0 || from <= 0) {
    setScrollTop(target, 0)
    return
  }
  const start = Date.now()
  const step = () => {
    const progress = Math.min((Date.now() - start) / props.duration, 1)
    setScrollTop(target, from * (1 - easeInOutCubic(progress)))
    if (progress < 1)
      rafId = raf(step)
  }
  rafId = raf(step)
}

function onClick(event: MouseEvent) {
  scrollToTop()
  emit('click', event)
}
</script>

<template>
  <Transition name="am-fade">
    <FloatButton
      v-show="visible"
      v-bind="$attrs"
      class="am-back-top"
      :type="type"
      :shape="shape"
      :badge="badge"
      :content="content"
      :aria-label="ariaLabel"
      :root-class="rootClass"
      :classes="classes"
      :styles="styles"
      @click="onClick"
    >
      <template #icon>
        <slot name="icon">
          <RenderNode v-if="isNode(icon)" :node="icon" />
          <VerticalAlignTopOutlined v-else />
        </slot>
      </template>
      <template v-if="$slots.default" #default>
        <slot />
      </template>
    </FloatButton>
  </Transition>
</template>
