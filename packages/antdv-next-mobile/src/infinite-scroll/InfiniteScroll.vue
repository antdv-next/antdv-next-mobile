<script setup lang="ts">
import type { InfiniteScrollEmits, InfiniteScrollProps, InfiniteScrollSlots } from './interface'
import { LoadingOutlined } from '@antdv-next/icons'
import { computed, nextTick, onActivated, onMounted, onUpdated, ref, shallowRef, watch } from 'vue'
import { getScrollParent, inBrowser } from '../_util'
import { useControlled, useEventListener } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled } from '../config-provider/context'
import { useLocale } from '../locale'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmInfiniteScroll', inheritAttrs: false })

const props = withDefaults(defineProps<InfiniteScrollProps>(), {
  loading: undefined,
  hasMore: true,
  finished: false,
  error: undefined,
  threshold: 250,
  direction: 'down',
  disabled: undefined,
  immediateCheck: true,
  loadingText: undefined,
  finishedText: undefined,
  errorText: undefined,
})
const emit = defineEmits<InfiniteScrollEmits>()
defineSlots<InfiniteScrollSlots>()

const locale = useLocale('InfiniteScroll')
const disabled = useDisabled(() => props.disabled)

const rootRef = ref<HTMLElement>()
const placeholderRef = ref<HTMLElement>()
const scrollParent = shallowRef<HTMLElement | Window>()

const [loading, setLoading] = useControlled(props, 'loading', {
  defaultValue: false,
  onChange: (value: boolean) => emit('update:loading', value),
})
const [error, setError] = useControlled(props, 'error', {
  defaultValue: false,
  onChange: (value: boolean) => emit('update:error', value),
})

const isFinished = computed(() => props.finished || !props.hasMore)

function isHidden(el: HTMLElement) {
  return window.getComputedStyle(el).display === 'none'
}

let pending = false

function check() {
  // several triggers of the same tick (watchers, updated hook, scroll) result in one check
  if (pending)
    return
  pending = true
  nextTick(() => {
    pending = false
    const root = rootRef.value
    const placeholder = placeholderRef.value
    const parent = scrollParent.value
    if (loading.value || isFinished.value || disabled.value || error.value || !root || !placeholder || !parent)
      return
    // e.g. inside an inactive tab
    if (isHidden(root))
      return

    const threshold = Number(props.threshold) || 0
    const parentRect = 'getBoundingClientRect' in parent
      ? parent.getBoundingClientRect()
      : { top: 0, bottom: window.innerHeight }
    const placeholderRect = placeholder.getBoundingClientRect()

    const reached = props.direction === 'up'
      ? parentRect.top - placeholderRect.top <= threshold
      : placeholderRect.bottom - parentRect.bottom <= threshold

    if (reached) {
      setLoading(true)
      emit('load')
    }
  })
}

function retry() {
  setError(false)
  // `error` may still be controlled as true until the parent applies the update
  nextTick(check)
}

onMounted(() => {
  scrollParent.value = getScrollParent(rootRef.value)
  if (props.immediateCheck)
    check()
})
onActivated(check)
// new content may still not fill the container
onUpdated(check)

watch(() => [loading.value, isFinished.value, error.value, disabled.value, props.direction], check)

useEventListener('scroll', check, { target: scrollParent, passive: true })
useEventListener('resize', check, { target: inBrowser ? window : undefined, passive: true })

defineExpose({ check })
</script>

<template>
  <div
    ref="rootRef"
    v-bind="$attrs"
    class="am-infinite-scroll"
    :class="[`am-infinite-scroll-${direction}`, rootClass, classes?.root]"
    :style="styles?.root"
    role="feed"
    :aria-busy="loading"
  >
    <slot v-if="direction === 'down'" />
    <div class="am-infinite-scroll-indicator" :class="classes?.indicator" :style="styles?.indicator">
      <div v-if="error" class="am-infinite-scroll-error" role="button" tabindex="0" @click="retry">
        <slot name="error">
          <RenderNode v-if="errorText !== undefined" :node="errorText" />
          <template v-else>
            <span>{{ locale.failed }}</span>
            <span class="am-infinite-scroll-retry">{{ locale.retry }}</span>
          </template>
        </slot>
      </div>
      <div v-else-if="isFinished" class="am-infinite-scroll-finished">
        <slot name="finished">
          <RenderNode v-if="finishedText !== undefined" :node="finishedText" />
          <template v-else>
            {{ locale.noMore }}
          </template>
        </slot>
      </div>
      <div v-else-if="loading" class="am-infinite-scroll-loading">
        <slot name="loading">
          <LoadingOutlined class="am-infinite-scroll-icon am-spin-icon" />
          <RenderNode v-if="loadingText !== undefined" :node="loadingText" />
          <template v-else>
            {{ locale.loading }}
          </template>
        </slot>
      </div>
    </div>
    <div ref="placeholderRef" class="am-infinite-scroll-placeholder" />
    <slot v-if="direction === 'up'" />
  </div>
</template>
