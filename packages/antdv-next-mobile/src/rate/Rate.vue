<script setup lang="ts">
import type { RateEmits, RateExpose, RateProps, RateSlots } from './interface'
import { StarFilled } from '@antdv-next/icons'
import { computed, ref } from 'vue'
import { clamp, preventDefault } from '../_util'
import { useControlled, useTouch } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useConfig, useDisabled, useSize } from '../config-provider/context'
import { useFormItemInputContext } from '../form/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmRate', inheritAttrs: false })

const props = withDefaults(defineProps<RateProps>(), {
  count: 5,
  allowHalf: false,
  allowClear: true,
  disabled: undefined,
  // `RenderNodeFn` includes boolean: without this Vue casts an absent prop to `false`
  character: undefined,
  keyboard: true,
})
const emit = defineEmits<RateEmits>()
defineSlots<RateSlots>()

const config = useConfig()
const size = useSize(() => props.size)
const disabled = useDisabled(() => props.disabled)
const formItem = useFormItemInputContext()
const touch = useTouch()

const rootRef = ref<HTMLElement>()
const isRtl = computed(() => config.direction.value === 'rtl')

const [value, setValue] = useControlled(props, 'value', {
  defaultValue: () => props.defaultValue ?? 0,
  onChange: (val: number) => {
    emit('update:value', val)
    emit('change', val)
    formItem.onFieldChange()
  },
})

function change(next: number) {
  const val = clamp(next, 0, props.count)
  if (val !== value.value)
    setValue(val)
}

function getStarState(index: number) {
  const current = value.value ?? 0
  if (index + 1 <= current)
    return 'full'
  if (props.allowHalf && current > index)
    return 'half'
  return 'zero'
}

/** Offset of `clientX` from the leading edge of a star (direction aware). */
function getOffset(rect: DOMRect, clientX: number) {
  return isRtl.value ? rect.right - clientX : clientX - rect.left
}

function getValueFromPoint(clientX: number) {
  const stars = rootRef.value?.children
  let result = 0
  if (!stars)
    return result
  for (let i = 0; i < stars.length; i++) {
    const rect = stars[i].getBoundingClientRect()
    const offset = getOffset(rect, clientX)
    if (offset <= 0)
      break
    result = props.allowHalf && offset < rect.width / 2 ? i + 0.5 : i + 1
  }
  return result
}

// ---------- tap ----------
let lastDragTime = 0

function handleClick(event: MouseEvent, index: number) {
  if (disabled.value || Date.now() - lastDragTime < 300)
    return
  let next = index + 1
  if (props.allowHalf) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    if (rect.width > 0 && getOffset(rect, event.clientX) < rect.width / 2)
      next -= 0.5
  }
  change(props.allowClear && next === value.value ? 0 : next)
}

// ---------- drag across the stars ----------
let dragging = false

function handleTouchStart(event: TouchEvent) {
  if (disabled.value)
    return
  touch.start(event)
  dragging = false
}

function handleTouchMove(event: TouchEvent) {
  if (disabled.value)
    return
  touch.move(event)
  if (!dragging && !touch.isHorizontal())
    return
  dragging = true
  preventDefault(event)
  const next = getValueFromPoint(event.touches[0].clientX)
  const min = props.allowClear ? 0 : props.allowHalf ? 0.5 : 1
  change(Math.max(next, min))
}

function handleTouchEnd() {
  if (dragging) {
    dragging = false
    lastDragTime = Date.now()
  }
}

// ---------- keyboard ----------
function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event)
  if (disabled.value || !props.keyboard)
    return
  const step = props.allowHalf ? 0.5 : 1
  const forward = isRtl.value ? 'ArrowLeft' : 'ArrowRight'
  const backward = isRtl.value ? 'ArrowRight' : 'ArrowLeft'
  if (event.key === forward) {
    change(value.value + step)
    event.preventDefault()
  }
  else if (event.key === backward) {
    change(value.value - step)
    event.preventDefault()
  }
}

function handleFocus() {
  emit('focus')
}

function handleBlur() {
  emit('blur')
  formItem.onFieldBlur()
}

const classNames = computed(() => [
  'am-rate',
  {
    'am-rate-sm': size.value === 'small',
    'am-rate-lg': size.value === 'large',
    'am-rate-disabled': disabled.value,
    'am-rate-half': props.allowHalf,
  },
  props.rootClass,
  props.classes?.root,
])

defineExpose<RateExpose>({
  focus: () => rootRef.value?.focus(),
  blur: () => rootRef.value?.blur(),
})
</script>

<template>
  <ul
    v-bind="$attrs"
    :id="id ?? formItem.id.value"
    ref="rootRef"
    :class="classNames"
    :style="styles?.root"
    role="radiogroup"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled || undefined"
    @touchstart.passive="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <li
      v-for="(_, index) in count"
      :key="index"
      class="am-rate-star"
      :class="[`am-rate-star-${getStarState(index)}`, classes?.star]"
      :style="styles?.star"
      role="radio"
      :aria-checked="value > index"
      :aria-posinset="index + 1"
      :aria-setsize="count"
      :data-index="index"
      @click="handleClick($event, index)"
    >
      <div class="am-rate-star-first" aria-hidden="true">
        <slot name="character" :index="index" :value="value">
          <RenderNode v-if="character !== undefined" :node="character" :params="{ index, value }" />
          <StarFilled v-else />
        </slot>
      </div>
      <div class="am-rate-star-second">
        <slot name="character" :index="index" :value="value">
          <RenderNode v-if="character !== undefined" :node="character" :params="{ index, value }" />
          <StarFilled v-else />
        </slot>
      </div>
    </li>
  </ul>
</template>
