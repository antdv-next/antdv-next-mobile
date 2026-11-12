<script setup lang="ts">
import type { CheckboxChangeEvent, CheckboxEmits, CheckboxIconContext, CheckboxProps, CheckboxSlots } from './interface'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled } from '../config-provider/context'
import { useFormItemInputContext } from '../form/context'
import { useCheckboxGroupContext } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCheckbox', inheritAttrs: false })

const props = withDefaults(defineProps<CheckboxProps>(), {
  checked: undefined,
  defaultChecked: undefined,
  checkedValue: undefined,
  unCheckedValue: undefined,
  disabled: undefined,
  block: undefined,
  icon: undefined,
  indeterminate: false,
  skipGroup: false,
})
const emit = defineEmits<CheckboxEmits>()
defineSlots<CheckboxSlots>()

const injectedGroup = useCheckboxGroupContext()
const group = computed(() => (props.skipGroup ? undefined : injectedGroup))
const formItem = useFormItemInputContext()

const inputRef = ref<HTMLInputElement | null>(null)
const rootRef = ref<HTMLElement | null>(null)

const mergedCheckedValue = computed(() => props.checkedValue ?? true)
const mergedUnCheckedValue = computed(() => props.unCheckedValue ?? false)

const [innerChecked, setInnerChecked] = useControlled<CheckboxProps, 'checked', any>(props, 'checked', {
  defaultValue: () => props.defaultChecked ?? mergedUnCheckedValue.value,
  onChange: val => emit('update:checked', val),
})

const checked = computed<boolean>(() => {
  if (group.value)
    return group.value.value.value.includes(props.value)
  return innerChecked.value === mergedCheckedValue.value
})

const disabled = useDisabled(() => {
  if (props.disabled !== undefined)
    return props.disabled
  const g = group.value
  if (g && (g.disabled.value || (g.isFull.value && !checked.value)))
    return true
  return undefined
})

const mergedBlock = computed(() => props.block ?? group.value?.block.value ?? false)
const mergedShape = computed(() => props.shape ?? group.value?.shape.value ?? 'square')
const mergedName = computed(() => props.name ?? group.value?.name.value)
const mergedId = computed(() => props.id ?? (group.value ? undefined : formItem.id.value))
const groupIconSlot = computed(() => group.value?.iconSlot())

const iconContext = computed<CheckboxIconContext>(() => ({
  checked: checked.value,
  indeterminate: props.indeterminate && !checked.value,
  disabled: disabled.value,
}))

// ---------- group registration (keeps `value` clean when an item is removed) ----------
onMounted(() => {
  group.value?.register(props.value)
  if (props.autoFocus)
    inputRef.value?.focus()
})
watch(
  () => props.value,
  (val, prev) => {
    group.value?.unregister(prev)
    group.value?.register(val)
  },
)
onBeforeUnmount(() => group.value?.unregister(props.value))

function syncNative() {
  // A controlled checkbox may reject the change, keep the native input in sync with the state.
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.checked = checked.value
      inputRef.value.indeterminate = iconContext.value.indeterminate
    }
  })
}
watch(iconContext, syncNative, { flush: 'post' })
onMounted(syncNative)

function handleChange(event: Event) {
  if (disabled.value) {
    syncNative()
    return
  }
  const nextChecked = !checked.value
  const changeEvent: CheckboxChangeEvent = {
    target: { ...props, checked: nextChecked },
    stopPropagation: () => event.stopPropagation(),
    preventDefault: () => event.preventDefault(),
    nativeEvent: event,
  }
  if (group.value) {
    group.value.toggle(props.value)
    emit('change', changeEvent)
  }
  else {
    setInnerChecked(nextChecked ? mergedCheckedValue.value : mergedUnCheckedValue.value)
    emit('change', changeEvent)
    formItem.onFieldChange()
  }
  syncNative()
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
  if (!group.value)
    formItem.onFieldBlur()
}

const classNames = computed(() => [
  'am-checkbox',
  {
    'am-checkbox-checked': checked.value,
    'am-checkbox-indeterminate': iconContext.value.indeterminate,
    'am-checkbox-disabled': disabled.value,
    'am-checkbox-block': mergedBlock.value,
    'am-checkbox-round': mergedShape.value === 'round',
  },
  group.value?.classes.value?.item,
  props.rootClass,
  props.classes?.root,
])

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
      class="am-checkbox-input"
      type="checkbox"
      :name="mergedName"
      :checked="checked"
      :disabled="disabled"
      :required="required"
      :tabindex="tabIndex"
      :aria-checked="iconContext.indeterminate ? 'mixed' : checked"
      @change="handleChange"
      @click="emit('click', $event)"
      @focus="emit('focus', $event)"
      @blur="handleBlur"
    >
    <span
      class="am-checkbox-icon"
      :class="[group?.classes.value?.itemIcon, classes?.icon]"
      :style="[group?.styles.value?.itemIcon, styles?.icon]"
    >
      <slot name="icon" v-bind="iconContext">
        <RenderNode v-if="groupIconSlot" :node="groupIconSlot" :params="iconContext" />
        <RenderNode v-else-if="icon !== undefined && icon !== null && icon !== false" :node="icon" :params="iconContext" />
        <span v-else class="am-checkbox-inner" />
      </slot>
    </span>
    <span
      v-if="$slots.default"
      class="am-checkbox-label"
      :class="[group?.classes.value?.itemLabel, classes?.label]"
      :style="[group?.styles.value?.itemLabel, styles?.label]"
    >
      <slot />
    </span>
  </label>
</template>
