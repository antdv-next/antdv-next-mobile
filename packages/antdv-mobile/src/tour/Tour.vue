<script setup lang="ts">
import type { VueNode } from '../_util/type'
import type {
  TourClosableConfig,
  TourEmits,
  TourExpose,
  TourMaskConfig,
  TourProps,
  TourSlots,
  TourStepInfo,
  TourStepProps,
  TourTarget,
} from './interface'
import type { TourPosition } from './position'
import { CloseOutlined } from '@antdv-next/icons'
import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, unref, watch } from 'vue'
import { Portal } from '../_base'
import { genId, isRenderable } from '../_util'
import { nextZIndex, useControlled, useEventListener, useLockScroll } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { flattenChildren } from '../_util/vnode'
import { useLocale } from '../locale'
import { computeTourPosition, isInViewport } from './position'
import TourActions from './TourActions.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmTour', inheritAttrs: false })

const props = withDefaults(defineProps<TourProps>(), {
  open: undefined,
  defaultOpen: false,
  current: undefined,
  defaultCurrent: 0,
  steps: () => [],
  type: 'default',
  mask: true,
  arrow: true,
  disabledInteraction: false,
  scrollIntoViewOptions: true,
  closable: undefined,
  closeIcon: undefined,
  keyboard: true,
  lockScroll: true,
  getPopupContainer: undefined,
})
const emit = defineEmits<TourEmits>()
const slots = defineSlots<TourSlots>()

/** distance between the highlighted area and the panel, with / without arrow */
const ARROW_GAP = 12
const PLAIN_GAP = 8
/** minimal distance of the panel to the screen edges */
const SCREEN_PADDING = 16
const DEFAULT_SCROLL_OPTIONS = { block: 'center', inline: 'center' } as const

const commonLocale = useLocale('common')

const rootRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
const maskId = genId('am-tour-mask')

// ============================ state ============================
const [innerOpen, setOpen] = useControlled(props, 'open', {
  defaultValue: () => props.defaultOpen,
  onChange: (value, prev) => {
    if (value !== prev)
      emit('update:open', value)
  },
})

/** set while `current` is reset by the component itself (re-open), which is not a user change */
let silent = false
const [current, setCurrent] = useControlled(props, 'current', {
  defaultValue: () => props.defaultCurrent,
  onChange: (value) => {
    if (silent)
      return
    emit('update:current', value)
    emit('change', value)
  },
})

const total = computed(() => props.steps.length)
/** like PC: nothing is shown while `current` is out of range */
const open = computed(() => !!innerOpen.value && current.value >= 0 && current.value < total.value)
const step = computed<TourStepProps>(() => props.steps[current.value] ?? {})
const stepInfo = computed<TourStepInfo>(() => ({ step: step.value, index: current.value }))
const isLast = computed(() => current.value === total.value - 1)

const mergedType = computed(() => step.value.type ?? props.type)
const mergedMask = computed<boolean | TourMaskConfig>(() => step.value.mask ?? props.mask)
const showMask = computed(() => !!mergedMask.value)
const maskConfig = computed(() => (typeof mergedMask.value === 'object' ? mergedMask.value : undefined))

// ---------- closable (same merge rules as PC: step > tour, closable by default) ----------
function getClosableConfig(
  closable: boolean | TourClosableConfig | undefined,
  closeIcon: VueNode,
  preset: boolean,
): TourClosableConfig | null | 'empty' {
  const config = closable !== null && typeof closable === 'object' ? closable : undefined
  if (closable === false || (closeIcon === false && !config?.closeIcon))
    return null
  const icon = typeof closeIcon !== 'boolean' ? closeIcon : undefined
  if (config)
    return { ...config, closeIcon: config.closeIcon ?? icon }
  return preset || closable || closeIcon ? { closeIcon: icon } : 'empty'
}

const mergedClosable = computed<TourClosableConfig | null>(() => {
  const stepConfig = getClosableConfig(step.value.closable, step.value.closeIcon, false)
  if (stepConfig !== 'empty')
    return stepConfig
  const rootConfig = getClosableConfig(props.closable, props.closeIcon, true)
  return rootConfig === 'empty' ? {} : rootConfig
})

// ---------- semantic classes / styles: step > tour ----------
const mergedClasses = computed(() => ({ ...props.classes, ...step.value.classes }))
const mergedStyles = computed(() => ({ ...props.styles, ...step.value.styles }))

// ---------- content: the slot wins when it renders something for this step ----------
function pickNode(slot: ((info: TourStepInfo) => any) | undefined, node: VueNode) {
  const children = slot ? flattenChildren(slot(stepInfo.value)) : []
  return children.length ? children : node
}

const content = computed(() => ({
  cover: pickNode(slots.coverRender, step.value.cover),
  title: pickNode(slots.titleRender, step.value.title),
  description: pickNode(slots.descriptionRender, step.value.description),
}))

// ============================ target & position ============================
function resolveTarget(target: TourTarget): HTMLElement | null {
  let value: any = typeof target === 'function' ? target() : unref(target)
  value = unref(value)
  if (value && value.$el)
    value = value.$el
  return value && value.nodeType === 1 ? value as HTMLElement : null
}

/** the layer is only teleported on the client, once the tour has been opened */
const mounted = ref(false)
const rendered = ref(false)
const container = shallowRef<HTMLElement | false>()
const zIndex = ref<number | undefined>(props.zIndex)
const targetEl = shallowRef<HTMLElement | null>(null)
/** highlighted area (target + gap), relative to the layer; `null` without a target */
const hole = ref<{ left: number, top: number, width: number, height: number, radius: number } | null>(null)
const position = ref<TourPosition>({ left: 0, top: 0, placement: 'center', arrowOffset: 0, arrow: false })
/** moves of the highlighted area / panel are animated right after a step change only (not while scrolling) */
const animating = ref(false)
let animateTimer: ReturnType<typeof setTimeout> | undefined

const wantArrow = computed(() => !!(step.value.arrow ?? props.arrow))
const showArrow = computed(() => wantArrow.value && !!hole.value && position.value.arrow)
const side = computed(() => /^(top|bottom|left|right|center)/.exec(position.value.placement)![1])

function measure() {
  const root = rootRef.value
  const panel = panelRef.value
  if (!root || !panel || !open.value)
    return
  const el = resolveTarget(step.value.target)
  targetEl.value = el

  const rootRect = root.getBoundingClientRect()
  const rootStyle = window.getComputedStyle(root)
  const viewport = {
    width: rootRect.width || document.documentElement.clientWidth || window.innerWidth,
    height: rootRect.height || document.documentElement.clientHeight || window.innerHeight,
  }

  let rect: { left: number, top: number, width: number, height: number } | null = null
  if (el) {
    const offset = props.gap?.offset ?? 6
    const [offsetX, offsetY] = Array.isArray(offset) ? offset : [offset, offset]
    const targetRect = el.getBoundingClientRect()
    rect = {
      left: targetRect.left - rootRect.left - offsetX,
      top: targetRect.top - rootRect.top - offsetY,
      width: targetRect.width + offsetX * 2,
      height: targetRect.height + offsetY * 2,
    }
  }
  const radius = props.gap?.radius
  hole.value = rect && { ...rect, radius: typeof radius === 'number' && !Number.isNaN(radius) ? radius : 2 }
  position.value = computeTourPosition(
    rect,
    { width: panel.offsetWidth, height: panel.offsetHeight },
    {
      placement: step.value.placement ?? props.placement,
      gap: wantArrow.value ? ARROW_GAP : PLAIN_GAP,
      padding: SCREEN_PADDING,
      viewport,
      // the layer reserves the safe areas as padding so they can be read here
      safeTop: Number.parseFloat(rootStyle.paddingTop) || 0,
      safeBottom: Number.parseFloat(rootStyle.paddingBottom) || 0,
    },
  )
}

/** scroll the target into view (when needed), then measure */
async function sync() {
  await nextTick()
  if (!open.value)
    return
  const el = resolveTarget(step.value.target)
  const options = step.value.scrollIntoViewOptions ?? props.scrollIntoViewOptions
  if (el && options !== false && typeof el.scrollIntoView === 'function' && !isInViewport(el))
    el.scrollIntoView(options === true ? DEFAULT_SCROLL_OPTIONS : options)
  measure()
}

async function prepare() {
  const { getPopupContainer } = props
  container.value = getPopupContainer === false
    ? false
    : getPopupContainer?.(resolveTarget(step.value.target) ?? document.body)
  zIndex.value = props.zIndex ?? nextZIndex()
  rendered.value = true
  await sync()
}

onMounted(() => {
  mounted.value = true
  if (open.value)
    prepare()
})

watch(open, (value) => {
  if (!value)
    return
  // like PC: an uncontrolled tour starts from the first step every time it is opened again
  if (props.current === undefined && current.value !== 0) {
    silent = true
    setCurrent(0)
    silent = false
  }
  if (mounted.value)
    prepare()
})

watch([current, () => props.steps], () => {
  if (!open.value || !rendered.value)
    return
  animating.value = true
  clearTimeout(animateTimer)
  animateTimer = setTimeout(() => {
    animating.value = false
  }, 350)
  sync()
})

watch(() => [props.placement, props.arrow, props.gap, props.mask, props.type], () => {
  if (open.value)
    nextTick(measure)
})
watch(() => props.zIndex, (value) => {
  if (value !== undefined)
    zIndex.value = value
})

useEventListener('resize', measure, { passive: true })
useEventListener('orientationchange', measure, { passive: true })
// capture: scrolling of any container moves the target
useEventListener('scroll', measure, { passive: true, capture: true })

// the panel grows when a cover image has loaded, the target may be resized by the page
let resizeObserver: ResizeObserver | undefined
watch([panelRef, targetEl], ([panel, target]) => {
  resizeObserver?.disconnect()
  if (typeof ResizeObserver === 'undefined' || !panel)
    return
  resizeObserver = new ResizeObserver(() => measure())
  resizeObserver.observe(panel)
  if (target)
    resizeObserver.observe(target)
}, { flush: 'post' })

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  clearTimeout(animateTimer)
})

useLockScroll(rootRef, () => open.value && props.lockScroll && showMask.value)

// ============================ actions ============================
function close() {
  emit('close', current.value)
  setOpen(false)
}

function onPrev(event: MouseEvent) {
  const { prevButtonProps } = step.value
  if (current.value > 0)
    setCurrent(current.value - 1)
  prevButtonProps?.onClick?.(event)
}

function onNext(event: MouseEvent) {
  const { nextButtonProps } = step.value
  if (isLast.value) {
    close()
    emit('finish')
  }
  else {
    setCurrent(current.value + 1)
  }
  nextButtonProps?.onClick?.(event)
}

useEventListener('keydown', (event: KeyboardEvent) => {
  if (!open.value || !props.keyboard)
    return
  const target = event.target as HTMLElement | null
  if (target && (/^(?:input|textarea)$/i.test(target.tagName) || target.isContentEditable))
    return
  if (event.key === 'Escape' && mergedClosable.value) {
    event.preventDefault()
    close()
  }
  else if (event.key === 'ArrowLeft' && current.value > 0) {
    event.preventDefault()
    setCurrent(current.value - 1)
  }
  else if (event.key === 'ArrowRight' && current.value < total.value - 1) {
    event.preventDefault()
    setCurrent(current.value + 1)
  }
})

function onAfterLeave() {
  // like PC, the layer is destroyed once it is closed
  rendered.value = false
  hole.value = null
  targetEl.value = null
}

// ============================ render helpers ============================
/** default prev / next buttons, handed to `actionsRender` as `originNode` */
const originNode = computed(() => h(
  TourActions,
  {
    current: current.value,
    total: total.value,
    type: mergedType.value,
    prevButtonProps: step.value.prevButtonProps,
    nextButtonProps: step.value.nextButtonProps,
    onPrev,
    onNext,
  },
  { prevButton: slots.prevButton, nextButton: slots.nextButton },
))
const actionsInfo = computed(() => ({ current: current.value, total: total.value }))
const actionsSlotProps = computed(() => ({ originNode: originNode.value, ...actionsInfo.value }))

function renderActions() {
  return props.actionsRender ? props.actionsRender(originNode.value, actionsInfo.value) : originNode.value
}

function renderIndicators() {
  return props.indicatorsRender?.(current.value, total.value)
}

const holeStyle = computed(() => hole.value && {
  left: `${hole.value.left}px`,
  top: `${hole.value.top}px`,
  width: `${hole.value.width}px`,
  height: `${hole.value.height}px`,
  borderRadius: `${hole.value.radius}px`,
})

/** the four areas around the hole that swallow taps */
const covers = computed(() => {
  const area = hole.value
  if (!area)
    return [{ x: 0, y: 0, width: '100%', height: '100%' }]
  const right = area.left + area.width
  const bottom = area.top + area.height
  return [
    { x: 0, y: 0, width: '100%', height: Math.max(area.top, 0) },
    { x: 0, y: 0, width: Math.max(area.left, 0), height: '100%' },
    { x: 0, y: Math.max(bottom, 0), width: '100%', height: `calc(100% - ${Math.max(bottom, 0)}px)` },
    { x: Math.max(right, 0), y: 0, width: `calc(100% - ${Math.max(right, 0)}px)`, height: '100%' },
  ]
})

const panelStyle = computed(() => [
  {
    left: `${position.value.left}px`,
    top: `${position.value.top}px`,
    '--am-tour-arrow-offset': `${position.value.arrowOffset}px`,
  },
  step.value.style,
])

defineExpose<TourExpose>({ updatePosition: measure })
</script>

<template>
  <Portal v-if="mounted && rendered" v-slot="{ theme }" :get-container="container">
    <Transition name="am-fade" appear @after-leave="onAfterLeave">
      <div
        v-show="open"
        ref="rootRef"
        v-bind="$attrs"
        class="am-tour"
        :class="[theme.class, { 'am-tour-animated': animating }, rootClass, mergedClasses.root]"
        :style="[theme.style, { zIndex }, mergedStyles.root]"
        :dir="theme.dir"
      >
        <svg
          v-if="showMask"
          class="am-tour-mask"
          :class="mergedClasses.mask"
          :style="[maskConfig?.style, mergedStyles.mask]"
          aria-hidden="true"
        >
          <defs>
            <mask :id="maskId">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                v-if="hole"
                class="am-tour-mask-hole"
                :x="hole.left"
                :y="hole.top"
                :rx="hole.radius"
                :width="Math.max(hole.width, 0)"
                :height="Math.max(hole.height, 0)"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            class="am-tour-mask-fill"
            x="0"
            y="0"
            width="100%"
            height="100%"
            :mask="`url(#${maskId})`"
            :style="maskConfig?.color ? { fill: maskConfig.color } : undefined"
          />
          <rect
            v-for="(cover, index) in covers"
            :key="index"
            class="am-tour-mask-cover"
            :x="cover.x"
            :y="cover.y"
            :width="cover.width"
            :height="cover.height"
          />
        </svg>
        <div
          v-if="holeStyle"
          class="am-tour-target-placeholder"
          :class="{ 'am-tour-target-disabled': disabledInteraction }"
          :style="holeStyle"
        />
        <div
          ref="panelRef"
          class="am-tour-panel"
          :class="[
            `am-tour-placement-${position.placement}`,
            `am-tour-side-${side}`,
            { 'am-tour-primary': mergedType === 'primary' },
            step.class,
          ]"
          :style="panelStyle"
          role="dialog"
          :aria-modal="showMask"
        >
          <span v-if="showArrow" class="am-tour-arrow" />
          <div class="am-tour-section" :class="mergedClasses.section" :style="mergedStyles.section">
            <button
              v-if="mergedClosable"
              type="button"
              class="am-tour-close"
              :class="mergedClasses.close"
              :style="mergedStyles.close"
              :aria-label="commonLocale.close"
              @click="close"
            >
              <slot name="closeIcon" v-bind="stepInfo">
                <RenderNode v-if="isRenderable(mergedClosable.closeIcon)" :node="mergedClosable.closeIcon" />
                <CloseOutlined v-else />
              </slot>
            </button>
            <div v-if="isRenderable(content.cover)" class="am-tour-cover" :class="mergedClasses.cover" :style="mergedStyles.cover">
              <RenderNode :node="content.cover" />
            </div>
            <div v-if="isRenderable(content.title)" class="am-tour-header" :class="mergedClasses.header" :style="mergedStyles.header">
              <div class="am-tour-title" :class="mergedClasses.title" :style="mergedStyles.title">
                <RenderNode :node="content.title" />
              </div>
            </div>
            <div
              v-if="isRenderable(content.description)"
              class="am-tour-description"
              :class="mergedClasses.description"
              :style="mergedStyles.description"
            >
              <RenderNode :node="content.description" />
            </div>
            <div class="am-tour-footer" :class="mergedClasses.footer" :style="mergedStyles.footer">
              <div v-if="total > 1" class="am-tour-indicators" :class="mergedClasses.indicators" :style="mergedStyles.indicators">
                <slot name="indicatorsRender" v-bind="actionsInfo">
                  <RenderNode v-if="indicatorsRender" :node="renderIndicators" />
                  <template v-else>
                    <span
                      v-for="index in total"
                      :key="index"
                      class="am-tour-indicator"
                      :class="[{ 'am-tour-indicator-active': index - 1 === current }, mergedClasses.indicator]"
                      :style="mergedStyles.indicator"
                    />
                  </template>
                </slot>
              </div>
              <div class="am-tour-actions" :class="mergedClasses.actions" :style="mergedStyles.actions">
                <slot name="actionsRender" v-bind="actionsSlotProps">
                  <RenderNode :node="renderActions" />
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Portal>
</template>
