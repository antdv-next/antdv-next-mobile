<script setup lang="ts">
import type { PickerChangeInfo, PickerEmits, PickerProps, PickerSlots, PickerValue } from './interface'
import { computed, ref, watch } from 'vue'
import { useControlled } from '../_util/hooks'
import { useLocale } from '../locale'
import PickerView from '../picker-view/PickerView.vue'
import { resolvePicker } from '../picker-view/util'
import PickerPopup from './PickerPopup.vue'
import PickerTrigger from './PickerTrigger.vue'
import { usePickerField } from './usePickerField'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmPicker', inheritAttrs: false })

const props = withDefaults(defineProps<PickerProps>(), {
  open: undefined,
  defaultOpen: false,
  disabled: undefined,
  allowClear: false,
  trigger: true,
  suffixIcon: undefined,
  getContainer: undefined,
  maskClosable: true,
  destroyOnHidden: false,
  loading: false,
  virtual: true,
  optionRender: undefined,
})
const emit = defineEmits<PickerEmits>()
defineSlots<PickerSlots>()

const locale = useLocale('Picker')

const { open, setOpen, toggle, disabled, commit } = usePickerField(props, (value) => {
  emit('update:open', value)
  emit('openChange', value)
})

const [value, setValue] = useControlled<PickerProps, 'value', PickerValue[]>(props, 'value', {
  defaultValue: () => props.defaultValue ?? [],
})

/** value of the wheels while the popup is open */
const pendingValue = ref<PickerValue[]>(value.value.slice())

watch(open, (val) => {
  if (val)
    pendingValue.value = value.value.slice()
}, { immediate: true })
watch(value, (val) => {
  if (open.value)
    pendingValue.value = val.slice()
})

const hasValue = computed(() => value.value.length > 0)
const selected = computed(() => resolvePicker(props.columns, value.value, props.fieldNames))
const label = computed(() => {
  if (!hasValue.value)
    return ''
  const { items } = selected.value
  if (props.format)
    return props.format(items)
  const labelKey = props.fieldNames?.label ?? 'label'
  const valueKey = props.fieldNames?.value ?? 'value'
  return items.map((item, index) => item?.[labelKey] ?? item?.[valueKey] ?? value.value[index]).join(' / ')
})

function update(next: PickerValue[], info: PickerChangeInfo) {
  setValue(next)
  emit('update:value', next)
  emit('change', next, info)
  commit()
}

function onSelect(next: PickerValue[], info: PickerChangeInfo) {
  pendingValue.value = next
  emit('select', next, info)
}

function onConfirm() {
  if (props.loading)
    return
  const result = resolvePicker(props.columns, pendingValue.value, props.fieldNames)
  const info = { items: result.items }
  const changed = result.value.length !== value.value.length || result.value.some((val, index) => val !== value.value[index])
  if (changed)
    update(result.value, info)
  emit('confirm', result.value, info)
  setOpen(false)
}

function onCancel() {
  emit('cancel')
  setOpen(false)
}

function onClear() {
  update([], { items: [] })
  emit('clear')
}

defineExpose({ toggle })
</script>

<template>
  <slot
    v-if="$slots.default"
    :open="open"
    :value="value"
    :label="label"
    :items="hasValue ? selected.items : []"
    :disabled="disabled"
    :toggle="toggle"
  />
  <PickerTrigger
    v-else-if="trigger"
    v-bind="$attrs"
    :id="id"
    class="am-picker"
    :label="label"
    :placeholder="placeholder ?? locale.placeholder"
    :open="open"
    :disabled="disabled"
    :allow-clear="allowClear"
    :status="status"
    :variant="variant"
    :size="size"
    :suffix-icon="suffixIcon"
    :root-class="rootClass"
    :classes="classes"
    :styles="styles"
    @click="toggle()"
    @clear="onClear"
  >
    <template v-if="$slots.suffixIcon" #suffixIcon>
      <slot name="suffixIcon" />
    </template>
  </PickerTrigger>
  <PickerPopup
    :open="open"
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    :confirm-disabled="loading"
    :get-container="getContainer"
    :z-index="zIndex"
    :mask-closable="maskClosable"
    :destroy-on-hidden="destroyOnHidden"
    :root-class="rootClass"
    :popup-class="classes?.popup"
    :popup-style="styles?.popup"
    @confirm="onConfirm"
    @cancel="onCancel"
  >
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <slot name="header" />
    <PickerView
      :columns="columns"
      :field-names="fieldNames"
      :value="pendingValue"
      :loading="loading"
      :item-height="itemHeight"
      :visible-item-count="visibleItemCount"
      :virtual="virtual"
      :option-render="optionRender"
      @change="onSelect"
    >
      <template v-if="$slots.option" #option="info">
        <slot name="option" v-bind="info" />
      </template>
    </PickerView>
    <slot name="footer" />
  </PickerPopup>
</template>
