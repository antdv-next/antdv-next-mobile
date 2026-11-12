<script setup lang="ts">
import type { InputOTPEmits, InputOTPInstance, InputOTPProps, InputOTPSlots } from './interface'
import { computed, nextTick, onMounted, ref } from 'vue'
import { isRenderable } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import { useFormItemInputContext, useMergedStatus, useVariant } from '../form/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmInputOtp', inheritAttrs: false })

const props = withDefaults(defineProps<InputOTPProps>(), {
  length: 6,
  mask: false,
  separator: undefined,
  disabled: undefined,
  inputMode: 'numeric',
})
const emit = defineEmits<InputOTPEmits>()
const slots = defineSlots<InputOTPSlots>()

const formItem = useFormItemInputContext()
const disabled = useDisabled(() => props.disabled)
const size = useSize(() => props.size)
const status = useMergedStatus(() => props.status)
const variant = useVariant(() => props.variant)
const fieldId = computed(() => props.id ?? formItem.id.value)

const rootRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const focused = ref(false)

function normalize(text: unknown) {
  let next = Array.from(String(text ?? '')).slice(0, props.length).join('')
  if (props.formatter)
    next = Array.from(String(props.formatter(next) ?? '')).slice(0, props.length).join('')
  return next
}

const [rawValue, setRawValue] = useControlled(props, 'value', {
  defaultValue: () => props.defaultValue ?? '',
  onChange: next => emit('update:value', next),
})
const value = computed(() => normalize(rawValue.value))
const chars = computed(() => Array.from(value.value))
const cells = computed(() => Array.from({ length: props.length }, (_, index) => chars.value[index] ?? ''))
/** The cell that receives the next character (the last one once everything is filled). */
const activeIndex = computed(() => Math.min(chars.value.length, props.length - 1))
const maskChar = computed(() => (typeof props.mask === 'string' && props.mask ? Array.from(props.mask)[0] : '•'))

function moveCaretToEnd() {
  const el = inputRef.value
  if (!el)
    return
  try {
    el.setSelectionRange(el.value.length, el.value.length)
  }
  catch {
    // selection is not supported for this input type
  }
}

function handleInput(event: Event) {
  const el = event.target as HTMLInputElement
  if ((event as InputEvent).isComposing)
    return
  const next = normalize(el.value)
  const prev = value.value
  // keep the native input in sync with the formatted / truncated value
  if (el.value !== next)
    el.value = next
  if (next === prev)
    return
  setRawValue(next)
  emit('input', Array.from({ length: props.length }, (_, index) => Array.from(next)[index] ?? ''))
  if (Array.from(next).length === props.length)
    emit('change', next)
  formItem.onFieldChange()
  nextTick(() => {
    const input = inputRef.value
    if (input && input.value !== value.value)
      input.value = value.value
  })
}

function handleFocus(event: FocusEvent) {
  focused.value = true
  moveCaretToEnd()
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  focused.value = false
  emit('blur', event)
  formItem.onFieldBlur()
}

function focus() {
  inputRef.value?.focus()
}

const hasSeparator = computed(() => !!slots.separator || isRenderable(props.separator))

const classNames = computed(() => [
  'am-otp',
  `am-otp-${variant.value}`,
  {
    'am-otp-sm': size.value === 'small',
    'am-otp-lg': size.value === 'large',
    'am-otp-disabled': disabled.value,
    'am-otp-focused': focused.value,
    [`am-otp-status-${status.value}`]: !!status.value,
  },
  props.rootClass,
  props.classes?.root,
])

onMounted(() => {
  if (props.autoFocus)
    focus()
})

const instance: InputOTPInstance = {
  focus,
  blur: () => inputRef.value?.blur(),
  get nativeElement() {
    return rootRef.value
  },
}
defineExpose(instance)
</script>

<template>
  <div ref="rootRef" v-bind="$attrs" :class="classNames" :style="styles?.root" role="group">
    <!-- One real input covers the cells: tap to focus, paste and SMS autofill work natively. -->
    <input
      :id="fieldId"
      ref="inputRef"
      class="am-otp-input"
      :type="mask ? 'password' : 'text'"
      :value="value"
      :name="name"
      :maxlength="length"
      :inputmode="inputMode as any"
      :disabled="disabled"
      autocomplete="one-time-code"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      :aria-invalid="status === 'error' || undefined"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @click="moveCaretToEnd"
    >
    <template v-for="(char, index) in cells" :key="index">
      <span
        class="am-otp-cell"
        :class="[{ 'am-otp-cell-active': focused && index === activeIndex, 'am-otp-cell-filled': !!char }, classes?.cell]"
        :style="styles?.cell"
        aria-hidden="true"
      >
        <template v-if="char">{{ mask ? maskChar : char }}</template>
        <span v-else-if="focused && index === activeIndex" class="am-otp-caret" />
      </span>
      <span
        v-if="hasSeparator && index < length - 1"
        class="am-otp-separator"
        :class="classes?.separator"
        :style="styles?.separator"
        aria-hidden="true"
      >
        <slot name="separator" :index="index">
          <RenderNode :node="separator" :params="index" />
        </slot>
      </span>
    </template>
  </div>
</template>
