<script setup lang="ts">
import type { RadioChangeEvent, RadioEmits, RadioIconContext, RadioProps, RadioSlots } from './interface'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import { useFormItemInputContext } from '../form/context'
import { useRadioGroupContext } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmRadio', inheritAttrs: false })

const props = withDefaults(defineProps<RadioProps>(), {
  checked: undefined,
  defaultChecked: undefined,
  disabled: undefined,
  block: undefined,
  icon: undefined,
})
const emit = defineEmits<RadioEmits>()
defineSlots<RadioSlots>()

const group = useRadioGroupContext()
const formItem = useFormItemInputContext()
const contextSize = useSize(() => undefined)

const inputRef = ref<HTMLInputElement | null>(null)
const rootRef = ref<HTMLElement | null>(null)

const [innerChecked, setInnerChecked] = useControlled<RadioProps, 'checked', boolean>(props, 'checked', {
  defaultValue: () => !!props.defaultChecked,
  onChange: val => emit('update:checked', val),
})

const checked = computed<boolean>(() => (group ? group.value.value === props.value : !!innerChecked.value))
const disabled = useDisabled(() => props.disabled ?? (group?.disabled.value ? true : undefined))

const isButton = computed(() => (props.optionType ?? group?.optionType.value) === 'button')
const size = computed(() => (group ? group.size.value : contextSize.value))
const mergedBlock = computed(() => props.block ?? group?.block.value ?? false)
const mergedName = computed(() => props.name ?? group?.name.value)
const mergedId = computed(() => props.id ?? (group ? undefined : formItem.id.value))
const groupIconSlot = computed(() => group?.iconSlot())

const iconContext = computed<RadioIconContext>(() => ({ checked: checked.value, disabled: disabled.value }))

function syncNative() {
  // A controlled radio may reject the change, keep the native input in sync with the state.
  nextTick(() => {
    if (inputRef.value)
      inputRef.value.checked = checked.value
  })
}
watch(checked, syncNative, { flush: 'post' })
onMounted(() => {
  syncNative()
  if (props.autoFocus)
    inputRef.value?.focus()
})

function handleChange(event: Event) {
  if (disabled.value || checked.value) {
    syncNative()
    return
  }
  const changeEvent: RadioChangeEvent = {
    target: { ...props, checked: true },
    stopPropagation: () => event.stopPropagation(),
    preventDefault: () => event.preventDefault(),
    nativeEvent: event,
  }
  if (group) {
    emit('change', changeEvent)
    group.select(changeEvent)
  }
  else {
    setInnerChecked(true)
    emit('change', changeEvent)
    formItem.onFieldChange()
  }
  syncNative()
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
  if (!group)
    formItem.onFieldBlur()
}

const classNames = computed(() => {
  const prefix = isButton.value ? 'am-radio-button' : 'am-radio'
  return [
    prefix,
    {
      [`${prefix}-checked`]: checked.value,
      [`${prefix}-disabled`]: disabled.value,
      [`${prefix}-block`]: mergedBlock.value,
      'am-radio-button-sm': isButton.value && size.value === 'small',
      'am-radio-button-lg': isButton.value && size.value === 'large',
      'am-radio-button-solid': isButton.value && group?.buttonStyle.value === 'solid',
    },
    group?.classes.value?.item,
    props.rootClass,
    props.classes?.root,
  ]
})

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  get input() {
    return inputRef.value
  },
  get nativeElement() {
    return rootRef.value
  },
})
</script>

<template>
  <label
    v-bind="$attrs"
    ref="rootRef"
    :class="classNames"
    :style="[group?.styles.value?.item, styles?.root]"
    :title="title"
  >
    <input
      :id="mergedId"
      ref="inputRef"
      :class="isButton ? 'am-radio-button-input' : 'am-radio-input'"
      type="radio"
      :name="mergedName"
      :checked="checked"
      :disabled="disabled"
      :required="required"
      :tabindex="tabIndex"
      @change="handleChange"
      @click="emit('click', $event)"
      @focus="emit('focus', $event)"
      @blur="handleBlur"
    >
    <span
      v-if="!isButton"
      class="am-radio-icon"
      :class="[group?.classes.value?.itemIcon, classes?.icon]"
      :style="[group?.styles.value?.itemIcon, styles?.icon]"
    >
      <slot name="icon" v-bind="iconContext">
        <RenderNode v-if="groupIconSlot" :node="groupIconSlot" :params="iconContext" />
        <RenderNode v-else-if="icon !== undefined && icon !== null && icon !== false" :node="icon" :params="iconContext" />
        <span v-else class="am-radio-inner" />
      </slot>
    </span>
    <span
      v-if="$slots.default"
      :class="[isButton ? 'am-radio-button-label' : 'am-radio-label', group?.classes.value?.itemLabel, classes?.label]"
      :style="[group?.styles.value?.itemLabel, styles?.label]"
    >
      <slot />
    </span>
  </label>
</template>
