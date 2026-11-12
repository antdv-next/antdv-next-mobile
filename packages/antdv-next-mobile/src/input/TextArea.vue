<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { TextAreaEmits, TextAreaInstance, TextAreaProps, TextAreaSlots } from './interface'
import { CloseCircleFilled } from '@antdv-next/icons'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import { countText, useInput } from './useInput'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmTextarea', inheritAttrs: false })

const props = withDefaults(defineProps<TextAreaProps>(), {
  value: undefined,
  disabled: undefined,
  rows: 2,
  autoSize: false,
  showCount: false,
  allowClear: false,
  clearTrigger: 'focus',
})
const emit = defineEmits<TextAreaEmits>()
defineSlots<TextAreaSlots>()

const locale = useLocale('Input')
const rootRef = ref<HTMLElement>()
const textAreaRef = ref<HTMLTextAreaElement>()

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
} = useInput(props, emit as any, textAreaRef)

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

// ---------- autoSize ----------
const autoHeight = ref<CSSProperties>()
let lastHeight = -1

function resize() {
  const el = textAreaRef.value
  if (!el || !props.autoSize) {
    autoHeight.value = undefined
    return
  }
  const { minRows, maxRows } = typeof props.autoSize === 'object' ? props.autoSize : ({} as { minRows?: number, maxRows?: number })
  const style = window.getComputedStyle(el)
  const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.5 || 24
  const extra = (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0)
    + (Number.parseFloat(style.borderTopWidth) || 0) + (Number.parseFloat(style.borderBottomWidth) || 0)

  // measure the content height without the previous fixed height
  el.style.height = 'auto'
  let height = el.scrollHeight
  let overflowY: CSSProperties['overflowY'] = 'hidden'
  if (minRows !== undefined)
    height = Math.max(height, minRows * lineHeight + extra)
  if (maxRows !== undefined) {
    const maxHeight = maxRows * lineHeight + extra
    if (height > maxHeight) {
      height = maxHeight
      overflowY = 'auto'
    }
  }
  if (height > 0) {
    el.style.height = `${height}px`
    autoHeight.value = { height: `${height}px`, overflowY }
  }
  else {
    el.style.height = ''
    autoHeight.value = undefined
  }
  if (height !== lastHeight) {
    if (lastHeight !== -1)
      emit('resize', { height })
    lastHeight = height
  }
}

watch([value, () => props.autoSize, () => props.rows], () => nextTick(resize), { deep: true })
onMounted(() => {
  resize()
  if (props.autofocus)
    textAreaRef.value?.focus()
})

// With `autoSize` the height follows the content, starting from `minRows` (1 by default).
const nativeRows = computed(() => (props.autoSize ? 1 : props.rows))

const classNames = computed(() => [
  'am-textarea',
  `am-textarea-${variant.value}`,
  {
    'am-textarea-sm': size.value === 'small',
    'am-textarea-lg': size.value === 'large',
    'am-textarea-disabled': disabled.value,
    'am-textarea-readonly': readOnly.value,
    'am-textarea-focused': focused.value,
    'am-textarea-autosize': !!props.autoSize,
    'am-textarea-allow-clear': !!props.allowClear,
    [`am-textarea-status-${status.value}`]: !!status.value,
    [`am-textarea-align-${props.align}`]: !!props.align,
  },
  props.rootClass,
  props.classes?.root,
])

function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event)
  if (event.key === 'Enter' && !event.isComposing)
    emit('pressEnter', event)
}

const instance: TextAreaInstance = {
  focus,
  blur,
  select,
  get textArea() {
    return textAreaRef.value
  },
  get nativeElement() {
    return rootRef.value
  },
}
defineExpose(instance)
</script>

<template>
  <span ref="rootRef" v-bind="$attrs" :class="classNames" :style="styles?.root">
    <textarea
      :id="fieldId"
      ref="textAreaRef"
      class="am-textarea-input"
      :class="classes?.textarea"
      :style="[autoHeight, styles?.textarea]"
      :value="value"
      :name="name"
      :rows="nativeRows"
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
    />
    <span
      v-if="showClear"
      class="am-textarea-clear"
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
    <span v-if="showCount" class="am-textarea-count" :class="classes?.count" :style="styles?.count">
      <RenderNode v-if="countFormatter" :node="countFormatter" :params="countInfo" />
      <template v-else>{{ maxlength !== undefined ? `${count} / ${maxlength}` : count }}</template>
    </span>
  </span>
</template>
