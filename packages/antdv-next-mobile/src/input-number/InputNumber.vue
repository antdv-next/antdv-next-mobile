<script setup lang="ts">
import type { InputNumberEmits, InputNumberInstance, InputNumberProps, InputNumberSlots, InputNumberValueType } from './interface'
import { MinusOutlined, PlusOutlined } from '@antdv-next/icons'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { clamp, isRenderable, preventDefault } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import { useFormItemInputContext, useMergedStatus, useVariant } from '../form/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmInputNumber', inheritAttrs: false })

const props = withDefaults(defineProps<InputNumberProps>(), {
  value: undefined,
  step: 1,
  disabled: undefined,
  controls: true,
  mode: 'spinner',
  changeOnBlur: true,
  keyboard: true,
  longPress: true,
  prefix: undefined,
  suffix: undefined,
  inputmode: 'decimal',
})
const emit = defineEmits<InputNumberEmits>()
const slots = defineSlots<InputNumberSlots>()

const LONG_PRESS_DELAY = 500
const LONG_PRESS_INTERVAL = 120

const formItem = useFormItemInputContext()
const disabled = useDisabled(() => props.disabled)
const size = useSize(() => props.size)
const status = useMergedStatus(() => props.status)
const variant = useVariant(() => props.variant)
const readOnly = computed(() => !!(props.readOnly || props.readonly))
const fieldId = computed(() => props.id ?? formItem.id.value)

const rootRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const focused = ref(false)

// ---------- number helpers ----------
function toNumber(value: unknown): number {
  if (value === '' || value === null || value === undefined)
    return Number.NaN
  return typeof value === 'number' ? value : Number(String(value).trim())
}

const isEmpty = (value: unknown) => value === '' || value === null || value === undefined

function getDecimals(value: unknown) {
  const text = String(value ?? '')
  if (/e-/i.test(text))
    return Number(text.split(/e-/i)[1]) || 0
  const index = text.indexOf('.')
  return index === -1 ? 0 : text.length - index - 1
}

const min = computed(() => (isEmpty(props.min) ? Number.NEGATIVE_INFINITY : toNumber(props.min)))
const max = computed(() => (isEmpty(props.max) ? Number.POSITIVE_INFINITY : toNumber(props.max)))
const stepNumber = computed(() => {
  const step = toNumber(props.step)
  return Number.isNaN(step) || step === 0 ? 1 : Math.abs(step)
})

function round(num: number, decimals: number) {
  return Number(num.toFixed(clamp(decimals, 0, 20)))
}

function clampNumber(num: number) {
  return clamp(num, min.value, max.value)
}

/** number -> emitted value (`precision` applied, string in `stringMode`). */
function toValue(num: number, decimals = getDecimals(num)): InputNumberValueType {
  const digits = props.precision ?? decimals
  const rounded = round(num, digits)
  if (props.stringMode)
    return props.precision !== undefined ? rounded.toFixed(props.precision) : String(rounded)
  return rounded
}

function formatValue(value: InputNumberValueType | null | undefined, userTyping = false, input = ''): string {
  if (isEmpty(value))
    return ''
  const num = toNumber(value)
  let text = String(value)
  if (!Number.isNaN(num) && props.precision !== undefined)
    text = num.toFixed(props.precision)
  return props.formatter ? props.formatter(text, { userTyping, input }) : text
}

function parseText(text: string): number {
  const parsed = props.parser ? props.parser(text) : text.replace(/,/g, '').replace(/。/g, '.')
  return toNumber(parsed)
}

// ---------- state ----------
const [value, setValue] = useControlled<InputNumberProps, 'value', InputNumberValueType | null>(props, 'value', {
  defaultValue: () => props.defaultValue ?? null,
  onChange: (next) => {
    emit('update:value', next)
    emit('change', next)
  },
})
// `null` is a valid controlled value (empty), `useControlled` only treats `undefined` as uncontrolled.
const mergedValue = computed(() => (props.value === null ? null : value.value))

const inputText = ref(formatValue(mergedValue.value))

watch([mergedValue, () => props.precision, () => props.formatter], () => {
  // Do not rewrite what the user is typing; the text is normalized on blur.
  if (focused.value && parseText(inputText.value) === toNumber(mergedValue.value))
    return
  inputText.value = formatValue(mergedValue.value)
})

function isSame(a: InputNumberValueType | null, b: InputNumberValueType | null) {
  if (isEmpty(a) || isEmpty(b))
    return isEmpty(a) && isEmpty(b)
  return String(a) === String(b)
}

function updateValue(next: InputNumberValueType | null) {
  if (isSame(next, mergedValue.value))
    return false
  setValue(next)
  formItem.onFieldChange()
  return true
}

const currentNumber = computed(() => toNumber(mergedValue.value))
const upDisabled = computed(() => disabled.value || readOnly.value || (!Number.isNaN(currentNumber.value) && currentNumber.value >= max.value))
const downDisabled = computed(() => disabled.value || readOnly.value || (!Number.isNaN(currentNumber.value) && currentNumber.value <= min.value))

// ---------- typing ----------
function handleInput(event: Event) {
  const text = (event.target as HTMLInputElement).value
  inputText.value = text
  emit('input', text)
  if ((event as InputEvent).isComposing)
    return
  if (text.trim() === '') {
    updateValue(null)
    return
  }
  const num = parseText(text)
  // Out-of-range or unfinished input (`-`, `1.`) is only committed on blur.
  if (Number.isNaN(num) || num < min.value || num > max.value)
    return
  updateValue(toValue(num, getDecimals(num)))
}

function commitText() {
  const text = inputText.value
  if (text.trim() === '') {
    updateValue(null)
  }
  else {
    const num = parseText(text)
    if (!Number.isNaN(num)) {
      const next = clampNumber(num)
      updateValue(toValue(next, getDecimals(next)))
    }
  }
  inputText.value = formatValue(mergedValue.value)
}

function handleFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  focused.value = false
  if (props.changeOnBlur)
    commitText()
  else
    inputText.value = formatValue(mergedValue.value)
  emit('blur', event)
  formItem.onFieldBlur()
}

// ---------- stepping ----------
function step(type: 'up' | 'down', emitter: 'handler' | 'keyboard') {
  if (type === 'up' ? upDisabled.value : downDisabled.value)
    return false
  const offset = stepNumber.value
  let base = currentNumber.value
  if (Number.isNaN(base)) {
    // empty: start from 0 (or the closest bound)
    base = clampNumber(0)
    if (base !== 0 || (type === 'up' ? max.value : -min.value) < offset) {
      const next = toValue(base, getDecimals(base))
      if (updateValue(next))
        emit('step', next, { offset: props.step, type, emitter })
      inputText.value = formatValue(mergedValue.value)
      return true
    }
  }
  const decimals = Math.max(getDecimals(base), getDecimals(offset))
  const target = clampNumber(round(type === 'up' ? base + offset : base - offset, decimals))
  const next = toValue(target, decimals)
  const changed = updateValue(next)
  inputText.value = formatValue(mergedValue.value)
  if (changed)
    emit('step', next, { offset: props.step, type, emitter })
  return changed
}

let pressTimer: ReturnType<typeof setTimeout> | undefined
let pressed = false

function stopPress() {
  pressed = false
  clearTimeout(pressTimer)
  pressTimer = undefined
}

function startPress(type: 'up' | 'down', event: Event) {
  // Keeps the focus (and the virtual keyboard state) where it is, and cancels the emulated mouse events after a touch.
  preventDefault(event)
  stopPress()
  if (!step(type, 'handler') || !props.longPress)
    return
  pressed = true
  const loop = () => {
    if (!pressed)
      return
    if (!step(type, 'handler')) {
      stopPress()
      return
    }
    pressTimer = setTimeout(loop, LONG_PRESS_INTERVAL)
  }
  pressTimer = setTimeout(loop, LONG_PRESS_DELAY)
}

function handleMouseDown(type: 'up' | 'down', event: MouseEvent) {
  if (event.button !== 0)
    return
  startPress(type, event)
}

/** Keyboard / assistive activation (pointer presses are handled on touchstart / mousedown). */
function handleActionClick(type: 'up' | 'down', event: MouseEvent) {
  if (event.detail === 0)
    step(type, 'handler')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.isComposing) {
    if (props.changeOnBlur)
      commitText()
    emit('pressEnter', event)
    return
  }
  if (!props.keyboard || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown'))
    return
  event.preventDefault()
  step(event.key === 'ArrowUp' ? 'up' : 'down', 'keyboard')
}

onMounted(() => {
  if (props.autofocus)
    inputRef.value?.focus()
})
onBeforeUnmount(stopPress)

const showControls = computed(() => props.mode === 'spinner' && !!props.controls)
const upIcon = computed(() => (typeof props.controls === 'object' ? props.controls?.upIcon : undefined))
const downIcon = computed(() => (typeof props.controls === 'object' ? props.controls?.downIcon : undefined))
const hasPrefix = computed(() => !!slots.prefix || isRenderable(props.prefix))
const hasSuffix = computed(() => !!slots.suffix || isRenderable(props.suffix))

const classNames = computed(() => [
  'am-input-number',
  `am-input-number-mode-${props.mode}`,
  `am-input-number-${variant.value}`,
  {
    'am-input-number-sm': size.value === 'small',
    'am-input-number-lg': size.value === 'large',
    'am-input-number-disabled': disabled.value,
    'am-input-number-readonly': readOnly.value,
    'am-input-number-focused': focused.value,
    [`am-input-number-status-${status.value}`]: !!status.value,
  },
  props.rootClass,
  props.classes?.root,
])

const instance: InputNumberInstance = {
  focus: options => inputRef.value?.focus(options),
  blur: () => inputRef.value?.blur(),
  get input() {
    return inputRef.value
  },
  get nativeElement() {
    return rootRef.value
  },
}
defineExpose(instance)
</script>

<template>
  <span ref="rootRef" v-bind="$attrs" :class="classNames" :style="styles?.root">
    <button
      v-if="showControls"
      type="button"
      class="am-input-number-action am-input-number-action-down"
      :class="[{ 'am-input-number-action-disabled': downDisabled }, classes?.action]"
      :style="styles?.action"
      :disabled="downDisabled"
      tabindex="-1"
      aria-label="-"
      @touchstart="startPress('down', $event)"
      @touchend="stopPress"
      @touchcancel="stopPress"
      @mousedown="handleMouseDown('down', $event)"
      @mouseup="stopPress"
      @mouseleave="stopPress"
      @click="handleActionClick('down', $event)"
    >
      <slot name="downIcon">
        <RenderNode v-if="isRenderable(downIcon)" :node="downIcon" />
        <MinusOutlined v-else />
      </slot>
    </button>
    <span class="am-input-number-wrapper">
      <span v-if="hasPrefix" class="am-input-number-prefix" :class="classes?.prefix" :style="styles?.prefix">
        <slot name="prefix">
          <RenderNode :node="prefix" />
        </slot>
      </span>
      <input
        :id="fieldId"
        ref="inputRef"
        class="am-input-number-input"
        :class="classes?.input"
        :style="styles?.input"
        type="text"
        role="spinbutton"
        :value="inputText"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readOnly"
        :inputmode="inputmode as any"
        autocomplete="off"
        :aria-valuemin="Number.isFinite(min) ? min : undefined"
        :aria-valuemax="Number.isFinite(max) ? max : undefined"
        :aria-valuenow="Number.isNaN(currentNumber) ? undefined : currentNumber"
        :aria-invalid="status === 'error' || undefined"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      >
      <span v-if="hasSuffix" class="am-input-number-suffix" :class="classes?.suffix" :style="styles?.suffix">
        <slot name="suffix">
          <RenderNode :node="suffix" />
        </slot>
      </span>
    </span>
    <button
      v-if="showControls"
      type="button"
      class="am-input-number-action am-input-number-action-up"
      :class="[{ 'am-input-number-action-disabled': upDisabled }, classes?.action]"
      :style="styles?.action"
      :disabled="upDisabled"
      tabindex="-1"
      aria-label="+"
      @touchstart="startPress('up', $event)"
      @touchend="stopPress"
      @touchcancel="stopPress"
      @mousedown="handleMouseDown('up', $event)"
      @mouseup="stopPress"
      @mouseleave="stopPress"
      @click="handleActionClick('up', $event)"
    >
      <slot name="upIcon">
        <RenderNode v-if="isRenderable(upIcon)" :node="upIcon" />
        <PlusOutlined v-else />
      </slot>
    </button>
  </span>
</template>
