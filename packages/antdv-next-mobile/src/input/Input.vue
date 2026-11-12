<script setup lang="ts">
import type { InputEmits, InputInstance, InputProps, InputSlots } from './interface'
import { CloseCircleFilled } from '@antdv-next/icons'
import { computed, onMounted, ref } from 'vue'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import { countText, isRenderable, useInput } from './useInput'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmInput', inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
  value: undefined,
  disabled: undefined,
  showCount: false,
  allowClear: false,
  clearTrigger: 'focus',
  prefix: undefined,
  suffix: undefined,
  type: 'text',
})
const emit = defineEmits<InputEmits>()
const slots = defineSlots<InputSlots>()

const locale = useLocale('Input')
const rootRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()

const {
  value,
  focused,
  disabled,
  size,
  status,
  variant,
  readOnly,
  fieldId,
  handleInput,
  handleCompositionStart,
  handleCompositionEnd,
  handleFocus,
  handleBlur,
  handleClear,
  focus,
  blur,
  select,
} = useInput(props, emit as any, inputRef)

const hasPrefix = computed(() => !!slots.prefix || isRenderable(props.prefix))
const hasSuffix = computed(() => !!slots.suffix || isRenderable(props.suffix))
const clearIcon = computed(() => (typeof props.allowClear === 'object' ? props.allowClear?.clearIcon : undefined))
const showClear = computed(() =>
  !!props.allowClear
  && !disabled.value
  && !readOnly.value
  && value.value !== ''
  && (props.clearTrigger === 'always' || focused.value),
)

const count = computed(() => countText(value.value))
const countFormatter = computed(() => (typeof props.showCount === 'object' ? props.showCount?.formatter : undefined))
const countInfo = computed(() => ({ value: value.value, count: count.value, maxLength: props.maxlength }))

const classNames = computed(() => [
  'am-input',
  `am-input-${variant.value}`,
  {
    'am-input-sm': size.value === 'small',
    'am-input-lg': size.value === 'large',
    'am-input-disabled': disabled.value,
    'am-input-readonly': readOnly.value,
    'am-input-focused': focused.value,
    [`am-input-status-${status.value}`]: !!status.value,
    [`am-input-align-${props.align}`]: !!props.align,
  },
  props.rootClass,
  props.classes?.root,
])

function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event)
  if (event.key === 'Enter' && !event.isComposing)
    emit('pressEnter', event)
}

/** Tapping the padding / affixes focuses the input, like a native field. */
function handleRootClick(event: MouseEvent) {
  const el = inputRef.value
  if (!el || disabled.value || event.target === el)
    return
  if ((event.target as HTMLElement).closest?.('button, a, [role="button"]'))
    return
  el.focus()
}

onMounted(() => {
  if (props.autofocus)
    inputRef.value?.focus()
})

const instance: InputInstance = {
  focus,
  blur,
  select,
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
  <span ref="rootRef" v-bind="$attrs" :class="classNames" :style="styles?.root" @click="handleRootClick">
    <span v-if="hasPrefix" class="am-input-prefix" :class="classes?.prefix" :style="styles?.prefix">
      <slot name="prefix">
        <RenderNode :node="prefix" />
      </slot>
    </span>
    <input
      :id="fieldId"
      ref="inputRef"
      class="am-input-input"
      :class="classes?.input"
      :style="styles?.input"
      :type="type"
      :value="value"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readOnly"
      :maxlength="maxlength"
      :inputmode="inputmode as any"
      :enterkeyhint="enterkeyhint as any"
      :autocomplete="autocomplete"
      :aria-invalid="status === 'error' || undefined"
      @input="handleInput"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @keyup="emit('keyup', $event)"
    >
    <span
      v-if="showClear"
      class="am-input-clear"
      :class="classes?.clear"
      :style="styles?.clear"
      role="button"
      :aria-label="locale.clear"
      @mousedown.prevent
      @click.stop="handleClear"
    >
      <slot name="clearIcon">
        <RenderNode v-if="isRenderable(clearIcon)" :node="clearIcon" />
        <CloseCircleFilled v-else />
      </slot>
    </span>
    <span v-if="showCount" class="am-input-count" :class="classes?.count" :style="styles?.count">
      <RenderNode v-if="countFormatter" :node="countFormatter" :params="countInfo" />
      <template v-else>{{ maxlength !== undefined ? `${count} / ${maxlength}` : count }}</template>
    </span>
    <span v-if="hasSuffix" class="am-input-suffix" :class="classes?.suffix" :style="styles?.suffix">
      <slot name="suffix">
        <RenderNode :node="suffix" />
      </slot>
    </span>
  </span>
</template>
