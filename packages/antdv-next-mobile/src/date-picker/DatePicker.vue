<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import type { DatePickerEmits, DatePickerProps, DatePickerSlots, DatePickerValue } from './interface'
import dayjs from 'dayjs'
import { computed, markRaw, shallowRef, watch } from 'vue'
import { useControlled } from '../_util/hooks'
import { useLocale } from '../locale'
import PickerPopup from '../picker/PickerPopup.vue'
import PickerTrigger from '../picker/PickerTrigger.vue'
import { usePickerField } from '../picker/usePickerField'
import DatePickerView from './DatePickerView.vue'
import { createDateContext, formatDate, settleDate, toDayjs, toValue } from './util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmDatePicker', inheritAttrs: false })

const props = withDefaults(defineProps<DatePickerProps>(), {
  picker: 'date',
  showTime: false,
  use12Hours: undefined,
  open: undefined,
  defaultOpen: false,
  disabled: undefined,
  allowClear: false,
  trigger: true,
  suffixIcon: undefined,
  getContainer: undefined,
  maskClosable: true,
  destroyOnHidden: false,
  virtual: true,
})
const emit = defineEmits<DatePickerEmits>()
defineSlots<DatePickerSlots>()

const locale = useLocale('DatePicker')
const timeLocale = useLocale('TimePicker')
const ctx = computed(() => createDateContext(props, locale.value))
const fallbackFormat = computed(() => (typeof ctx.value.format === 'string' ? ctx.value.format : undefined))
const parse = (value: DatePickerValue | null | undefined) => toDayjs(value, props.valueFormat, fallbackFormat.value)

const { open, setOpen, toggle, disabled, commit } = usePickerField(props, (value) => {
  emit('update:open', value)
  emit('openChange', value)
})

const [value, setValue] = useControlled<DatePickerProps, 'value', DatePickerValue | null>(props, 'value', {
  defaultValue: () => props.defaultValue ?? null,
})

const valueDate = computed(() => parse(value.value))
const label = computed(() => formatDate(ctx.value, valueDate.value))

/** date of the wheels while the popup is open */
const pending = shallowRef<Dayjs>()
const initialDate = () => settleDate(ctx.value, valueDate.value ?? parse(props.defaultPickerValue) ?? dayjs())

watch(open, (val) => {
  if (val)
    pending.value = initialDate()
}, { immediate: true })
watch(valueDate, () => {
  if (open.value)
    pending.value = initialDate()
})

function update(date: Dayjs | null) {
  const next = date ? toValue(ctx.value, markRaw(date)) : null
  setValue(next)
  emit('update:value', next)
  emit('change', next, formatDate(ctx.value, date ?? undefined))
  commit()
}

function onSelect(next: DatePickerValue) {
  const date = next as Dayjs
  pending.value = date
  emit('select', toValue(ctx.value, date), formatDate(ctx.value, date))
}

function onConfirm() {
  const date = settleDate(ctx.value, pending.value ?? initialDate())
  if (!valueDate.value || !valueDate.value.isSame(date))
    update(date)
  emit('confirm', toValue(ctx.value, date), formatDate(ctx.value, date))
  setOpen(false)
}

function onCancel() {
  emit('cancel')
  setOpen(false)
}

function onClear() {
  update(null)
  emit('clear')
}

defineExpose({ toggle })
</script>

<template>
  <slot v-if="$slots.default" :open="open" :value="value" :label="label" :disabled="disabled" :toggle="toggle" />
  <PickerTrigger
    v-else-if="trigger"
    v-bind="$attrs"
    :id="id"
    class="am-date-picker"
    :label="label"
    :placeholder="placeholder ?? (picker === 'time' ? timeLocale.placeholder : locale.placeholder)"
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
    <DatePickerView
      :value="pending"
      :picker="picker"
      :show-time="showTime"
      :format="format"
      :min-date="ctx.min"
      :max-date="ctx.max"
      :disabled-date="disabledDate"
      :disabled-time="disabledTime"
      :use12-hours="use12Hours"
      :hour-step="hourStep"
      :minute-step="minuteStep"
      :second-step="secondStep"
      :filter="filter"
      :render-label="renderLabel"
      :item-height="itemHeight"
      :visible-item-count="visibleItemCount"
      :virtual="virtual"
      @change="onSelect"
    />
    <slot name="footer" />
  </PickerPopup>
</template>
