<script setup lang="ts">
import type { SpinProps, SpinSlots } from './interface'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useLockScroll } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useSize } from '../config-provider/context'
import { useLocale } from '../locale'
import SpinIndicator from './SpinIndicator.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSpin', inheritAttrs: false })

const props = withDefaults(defineProps<SpinProps>(), {
  spinning: true,
  delay: 0,
})
const slots = defineSlots<SpinSlots>()

const size = useSize(() => props.size)
const locale = useLocale('Spin')
const rootRef = ref<HTMLElement>()

function shouldDelay() {
  return props.spinning && props.delay > 0 && !Number.isNaN(Number(props.delay))
}

// ---------- delay ----------
const innerSpinning = ref(props.spinning && !shouldDelay())
let timer: ReturnType<typeof setTimeout> | undefined

watch(
  () => [props.spinning, props.delay] as const,
  () => {
    clearTimeout(timer)
    if (shouldDelay()) {
      timer = setTimeout(() => {
        innerSpinning.value = true
      }, props.delay)
    }
    else {
      innerSpinning.value = props.spinning
    }
  },
  { immediate: true },
)
onBeforeUnmount(() => clearTimeout(timer))

useLockScroll(rootRef, () => props.fullscreen && innerSpinning.value)

const nested = computed(() => !!slots.default && !props.fullscreen)
const hasDescription = computed(() => !!slots.description || !!slots.tip || isRenderable(props.description) || isRenderable(props.tip))

function isRenderable(node: unknown) {
  return node !== undefined && node !== null && node !== false && node !== ''
}

const spinClass = computed(() => [
  'am-spin',
  {
    'am-spin-sm': size.value === 'small',
    'am-spin-lg': size.value === 'large',
    'am-spin-spinning': innerSpinning.value,
    'am-spin-with-description': hasDescription.value,
    'am-spin-fullscreen': props.fullscreen,
    'am-spin-section': nested.value,
  },
])
</script>

<template>
  <div
    v-if="nested"
    v-bind="$attrs"
    ref="rootRef"
    class="am-spin-wrapper"
    :class="[rootClass, classes?.root]"
    :style="styles?.root"
  >
    <div
      :class="[spinClass, classes?.section]"
      :style="styles?.section"
      :aria-busy="innerSpinning"
      aria-live="polite"
    >
      <span class="am-spin-indicator" :class="classes?.indicator" :style="styles?.indicator">
        <slot name="indicator">
          <RenderNode v-if="isRenderable(indicator)" :node="indicator" />
          <SpinIndicator v-else :percent="percent" :label="locale.tip" />
        </slot>
      </span>
      <div v-if="hasDescription" class="am-spin-description" :class="classes?.description" :style="styles?.description">
        <slot name="description">
          <slot name="tip">
            <RenderNode :node="isRenderable(description) ? description : tip" />
          </slot>
        </slot>
      </div>
    </div>
    <div
      class="am-spin-container"
      :class="[{ 'am-spin-blur': innerSpinning }, classes?.container]"
      :style="styles?.container"
    >
      <slot />
    </div>
  </div>
  <div
    v-else
    v-bind="$attrs"
    ref="rootRef"
    :class="[spinClass, rootClass, classes?.root]"
    :style="styles?.root"
    :aria-busy="innerSpinning"
    aria-live="polite"
  >
    <span class="am-spin-indicator" :class="classes?.indicator" :style="styles?.indicator">
      <slot name="indicator">
        <RenderNode v-if="isRenderable(indicator)" :node="indicator" />
        <SpinIndicator v-else :percent="percent" :label="locale.tip" />
      </slot>
    </span>
    <div v-if="hasDescription" class="am-spin-description" :class="classes?.description" :style="styles?.description">
      <slot name="description">
        <slot name="tip">
          <RenderNode :node="isRenderable(description) ? description : tip" />
        </slot>
      </slot>
    </div>
  </div>
</template>
