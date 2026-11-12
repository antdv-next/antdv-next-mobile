<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import type { SegmentedValue } from '../segmented/interface'
import type {
  DatePickerValue,
  RangePickerEmits,
  RangePickerProps,
  RangePickerRange,
  RangePickerSlots,
  RangePickerValue,
} from './interface'
import { SwapRightOutlined } from '@antdv-next/icons'
import dayjs from 'dayjs'
import { computed, markRaw, reactive, ref, shallowRef, toRef, watch } from 'vue'
import { cls } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import PickerPopup from '../picker/PickerPopup.vue'
import PickerTrigger from '../picker/PickerTrigger.vue'
import { usePickerField } from '../picker/usePickerField'
import Segmented from '../segmented/Segmented.vue'
import DatePickerView from './DatePickerView.vue'
import { createDateContext, formatDate, settleDate, toDayjs, toValue } from './util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmRangePicker', inheritAttrs: false })

const props = withDefaults(defineProps<RangePickerProps>(), {
  picker: 'date',
  showTime: false,
  use12Hours: undefined,
  separator: undefined,
  allowEmpty: false,
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
const emit = defineEmits<RangePickerEmits>()
defineSlots<RangePickerSlots>()

type Side = 0 | 1
type DatePair = [Dayjs | undefined, Dayjs | undefined]
const SIDES: Side[] = [0, 1]
const RANGES: RangePickerRange[] = ['start', 'end']

const locale = useLocale('DatePicker')
const ctx = computed(() => createDateContext(props, locale.value))
const fallbackFormat = computed(() => (typeof ctx.value.format === 'string' ? ctx.value.format : undefined))
const parse = (value: DatePickerValue | null | undefined) => toDayjs(value, props.valueFormat, fallbackFormat.value)

// `disabled` may be a tuple: the field itself is only disabled when both sides are
const fieldProps = reactive({
  open: toRef(props, 'open'),
  defaultOpen: toRef(props, 'defaultOpen'),
  disabled: computed(() => (Array.isArray(props.disabled) ? (props.disabled[0] && props.disabled[1]) || undefined : props.disabled)),
})
const { open, setOpen, disabled, commit } = usePickerField(fieldProps, (value) => {
  emit('update:open', value)
  emit('openChange', value)
})
const sideDisabled = computed<[boolean, boolean]>(() => {
  const [start, end] = Array.isArray(props.disabled) ? props.disabled : [false, false]
  return [disabled.value || !!start, disabled.value || !!end]
})
const allowEmpty = computed<[boolean, boolean]>(() =>
  Array.isArray(props.allowEmpty) ? [!!props.allowEmpty[0], !!props.allowEmpty[1]] : [!!props.allowEmpty, !!props.allowEmpty],
)

const [value, setValue] = useControlled<RangePickerProps, 'value', RangePickerValue | null>(props, 'value', {
  defaultValue: () => props.defaultValue ?? null,
})

const valueDates = computed<DatePair>(() => [parse(value.value?.[0]), parse(value.value?.[1])])
const texts = computed<[string, string]>(() => [formatDate(ctx.value, valueDates.value[0]), formatDate(ctx.value, valueDates.value[1])])
const hasValue = computed(() => !!(valueDates.value[0] || valueDates.value[1]))
const label = computed(() => (hasValue.value ? texts.value.join(' ~ ') : ''))
const placeholders = computed<[string, string]>(() => {
  // the date placeholders of the locale do not fit a time range
  const fallback: [string, string] = props.picker === 'time' ? [locale.value.rangeStart, locale.value.rangeEnd] : locale.value.rangePlaceholder
  return [props.placeholder?.[0] ?? fallback[0], props.placeholder?.[1] ?? fallback[1]]
})

// ---------- popup state ----------
const active = ref<Side>(0)
/** tabs the user has seen since the popup opened */
const visited = ref<[boolean, boolean]>([false, false])
/** dates of the two wheels while the popup is open */
const pending = shallowRef<[Dayjs, Dayjs]>()
/** tab to open on, set by the half of the trigger that was tapped */
let requested: Side | undefined

const earlier = (a?: Dayjs, b?: Dayjs) => (a && b ? (a.isBefore(b) ? a : b) : a ?? b)
const later = (a?: Dayjs, b?: Dayjs) => (a && b ? (a.isAfter(b) ? a : b) : a ?? b)

/** start wheel: capped by a disabled (fixed) end */
const startCtx = computed(() => {
  const fixedEnd = sideDisabled.value[1] ? valueDates.value[1] : undefined
  return fixedEnd
    ? createDateContext({ ...props, maxDate: earlier(fixedEnd, toDayjs(props.maxDate, props.valueFormat)) }, locale.value)
    : ctx.value
})
/** end wheel: its min follows the chosen start */
const endCtx = computed(() => {
  const start = sideDisabled.value[0] ? valueDates.value[0] : pending.value?.[0]
  return start
    ? createDateContext({ ...props, minDate: later(start, toDayjs(props.minDate, props.valueFormat)) }, locale.value)
    : ctx.value
})
const activeCtx = computed(() => (active.value === 0 ? startCtx.value : endCtx.value))

function initPending() {
  const [startValue, endValue] = valueDates.value
  let start = startValue ?? parse(props.defaultPickerValue) ?? dayjs()
  if (!startValue && endValue && start.isAfter(endValue))
    start = endValue
  start = settleDate(startCtx.value, start)
  pending.value = [start, start]
  // endCtx now reads the settled start
  pending.value = [start, settleDate(endCtx.value, endValue ?? start)]
}

function enabledSide(side: Side): Side {
  return sideDisabled.value[side] && !sideDisabled.value[1 - side] ? (1 - side) as Side : side
}

function activate(side: Side) {
  active.value = side
  if (!visited.value[side]) {
    const next: [boolean, boolean] = [...visited.value]
    next[side] = true
    visited.value = next
  }
}

watch(open, (val) => {
  if (val) {
    initPending()
    visited.value = [false, false]
    activate(enabledSide(requested ?? 0))
  }
  requested = undefined
}, { immediate: true })
watch(valueDates, () => {
  if (open.value)
    initPending()
})

/** what a confirm would commit: disabled sides keep their value, untouched `allowEmpty` sides stay empty */
const resolved = computed<[Dayjs | null, Dayjs | null]>(() => {
  const side = (index: Side) => {
    const current = valueDates.value[index] ?? null
    if (sideDisabled.value[index])
      return current
    if (!current && allowEmpty.value[index] && !visited.value[index])
      return null
    return pending.value?.[index] ?? current
  }
  return [side(0), side(1)]
})
const resolvedTexts = computed(() => resolved.value.map(date => formatDate(ctx.value, date ?? undefined)) as [string, string])

const toValues = (dates: [Dayjs | null, Dayjs | null]) => dates.map(date => (date ? toValue(ctx.value, markRaw(date)) : null)) as RangePickerValue
const toStrings = (dates: [Dayjs | null, Dayjs | null]) => dates.map(date => formatDate(ctx.value, date ?? undefined)) as [string, string]

function update(dates: [Dayjs | null, Dayjs | null] | null) {
  const next = dates && (dates[0] || dates[1]) ? toValues(dates) : null
  setValue(next)
  emit('update:value', next)
  emit('change', next, dates ? toStrings(dates) : ['', ''])
  commit()
}

function onSelect(next: DatePickerValue) {
  if (!pending.value)
    return
  const side = active.value
  const date = next as Dayjs
  if (side === 1) {
    pending.value = [pending.value[0], date]
  }
  else {
    // an end that was never chosen follows the start
    const end = !visited.value[1] && !valueDates.value[1] ? date : pending.value[1]
    pending.value = [date, end]
    if (!sideDisabled.value[1])
      pending.value = [date, settleDate(endCtx.value, end)]
  }
  emit('calendarChange', toValues(resolved.value), toStrings(resolved.value), { range: RANGES[side] })
}

function onConfirm() {
  const dates = resolved.value
  const changed = SIDES.some((index) => {
    const prev = valueDates.value[index]
    const next = dates[index]
    return prev && next ? !prev.isSame(next) : !!prev !== !!next
  })
  if (changed)
    update(dates)
  emit('confirm', toValues(dates), toStrings(dates))
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

function toggle(next?: boolean, range?: RangePickerRange) {
  const target = typeof next === 'boolean' ? next : !open.value
  if (target)
    requested = range === 'end' ? 1 : 0
  setOpen(target)
}

function onTriggerClick(event: Event) {
  const half = (event.target as HTMLElement | null)?.closest?.<HTMLElement>('[data-range]')
  toggle(undefined, half?.dataset.range === 'end' ? 'end' : 'start')
}

const tabOptions = computed(() => SIDES.map(side => ({
  value: side,
  label: side === 0 ? locale.value.rangeStart : locale.value.rangeEnd,
  disabled: sideDisabled.value[side],
})))

function onTabChange(side: SegmentedValue) {
  activate(side === 1 ? 1 : 0)
}

const triggerClasses = computed(() => ({ ...props.classes, content: cls('am-range-picker-content', props.classes?.content) }))

defineExpose({ toggle })
</script>

<template>
  <slot
    v-if="$slots.default"
    :open="open"
    :value="value"
    :label="label"
    :labels="texts"
    :disabled="disabled"
    :toggle="toggle"
  />
  <PickerTrigger
    v-else-if="trigger"
    v-bind="$attrs"
    :id="id"
    class="am-range-picker"
    :label="label || placeholders.join(' ~ ')"
    :open="open"
    :disabled="disabled"
    :allow-clear="allowClear && hasValue"
    :status="status"
    :variant="variant"
    :size="size"
    :suffix-icon="suffixIcon"
    :root-class="rootClass"
    :classes="triggerClasses"
    :styles="styles"
    @click="onTriggerClick"
    @clear="onClear"
  >
    <template v-for="side in SIDES" :key="side">
      <span v-if="side === 1" class="am-range-picker-separator">
        <slot name="separator">
          <RenderNode v-if="separator !== undefined" :node="separator" />
          <SwapRightOutlined v-else />
        </slot>
      </span>
      <span
        class="am-range-picker-input"
        :class="{
          'am-range-picker-input-placeholder': !texts[side],
          'am-range-picker-input-active': open && active === side,
          'am-range-picker-input-disabled': sideDisabled[side],
        }"
        :data-range="RANGES[side]"
      >{{ texts[side] || placeholders[side] }}</span>
    </template>
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
    <div class="am-range-picker-tabs">
      <Segmented
        block
        :value="active"
        :options="tabOptions"
        :classes="{ item: 'am-range-picker-tab', label: 'am-range-picker-tab-label' }"
        @change="onTabChange"
      >
        <template #labelRender="option">
          <span class="am-range-picker-tab-title">{{ option.label }}</span>
          <span
            class="am-range-picker-tab-value"
            :class="{ 'am-range-picker-tab-value-empty': !resolvedTexts[option.value as Side] }"
          >{{ resolvedTexts[option.value as Side] || placeholders[option.value as Side] }}</span>
        </template>
      </Segmented>
    </div>
    <slot name="header" />
    <DatePickerView
      v-if="pending"
      :key="active"
      :value="pending[active]"
      :picker="picker"
      :show-time="showTime"
      :format="format"
      :min-date="activeCtx.min"
      :max-date="activeCtx.max"
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
