<script setup lang="ts">
import type { DatePickerColumnType, DatePickerShowTime } from '../date-picker/interface'
import type { PickerOption } from '../picker-view/interface'
import type { TimePickerColumnType, TimePickerEmits, TimePickerProps, TimePickerSlots } from './interface'
import { computed, ref } from 'vue'
import { cls } from '../_util'
import DatePicker from '../date-picker/DatePicker.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmTimePicker', inheritAttrs: false })

const props = withDefaults(defineProps<TimePickerProps>(), {
  use12Hours: undefined,
  showHour: undefined,
  showMinute: undefined,
  showSecond: undefined,
  open: undefined,
  defaultOpen: false,
  disabled: undefined,
  allowClear: false,
  trigger: true,
  suffixIcon: undefined,
  getContainer: undefined,
  maskClosable: true,
  destroyOnHidden: false,
})
const emit = defineEmits<TimePickerEmits>()
defineSlots<TimePickerSlots>()

const pickerRef = ref<{ toggle: (open?: boolean) => void }>()

const defaultFormat = computed(() => {
  const parts = [
    props.showHour !== false && (props.use12Hours ? 'h' : 'HH'),
    props.showMinute !== false && 'mm',
    props.showSecond !== false && 'ss',
  ].filter(Boolean).join(':')
  return props.use12Hours ? `${parts} a` : parts
})

/** DatePicker in `time` mode does the work; `showTime` carries the column switches. */
const showTime = computed<DatePickerShowTime>(() => ({
  showHour: props.showHour,
  showMinute: props.showMinute,
  showSecond: props.showSecond,
}))

const filter = computed(() => {
  const fn = props.filter
  return fn ? (type: DatePickerColumnType, options: PickerOption[]) => fn(type as TimePickerColumnType, options) : undefined
})
const renderLabel = computed(() => {
  const fn = props.renderLabel
  return fn ? (type: DatePickerColumnType, value: number) => fn(type as TimePickerColumnType, value) : undefined
})

defineExpose({ toggle: (open?: boolean) => pickerRef.value?.toggle(open) })
</script>

<template>
  <DatePicker
    v-bind="$attrs"
    :id="id"
    ref="pickerRef"
    class="am-time-picker"
    picker="time"
    :value="value"
    :default-value="defaultValue"
    :value-format="valueFormat"
    :format="format ?? defaultFormat"
    :show-time="showTime"
    :use12-hours="use12Hours"
    :hour-step="hourStep"
    :minute-step="minuteStep"
    :second-step="secondStep"
    :disabled-time="disabledTime"
    :default-picker-value="defaultOpenValue"
    :filter="filter"
    :render-label="renderLabel"
    :item-height="itemHeight"
    :visible-item-count="visibleItemCount"
    :open="open"
    :default-open="defaultOpen"
    :placeholder="placeholder"
    :disabled="disabled"
    :allow-clear="allowClear"
    :status="status"
    :variant="variant"
    :size="size"
    :trigger="trigger"
    :suffix-icon="suffixIcon"
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    :get-container="getContainer"
    :z-index="zIndex"
    :mask-closable="maskClosable"
    :destroy-on-hidden="destroyOnHidden"
    :root-class="cls('am-time-picker-root', rootClass)"
    :classes="classes"
    :styles="styles"
    @update:value="emit('update:value', $event)"
    @update:open="emit('update:open', $event)"
    @open-change="emit('openChange', $event)"
    @change="(time, timeString) => emit('change', time, timeString)"
    @select="(time, timeString) => emit('select', time, timeString)"
    @confirm="(time, timeString) => emit('confirm', time, timeString)"
    @cancel="emit('cancel')"
    @clear="emit('clear')"
  >
    <template v-if="$slots.default" #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.suffixIcon" #suffixIcon>
      <slot name="suffixIcon" />
    </template>
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </DatePicker>
</template>
