<script setup lang="ts">
import type { InputFocusOptions, InputInstance, InputSearchEmits, InputSearchProps, InputSearchSlots } from './interface'
import { SearchOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'
import { Spinner } from '../_base'
import { isRenderable } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import { useLocale } from '../locale'
import Input from './Input.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmInputSearch', inheritAttrs: false })

const props = withDefaults(defineProps<InputSearchProps>(), {
  value: undefined,
  disabled: undefined,
  allowClear: true,
  clearTrigger: 'always',
  prefix: undefined,
  suffix: undefined,
  variant: 'filled',
  inputmode: 'search',
  enterkeyhint: 'search',
  enterButton: undefined,
  searchIcon: undefined,
  cancelText: undefined,
  round: true,
})
const emit = defineEmits<InputSearchEmits>()
const slots = defineSlots<InputSearchSlots>()

const locale = useLocale('InputSearch')
const disabled = useDisabled(() => props.disabled)
const size = useSize(() => props.size)
const rootRef = ref<HTMLElement>()
const inputRef = ref<InputInstance>()
const focused = ref(false)

const [rawValue, setRawValue] = useControlled<InputSearchProps, 'value', string | number | null>(props, 'value', {
  defaultValue: () => props.defaultValue ?? '',
  onChange: value => emit('update:value', String(value ?? '')),
})
const value = computed(() => String(rawValue.value ?? ''))

const hasEnterButton = computed(() => !!slots.enterButton || (isRenderable(props.enterButton)))
const customEnterButton = computed(() => (props.enterButton === true ? undefined : props.enterButton))
const cancelVisible = computed(() => props.showCancel && (focused.value || value.value !== ''))

function handleUpdate(next: string) {
  if (next !== value.value)
    setRawValue(next)
}

function triggerSearch(event?: Event, source: 'input' | 'clear' = 'input', nextValue = value.value) {
  if (disabled.value || props.loading)
    return
  emit('search', nextValue, event, { source })
}

function handlePressEnter(event: KeyboardEvent) {
  emit('pressEnter', event)
  triggerSearch(event)
  // closes the virtual keyboard
  inputRef.value?.blur()
}

function handleClear() {
  emit('clear')
  triggerSearch(undefined, 'clear', '')
}

function handleFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  focused.value = false
  emit('blur', event)
}

function handleCancel() {
  if (value.value !== '')
    setRawValue('')
  inputRef.value?.blur()
  emit('cancel')
}

const classNames = computed(() => [
  'am-input-search',
  {
    'am-input-search-sm': size.value === 'small',
    'am-input-search-lg': size.value === 'large',
    'am-input-search-round': props.round,
    'am-input-search-focused': focused.value,
    'am-input-search-disabled': disabled.value,
  },
  props.rootClass,
  props.classes?.root,
])

defineExpose({
  focus: (options?: InputFocusOptions) => inputRef.value?.focus(options),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select(),
  get input() {
    return inputRef.value?.input
  },
  get nativeElement() {
    return rootRef.value
  },
})
</script>

<template>
  <div ref="rootRef" v-bind="$attrs" :class="classNames" :style="styles?.root" role="search">
    <Input
      :id="id"
      ref="inputRef"
      class="am-input-search-input"
      :root-class="classes?.input"
      :styles="{ root: styles?.input }"
      type="search"
      :value="value"
      :placeholder="placeholder ?? locale.placeholder"
      :disabled="disabled"
      :read-only="readOnly || readonly"
      :maxlength="maxlength"
      :allow-clear="allowClear"
      :clear-trigger="clearTrigger"
      :suffix="suffix"
      :size="size"
      :status="status"
      :variant="variant"
      :inputmode="inputmode"
      :enterkeyhint="enterkeyhint"
      :autofocus="autofocus"
      :autocomplete="autocomplete"
      :name="name"
      @update:value="handleUpdate"
      @change="emit('change', $event)"
      @input="emit('input', $event)"
      @press-enter="handlePressEnter"
      @focus="handleFocus"
      @blur="handleBlur"
      @clear="handleClear"
    >
      <template #prefix>
        <slot name="prefix">
          <RenderNode v-if="isRenderable(prefix)" :node="prefix" />
          <span v-else class="am-input-search-icon">
            <Spinner v-if="loading" />
            <slot v-else name="searchIcon">
              <RenderNode v-if="isRenderable(searchIcon)" :node="searchIcon" />
              <SearchOutlined v-else />
            </slot>
          </span>
        </slot>
      </template>
      <template v-if="$slots.suffix" #suffix>
        <slot name="suffix" />
      </template>
      <template v-if="$slots.clearIcon" #clearIcon>
        <slot name="clearIcon" />
      </template>
    </Input>
    <button
      v-if="hasEnterButton"
      type="button"
      class="am-input-search-button"
      :class="classes?.button"
      :style="styles?.button"
      :disabled="disabled || loading"
      @mousedown.prevent
      @click="triggerSearch($event)"
    >
      <slot name="enterButton">
        <RenderNode v-if="customEnterButton !== undefined" :node="customEnterButton" />
        <SearchOutlined v-else />
      </slot>
    </button>
    <button
      v-if="cancelVisible"
      type="button"
      class="am-input-search-cancel"
      :class="classes?.cancel"
      :style="styles?.cancel"
      @mousedown.prevent
      @click="handleCancel"
    >
      <slot name="cancelText">
        <RenderNode v-if="isRenderable(cancelText)" :node="cancelText" />
        <template v-else>
          {{ locale.cancelText }}
        </template>
      </slot>
    </button>
  </div>
</template>
