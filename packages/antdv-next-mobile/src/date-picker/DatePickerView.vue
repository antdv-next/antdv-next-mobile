<script setup lang="ts">
import type { PickerValue } from '../picker-view/interface'
import type { DatePickerValue, DatePickerViewEmits, DatePickerViewProps } from './interface'
import dayjs from 'dayjs'
import { computed, markRaw } from 'vue'
import { useControlled } from '../_util/hooks'
import { useLocale } from '../locale'
import PickerView from '../picker-view/PickerView.vue'
import { createDateContext, dateToValues, formatDate, generateColumns, settleDate, toDayjs, toValue, valuesToDate } from './util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmDatePickerView', inheritAttrs: false })

const props = withDefaults(defineProps<DatePickerViewProps>(), {
  picker: 'date',
  showTime: false,
  use12Hours: undefined,
  virtual: true,
})
const emit = defineEmits<DatePickerViewEmits>()

const locale = useLocale('DatePicker')
const now = dayjs()
const ctx = computed(() => createDateContext(props, locale.value, now))

const [innerValue, setInnerValue] = useControlled<DatePickerViewProps, 'value', DatePickerValue | null>(props, 'value', {
  defaultValue: () => props.defaultValue ?? null,
})

const fallbackFormat = computed(() => (typeof ctx.value.format === 'string' ? ctx.value.format : undefined))
/** the date shown by the wheels, always selectable */
const current = computed(() => settleDate(
  ctx.value,
  toDayjs(innerValue.value, props.valueFormat, fallbackFormat.value) ?? toDayjs(props.defaultPickerValue, props.valueFormat, fallbackFormat.value) ?? now,
))
const columns = computed(() => generateColumns(ctx.value, current.value))
const pickerValue = computed(() => dateToValues(ctx.value, current.value))

function onChange(values: PickerValue[]) {
  const date = markRaw(settleDate(ctx.value, valuesToDate(ctx.value, values, current.value)))
  const value = toValue(ctx.value, date)
  setInnerValue(value)
  emit('update:value', value)
  emit('change', value, formatDate(ctx.value, date))
}
</script>

<template>
  <PickerView
    v-bind="$attrs"
    class="am-date-picker-view"
    :columns="columns"
    :value="pickerValue"
    :item-height="itemHeight"
    :visible-item-count="visibleItemCount"
    :virtual="virtual"
    :root-class="rootClass"
    :classes="classes"
    :styles="styles"
    @change="onChange"
  />
</template>
