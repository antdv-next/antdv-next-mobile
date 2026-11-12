<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { AffixEmits, AffixProps, AffixSlots } from './interface'
import { computed, nextTick, onActivated, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { cancelRaf, raf } from '../_util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmAffix', inheritAttrs: false })

const props = defineProps<AffixProps>()
const emit = defineEmits<AffixEmits>()
defineSlots<AffixSlots>()

const rootRef = ref<HTMLElement>()
const fixedRef = ref<HTMLElement>()

const affixStyle = shallowRef<CSSProperties>()
const placeholderStyle = shallowRef<CSSProperties>()
const affixed = computed(() => !!affixStyle.value)

const getTarget = () => (props.target ? props.target() : window)

function getTargetRect(target: Window | HTMLElement) {
  return target === window
    ? { top: 0, bottom: window.innerHeight }
    : (target as HTMLElement).getBoundingClientRect()
}

/** the pinned state that was last reported through `change` */
let reported = false

function report() {
  if (reported !== affixed.value) {
    reported = affixed.value
    emit('change', reported)
  }
}

function measure() {
  const root = rootRef.value
  const target = getTarget()
  if (!root || !target)
    return

  const rect = root.getBoundingClientRect()
  // hidden (display: none / detached): keep the current state
  if (!rect.top && !rect.left && !rect.width && !rect.height)
    return

  const targetRect = getTargetRect(target)
  const offsetTop = props.offsetBottom === undefined && props.offsetTop === undefined ? 0 : props.offsetTop
  const { offsetBottom } = props

  let nextStyle: CSSProperties | undefined
  if (offsetTop !== undefined && targetRect.top > rect.top - offsetTop) {
    nextStyle = { position: 'fixed', top: `${offsetTop + targetRect.top}px` }
  }
  else if (offsetBottom !== undefined && targetRect.bottom < rect.bottom + offsetBottom) {
    nextStyle = { position: 'fixed', bottom: `${offsetBottom + (window.innerHeight - targetRect.bottom)}px` }
  }

  if (nextStyle) {
    nextStyle.width = `${rect.width}px`
    nextStyle.height = `${rect.height}px`
    if (props.zIndex !== undefined)
      nextStyle.zIndex = props.zIndex
  }

  const prev = affixStyle.value
  const changed = !!prev !== !!nextStyle
    || (!!prev && !!nextStyle && (Object.keys(nextStyle) as Array<keyof CSSProperties>).some(key => prev[key] !== nextStyle![key]))
  if (!changed)
    return

  affixStyle.value = nextStyle
  // the placeholder keeps the layout while the content is taken out of the flow
  placeholderStyle.value = nextStyle ? { width: nextStyle.width, height: nextStyle.height } : undefined
  report()
}

let frame = 0

/** scroll: cheap re-check, at most once per frame */
function lazyUpdate() {
  cancelRaf(frame)
  frame = raf(measure)
}

/** resize / content change: measure the natural size again */
function updatePosition() {
  cancelRaf(frame)
  frame = raf(() => {
    if (!affixStyle.value) {
      measure()
      return
    }
    // back to the normal flow for one tick so the natural size can be measured
    affixStyle.value = undefined
    placeholderStyle.value = undefined
    nextTick(() => {
      measure()
      report()
    })
  })
}

// ---------- listeners ----------
let boundTarget: Window | HTMLElement | null = null
let resizeObserver: ResizeObserver | undefined

function unbind() {
  if (boundTarget) {
    boundTarget.removeEventListener('scroll', lazyUpdate)
    boundTarget = null
  }
  window.removeEventListener('scroll', lazyUpdate)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('orientationchange', updatePosition)
  resizeObserver?.disconnect()
  resizeObserver = undefined
}

function bind() {
  unbind()
  const target = getTarget()
  boundTarget = target
  target?.addEventListener('scroll', lazyUpdate, { passive: true })
  // a custom container also moves when the page itself scrolls
  if (target !== window)
    window.addEventListener('scroll', lazyUpdate, { passive: true })
  window.addEventListener('resize', updatePosition, { passive: true })
  window.addEventListener('orientationchange', updatePosition, { passive: true })
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updatePosition)
    if (rootRef.value)
      resizeObserver.observe(rootRef.value)
    if (fixedRef.value)
      resizeObserver.observe(fixedRef.value)
  }
}

let mounted = false

onMounted(() => {
  mounted = true
  bind()
  measure()
  // `target` often returns a template ref that is only available after the parent mounted
  nextTick(() => {
    if (!mounted)
      return
    if (getTarget() !== boundTarget)
      bind()
    measure()
  })
})
onActivated(lazyUpdate)
onBeforeUnmount(() => {
  mounted = false
  cancelRaf(frame)
  unbind()
})

watch(() => props.target, () => {
  if (mounted) {
    bind()
    updatePosition()
  }
})
watch(() => [props.offsetTop, props.offsetBottom, props.zIndex], () => {
  if (mounted)
    updatePosition()
})

defineExpose({ updatePosition })
</script>

<template>
  <div ref="rootRef" v-bind="$attrs" class="am-affix-wrapper" :class="[rootClass, classes?.root]" :style="styles?.root">
    <div v-if="affixed" class="am-affix-placeholder" :style="placeholderStyle" aria-hidden="true" />
    <div ref="fixedRef" :class="[{ 'am-affix': affixed }, classes?.affix]" :style="[affixStyle, styles?.affix]">
      <slot />
    </div>
  </div>
</template>
