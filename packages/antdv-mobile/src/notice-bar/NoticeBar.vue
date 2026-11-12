<script setup lang="ts">
import type { NoticeBarEmits, NoticeBarExpose, NoticeBarProps, NoticeBarSlots } from './interface'
import { CloseOutlined, SoundOutlined } from '@antdv-next/icons'
import { computed, nextTick, onActivated, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { cancelRaf, doubleRaf, isRenderable, raf } from '../_util'
import { useEventListener } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useConfig } from '../config-provider/context'
import { useLocale } from '../locale'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmNoticeBar', inheritAttrs: false })

const props = withDefaults(defineProps<NoticeBarProps>(), {
  color: 'warning',
  icon: undefined,
  scrollable: undefined,
  delay: 2000,
  speed: 50,
  shape: 'rectangular',
  bordered: 'block',
})
const emit = defineEmits<NoticeBarEmits>()
const slots = defineSlots<NoticeBarSlots>()

const config = useConfig()
const commonLocale = useLocale('common')

const visible = ref(true)
const wrapRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

const state = reactive({ offset: 0, duration: 0, scrolling: false })
let wrapWidth = 0
let contentWidth = 0
let startTimer: ReturnType<typeof setTimeout> | undefined
let rafId = -1

// `icon` is tri-state: absent -> default icon, null / false -> hidden.
const showIcon = computed(() => !!slots.icon || props.icon === undefined || isRenderable(props.icon))
const hasExtra = computed(() => !!slots.extra || isRenderable(props.extra))
const sign = computed(() => (config.direction.value === 'rtl' ? 1 : -1))

const classNames = computed(() => [
  'am-notice-bar',
  `am-notice-bar-${props.color}`,
  `am-notice-bar-${props.shape}`,
  {
    'am-notice-bar-wrap': props.wrap,
    'am-notice-bar-bordered': props.bordered === true,
    'am-notice-bar-bordered-block': props.bordered === 'block',
    'am-notice-bar-scrolling': state.scrolling,
  },
  props.rootClass,
  props.classes?.root,
])

const contentStyle = computed(() => {
  if (!state.scrolling)
    return undefined
  return {
    transform: `translate3d(${state.offset}px, 0, 0)`,
    transitionDuration: `${state.duration}s`,
  }
})

function stop() {
  clearTimeout(startTimer)
  cancelRaf(rafId)
  state.offset = 0
  state.duration = 0
  state.scrolling = false
}

function run(from: number) {
  // jump to the start position without transition, then animate to the end on the next frames
  state.offset = from
  state.duration = 0
  rafId = raf(() => {
    rafId = raf(() => {
      state.offset = sign.value * contentWidth
      state.duration = (Math.abs(from) + contentWidth) / props.speed
    })
  })
}

function reset() {
  stop()
  const wrap = wrapRef.value
  const content = contentRef.value
  if (!wrap || !content || props.wrap || props.scrollable === false)
    return
  wrapWidth = wrap.offsetWidth
  // the idle text is clipped with an ellipsis, so its full width is the scroll width
  contentWidth = Math.max(content.scrollWidth, content.offsetWidth)
  if (!contentWidth || !(props.speed > 0))
    return
  if (props.scrollable || contentWidth > wrapWidth) {
    startTimer = setTimeout(() => {
      state.scrolling = true
      run(0)
    }, Math.max(props.delay, 0))
  }
}

function onTransitionEnd(event: TransitionEvent) {
  if (!state.scrolling || event.target !== contentRef.value)
    return
  emit('replay')
  // following rounds enter from the opposite edge
  run(-sign.value * wrapWidth)
}

function handleClose(event: MouseEvent) {
  event.stopPropagation()
  visible.value = false
  stop()
  emit('close', event)
}

onMounted(() => doubleRaf(reset))
onActivated(reset)
onBeforeUnmount(stop)
useEventListener('pageshow', reset)
useEventListener('resize', reset)

watch(
  () => [props.content, props.wrap, props.scrollable, props.speed, props.delay, config.direction.value],
  () => nextTick(reset),
)

defineExpose<NoticeBarExpose>({ reset })
</script>

<template>
  <div
    v-if="visible"
    v-bind="$attrs"
    :class="classNames"
    :style="styles?.root"
    role="alert"
    @click="emit('click', $event)"
  >
    <span v-if="showIcon" class="am-notice-bar-icon" :class="classes?.icon" :style="styles?.icon">
      <slot name="icon">
        <RenderNode v-if="isRenderable(icon)" :node="icon" />
        <SoundOutlined v-else />
      </slot>
    </span>
    <div ref="wrapRef" class="am-notice-bar-wrapper">
      <span
        ref="contentRef"
        class="am-notice-bar-content"
        :class="classes?.content"
        :style="[contentStyle, styles?.content]"
        @transitionend="onTransitionEnd"
      >
        <slot>
          <RenderNode :node="content" />
        </slot>
      </span>
    </div>
    <span v-if="hasExtra" class="am-notice-bar-extra" :class="classes?.extra" :style="styles?.extra">
      <slot name="extra">
        <RenderNode :node="extra" />
      </slot>
    </span>
    <button
      v-if="closable"
      type="button"
      class="am-notice-bar-close"
      :class="classes?.close"
      :style="styles?.close"
      :aria-label="commonLocale.close"
      @click="handleClose"
    >
      <slot name="closeIcon">
        <RenderNode v-if="isRenderable(closeIcon)" :node="closeIcon" />
        <CloseOutlined v-else />
      </slot>
    </button>
  </div>
</template>
