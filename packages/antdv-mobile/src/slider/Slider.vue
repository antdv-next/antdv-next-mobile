<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'
import type { SliderEmits, SliderExpose, SliderMarkObject, SliderProps, SliderSlots, SliderValue } from './interface'
import { computed, isVNode, nextTick, onBeforeUnmount, ref } from 'vue'
import { clamp, isObject, preventDefault } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useConfig, useDisabled } from '../config-provider/context'
import { useFormItemInputContext } from '../form/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSlider', inheritAttrs: false })

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  range: false,
  disabled: undefined,
  dots: false,
  included: true,
  reverse: false,
  vertical: false,
  keyboard: true,
})
const emit = defineEmits<SliderEmits>()
defineSlots<SliderSlots>()

const MAX_DOTS = 200

const config = useConfig()
const disabled = useDisabled(() => props.disabled)
const formItem = useFormItemInputContext()

const bodyRef = ref<HTMLElement>()
const handleRefs = ref<HTMLElement[]>([])

const isVertical = computed(() => (props.orientation ? props.orientation === 'vertical' : props.vertical))
const isRtl = computed(() => config.direction.value === 'rtl')

// ---------- value ----------
const [value, setValue] = useControlled(props, 'value', {
  defaultValue: (): SliderValue => props.defaultValue ?? (props.range ? [props.min, props.min] : props.min),
  onChange: (val: SliderValue) => {
    emit('update:value', val)
    emit('change', val)
    formItem.onFieldChange()
  },
})

function toNumber(val: unknown) {
  const num = Number(val)
  return Number.isNaN(num) ? props.min : clamp(num, props.min, props.max)
}

/** Normalized handle values: one item, or two sorted items in range mode. */
const values = computed<number[]>(() => {
  const raw = value.value
  if (props.range) {
    const list = Array.isArray(raw) ? raw : [raw, raw]
    const start = toNumber(list[0])
    const end = toNumber(list[1] ?? list[0])
    return start <= end ? [start, end] : [end, start]
  }
  return [toNumber(Array.isArray(raw) ? raw[0] : raw)]
})

function toOutput(list: number[]): SliderValue {
  return props.range ? list.slice(0, 2) : list[0]
}

function isSame(a: number[], b: number[]) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

function commit(list: number[]) {
  if (!isSame(list, values.value))
    setValue(toOutput(list))
}

// ---------- marks & snapping ----------
interface MarkItem { point: number, label: VueNode, style?: CSSProperties }

function isMarkObject(mark: unknown): mark is SliderMarkObject {
  return isObject(mark) && !isVNode(mark) && !Array.isArray(mark) && ('label' in mark || 'style' in mark)
}

const markList = computed<MarkItem[]>(() => {
  const marks = props.marks
  if (!marks)
    return []
  return Object.keys(marks)
    .map((key) => {
      const mark = marks[key as unknown as number]
      const point = Number(key)
      return isMarkObject(mark) ? { point, label: mark.label, style: mark.style } : { point, label: mark as VueNode }
    })
    .filter(item => !Number.isNaN(item.point) && item.point >= props.min && item.point <= props.max)
    .sort((a, b) => a.point - b.point)
})

function getDecimals(num: number) {
  const str = String(num)
  return str.includes('.') ? str.length - str.indexOf('.') - 1 : 0
}

function fixPrecision(num: number) {
  const decimals = Math.max(getDecimals(props.step ?? 0), getDecimals(props.min))
  return Number(num.toFixed(Math.min(decimals, 20)))
}

const hasStep = computed(() => typeof props.step === 'number' && props.step > 0)

/** Clamp to [min, max] and snap to the closest step / mark. */
function snap(raw: number) {
  const { min, max } = props
  const val = clamp(raw, min, max)
  const candidates: number[] = markList.value.map(item => item.point)
  if (hasStep.value) {
    const step = props.step as number
    candidates.push(clamp(fixPrecision(Math.round((val - min) / step) * step + min), min, max))
    // `max` is always reachable even when (max - min) is not divisible by step
    candidates.push(max)
  }
  else {
    candidates.push(min, max)
  }
  let closest = candidates[0]
  candidates.forEach((item) => {
    if (Math.abs(item - val) < Math.abs(closest - val))
      closest = item
  })
  return closest
}

function getPercent(val: number) {
  const range = props.max - props.min
  return range > 0 ? ((val - props.min) / range) * 100 : 0
}

// ---------- layout ----------
function offsetStyle(percent: number): CSSProperties {
  if (isVertical.value)
    return { [props.reverse ? 'top' : 'bottom']: `${percent}%` }
  return { [props.reverse ? 'insetInlineEnd' : 'insetInlineStart']: `${percent}%` }
}

const trackRange = computed<[number, number]>(() => {
  const list = values.value
  return props.range ? [list[0], list[1]] : [props.min, list[0]]
})

const trackStyle = computed<CSSProperties>(() => {
  const start = getPercent(trackRange.value[0])
  const length = `${getPercent(trackRange.value[1]) - start}%`
  return { ...offsetStyle(start), [isVertical.value ? 'height' : 'width']: length }
})

function isIncluded(point: number) {
  return props.included && point >= trackRange.value[0] && point <= trackRange.value[1]
}

const dotList = computed<number[]>(() => {
  const points = new Set<number>(markList.value.map(item => item.point))
  if (props.dots && hasStep.value) {
    const step = props.step as number
    if ((props.max - props.min) / step <= MAX_DOTS) {
      for (let point = props.min; point <= props.max; point = fixPrecision(point + step))
        points.add(point)
    }
  }
  return Array.from(points).sort((a, b) => a - b)
})

// ---------- tooltip bubble ----------
const dragging = ref(false)
const activeIndex = ref(-1)

function isTooltipVisible(index: number) {
  const tooltip = props.tooltip
  if (tooltip?.formatter === null)
    return false
  return tooltip?.open ?? (dragging.value && activeIndex.value === index)
}

function getTooltipContent(val: number): VueNode {
  const formatter = props.tooltip?.formatter
  return formatter ? formatter(val) : val
}

// ---------- drag ----------
function getPointValue(clientX: number, clientY: number) {
  const rect = bodyRef.value?.getBoundingClientRect()
  if (!rect)
    return values.value[0]
  let ratio: number
  if (isVertical.value) {
    ratio = rect.height > 0 ? (rect.bottom - clientY) / rect.height : 0
    if (props.reverse)
      ratio = 1 - ratio
  }
  else {
    ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0
    if (isRtl.value !== props.reverse)
      ratio = 1 - ratio
  }
  return snap(props.min + clamp(ratio, 0, 1) * (props.max - props.min))
}

/** Move the active handle; handles may cross each other in range mode. */
function moveActive(next: number) {
  const list = values.value.slice()
  list[activeIndex.value] = next
  if (props.range && list[0] > list[1]) {
    list.reverse()
    activeIndex.value = 1 - activeIndex.value
  }
  commit(list)
}

function startDrag(clientX: number, clientY: number, target: EventTarget | null) {
  const handle = (target as HTMLElement | null)?.closest?.('.am-slider-handle') as HTMLElement | null
  if (handle && handle.dataset.index !== undefined) {
    // grabbing a handle never makes the value jump
    activeIndex.value = Number(handle.dataset.index)
    dragging.value = true
    return
  }
  const next = getPointValue(clientX, clientY)
  const list = values.value
  let index = 0
  if (props.range) {
    const d0 = Math.abs(list[0] - next)
    const d1 = Math.abs(list[1] - next)
    index = d0 === d1 ? (next < list[0] ? 0 : 1) : d0 < d1 ? 0 : 1
  }
  activeIndex.value = index
  dragging.value = true
  moveActive(next)
}

function endDrag() {
  if (!dragging.value)
    return
  dragging.value = false
  emit('changeComplete', toOutput(values.value))
}

let lastTouchTime = 0

function handleTouchStart(event: TouchEvent) {
  if (disabled.value)
    return
  lastTouchTime = Date.now()
  const point = event.touches[0]
  startDrag(point.clientX, point.clientY, event.target)
}

function handleTouchMove(event: TouchEvent) {
  if (!dragging.value)
    return
  preventDefault(event)
  const point = event.touches[0]
  moveActive(getPointValue(point.clientX, point.clientY))
}

function handleTouchEnd() {
  lastTouchTime = Date.now()
  endDrag()
}

// mouse support, so the slider also works in desktop browsers
function handleMouseMove(event: MouseEvent) {
  if (dragging.value)
    moveActive(getPointValue(event.clientX, event.clientY))
}

function removeMouseListeners() {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

function handleMouseUp() {
  removeMouseListeners()
  endDrag()
}

function handleMouseDown(event: MouseEvent) {
  // ignore the mouse events emulated after a touch
  if (disabled.value || event.button !== 0 || Date.now() - lastTouchTime < 500)
    return
  event.preventDefault()
  startDrag(event.clientX, event.clientY, event.target)
  handleRefs.value[activeIndex.value]?.focus({ preventScroll: true })
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

onBeforeUnmount(() => {
  if (typeof document !== 'undefined')
    removeMouseListeners()
})

// ---------- keyboard ----------
let keyChanged = false

function getSiblingValue(current: number, direction: 1 | -1) {
  if (hasStep.value)
    return snap(fixPrecision(current + direction * (props.step as number)))
  const points = Array.from(new Set([props.min, props.max, ...markList.value.map(item => item.point)])).sort((a, b) => a - b)
  const rest = direction > 0 ? points.filter(p => p > current) : points.filter(p => p < current).reverse()
  return rest[0] ?? current
}

function handleKeydown(event: KeyboardEvent, index: number) {
  if (disabled.value || !props.keyboard)
    return
  const current = values.value[index]
  const flipX = !isVertical.value && isRtl.value !== props.reverse
  const flipY = isVertical.value && props.reverse
  let next: number | undefined
  switch (event.key) {
    case 'ArrowRight':
      next = getSiblingValue(current, flipX ? -1 : 1)
      break
    case 'ArrowLeft':
      next = getSiblingValue(current, flipX ? 1 : -1)
      break
    case 'ArrowUp':
      next = getSiblingValue(current, flipY ? -1 : 1)
      break
    case 'ArrowDown':
      next = getSiblingValue(current, flipY ? 1 : -1)
      break
    case 'Home':
      next = props.min
      break
    case 'End':
      next = props.max
      break
  }
  if (next === undefined)
    return
  event.preventDefault()
  if (next === current)
    return
  keyChanged = true
  activeIndex.value = index
  moveActive(next)
  if (activeIndex.value !== index)
    nextTick(() => handleRefs.value[activeIndex.value]?.focus())
}

function handleKeyup() {
  if (keyChanged) {
    keyChanged = false
    emit('changeComplete', toOutput(values.value))
  }
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
  formItem.onFieldBlur()
}

function getAriaLabel(index: number) {
  const label = props.ariaLabelForHandle
  return Array.isArray(label) ? label[index] : label
}

const classNames = computed(() => [
  'am-slider',
  isVertical.value ? 'am-slider-vertical' : 'am-slider-horizontal',
  {
    'am-slider-range': props.range,
    'am-slider-reverse': props.reverse,
    'am-slider-disabled': disabled.value,
    'am-slider-dragging': dragging.value,
    'am-slider-with-marks': markList.value.length > 0,
  },
  props.rootClass,
  props.classes?.root,
])

defineExpose<SliderExpose>({
  focus: () => handleRefs.value[0]?.focus(),
  blur: () => handleRefs.value.forEach(el => el?.blur()),
})
</script>

<template>
  <div
    v-bind="$attrs"
    :class="classNames"
    :style="styles?.root"
    @touchstart.passive="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
    @mousedown="handleMouseDown"
  >
    <div ref="bodyRef" class="am-slider-body">
      <div class="am-slider-rail" :class="classes?.rail" :style="styles?.rail" />
      <div v-if="included" class="am-slider-track" :class="classes?.track" :style="[trackStyle, styles?.track]" />
      <div v-if="dotList.length" class="am-slider-step">
        <span
          v-for="point in dotList"
          :key="point"
          class="am-slider-dot"
          :class="{ 'am-slider-dot-active': isIncluded(point) }"
          :style="offsetStyle(getPercent(point))"
        />
      </div>
      <div
        v-for="(item, index) in values"
        :id="index === 0 ? (id ?? formItem.id.value) : undefined"
        :key="index"
        ref="handleRefs"
        class="am-slider-handle"
        :class="[{ 'am-slider-handle-active': dragging && activeIndex === index }, classes?.handle]"
        :style="[offsetStyle(getPercent(item)), styles?.handle]"
        role="slider"
        :tabindex="disabled ? -1 : 0"
        :data-index="index"
        :aria-label="getAriaLabel(index)"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="item"
        :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
        :aria-disabled="disabled || undefined"
        @keydown="handleKeydown($event, index)"
        @keyup="handleKeyup"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <slot name="handle" :value="item" :index="index" :dragging="dragging && activeIndex === index">
          <span class="am-slider-thumb" />
        </slot>
        <Transition name="am-fade">
          <span v-if="isTooltipVisible(index)" class="am-slider-tooltip" role="tooltip">
            <RenderNode :node="getTooltipContent(item)" />
          </span>
        </Transition>
      </div>
      <div v-if="markList.length" class="am-slider-mark">
        <span
          v-for="mark in markList"
          :key="mark.point"
          class="am-slider-mark-text"
          :class="{ 'am-slider-mark-text-active': isIncluded(mark.point) }"
          :style="[offsetStyle(getPercent(mark.point)), mark.style]"
        >
          <slot name="mark" :point="mark.point" :label="mark.label">
            <RenderNode :node="mark.label" />
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>
