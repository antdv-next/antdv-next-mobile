<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import type {
  CalendarDate,
  CalendarDay,
  CalendarDayType,
  CalendarEmits,
  CalendarProps,
  CalendarSlots,
  CalendarValue,
} from './interface'
import dayjs from 'dayjs'
import { computed, markRaw, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useAttrs, watch } from 'vue'
import { cls, toArray } from '../_util'
import { useControlled, useVirtualRange } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import Button from '../button/Button.vue'
import { useConfig } from '../config-provider/context'
import { toDayjs } from '../date-picker/util'
import { useLocale } from '../locale'
import PickerTrigger from '../picker/PickerTrigger.vue'
import { usePickerField } from '../picker/usePickerField'
import Popup from '../popup/Popup.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCalendar', inheritAttrs: false })

const props = withDefaults(defineProps<CalendarProps>(), {
  selectionMode: 'single',
  showRangePrompt: true,
  allowSameDay: false,
  weekStartsOn: 0,
  title: undefined,
  showTitle: true,
  showMark: true,
  showConfirm: true,
  rowHeight: 64,
  cellRender: undefined,
  poppable: true,
  open: undefined,
  defaultOpen: false,
  trigger: false,
  format: 'YYYY-MM-DD',
  disabled: undefined,
  allowClear: false,
  suffixIcon: undefined,
  getContainer: undefined,
  maskClosable: true,
  closable: true,
  destroyOnHidden: false,
  virtual: true,
})
const emit = defineEmits<CalendarEmits>()
const slots = defineSlots<CalendarSlots>()

/** must match `.am-calendar-month-title` height: month offsets are computed, not measured */
const MONTH_TITLE_HEIGHT = 44
/** used until the body is measured (and in non-browser environments) */
const FALLBACK_VIEW_HEIGHT = 480

const attrs = useAttrs()
const locale = useLocale('Calendar')
const config = useConfig()
const today = dayjs().startOf('day')

const { open, setOpen, toggle, disabled, commit } = usePickerField(props, (value) => {
  emit('update:open', value)
  emit('openChange', value)
})

// ---------- value ----------
const parse = (value: CalendarDate | Date | null | undefined) => toDayjs(value, props.valueFormat)?.startOf('day')
const parseList = (value: CalendarValue | null | undefined) => toArray(value).map(item => parse(item)).filter((item): item is Dayjs => !!item)

const [value, setValue] = useControlled<CalendarProps, 'value', CalendarValue | null>(props, 'value', {
  defaultValue: () => props.defaultValue ?? null,
})
const valueDates = computed(() => parseList(value.value))

/** selection being edited, committed on confirm */
const pending = shallowRef<Dayjs[]>(valueDates.value)
watch(valueDates, (dates) => {
  pending.value = dates
})

const isComplete = (dates: Dayjs[]) => (props.selectionMode === 'range' ? dates.length === 2 : dates.length > 0)
const canConfirm = computed(() => isComplete(pending.value))

function toOutput(dates: Dayjs[]): CalendarValue | null {
  const convert = (date: Dayjs) => (props.valueFormat ? date.format(props.valueFormat) : markRaw(date))
  if (props.selectionMode === 'single')
    return dates[0] ? convert(dates[0]) : null
  return dates.map(convert)
}

const formatDay = (date: Dayjs) => (typeof props.format === 'function' ? props.format(date) : date.format(props.format))
const separator = computed(() => (config.locale.value.locale.startsWith('zh') ? '、' : ', '))
const label = computed(() => {
  const texts = valueDates.value.map(formatDay)
  return texts.join(props.selectionMode === 'range' ? ' ~ ' : separator.value)
})

// ---------- months (heights are computed, not measured, so only the visible months are rendered) ----------
const minDate = computed(() => parse(props.minDate) ?? today)
const maxDate = computed(() => {
  const max = parse(props.maxDate) ?? today.add(6, 'month')
  return max.isBefore(minDate.value) ? minDate.value : max
})

interface MonthMeta {
  key: string
  date: Dayjs
  title: string
  /** empty cells before the 1st */
  offset: number
  height: number
}

const months = computed<MonthMeta[]>(() => {
  const list: MonthMeta[] = []
  const last = maxDate.value.startOf('month')
  let cursor = minDate.value.startOf('month')
  while (!cursor.isAfter(last)) {
    const offset = (cursor.day() - props.weekStartsOn + 7) % 7
    const height = MONTH_TITLE_HEIGHT + Math.ceil((offset + cursor.daysInMonth()) / 7) * props.rowHeight
    list.push({ key: cursor.format('YYYY-MM'), date: cursor, title: cursor.format(locale.value.monthFormat), offset, height })
    cursor = cursor.add(1, 'month')
  }
  return list
})
const bodyRef = ref<HTMLElement>()
const scrollTop = ref(0)
const viewHeight = ref(FALLBACK_VIEW_HEIGHT)

/** half a viewport is kept rendered before and after the visible months */
const windowStart = computed(() => Math.max(scrollTop.value - viewHeight.value / 2, 0))

const range = useVirtualRange({
  count: () => months.value.length,
  size: () => {
    const list = months.value
    return (index: number) => list[index].height
  },
  scrollOffset: () => windowStart.value,
  viewportSize: () => scrollTop.value + viewHeight.value * 1.5 - windowStart.value,
  overscan: () => 0,
  enabled: () => props.virtual,
})

// ---------- days ----------
const stamps = computed(() => pending.value.map(date => date.valueOf()))

function isDisabledDate(date: Dayjs) {
  return date.isBefore(minDate.value) || date.isAfter(maxDate.value) || !!props.disabledDate?.(date)
}

function getDayType(date: Dayjs): CalendarDayType {
  if (isDisabledDate(date))
    return 'disabled'
  const stamp = date.valueOf()
  const selected = stamps.value
  if (props.selectionMode !== 'range')
    return selected.includes(stamp) ? 'selected' : ''
  const [start, end] = selected
  if (start === undefined)
    return ''
  if (end === undefined)
    return stamp === start ? 'start' : ''
  if (stamp === start)
    return start === end ? 'start-end' : 'start'
  if (stamp === end)
    return 'end'
  return stamp > start && stamp < end ? 'middle' : ''
}

function createDay(date: Dayjs): CalendarDay {
  const type = getDayType(date)
  const isToday = date.isSame(today)
  const texts = locale.value
  const bottomInfo = type === 'start' ? texts.start : type === 'end' ? texts.end : type === 'start-end' ? texts.startEnd : undefined
  const day: CalendarDay = { date, type, text: date.date(), topInfo: isToday ? texts.today : undefined, bottomInfo, isToday }
  return props.formatter ? props.formatter(day) : day
}

const visibleMonths = computed(() => {
  return months.value.slice(range.start.value, range.end.value).map(month => ({
    ...month,
    days: Array.from({ length: month.date.daysInMonth() }, (_, index) => createDay(month.date.date(index + 1))),
  }))
})
const weekdays = computed(() => {
  const names = locale.value.weekdays
  return names.map((_, index) => names[(index + props.weekStartsOn) % 7])
})

// ---------- month show ----------
const shown = new Set<string>()
watch(
  () => (props.poppable && !open.value ? [] : visibleMonths.value.map(month => month.key)),
  (keys) => {
    keys.forEach((key) => {
      if (!shown.has(key)) {
        const month = months.value.find(item => item.key === key)!
        emit('monthShow', { date: month.date, title: month.title })
      }
    })
    shown.clear()
    keys.forEach(key => shown.add(key))
  },
  { immediate: true },
)

// ---------- scrolling ----------
function onScroll() {
  if (bodyRef.value)
    scrollTop.value = bodyRef.value.scrollTop
}

function measure() {
  viewHeight.value = bodyRef.value?.clientHeight || FALLBACK_VIEW_HEIGHT
}

function scrollToDate(target: CalendarDate) {
  const date = parse(target)
  if (!date)
    return
  const key = date.format('YYYY-MM')
  let index = months.value.findIndex(item => item.key === key)
  if (index < 0)
    index = date.isBefore(minDate.value) ? 0 : months.value.length - 1
  const month = months.value[index]
  if (!month)
    return
  const monthTop = range.offsetOf(index)
  // keep the row of the day in view for long months
  const row = month.key === key ? Math.floor((month.offset + date.date() - 1) / 7) : 0
  const top = row > 2 ? monthTop + MONTH_TITLE_HEIGHT + (row - 1) * props.rowHeight : monthTop
  scrollTop.value = top
  if (bodyRef.value)
    bodyRef.value.scrollTop = top
}

function scrollToCurrent() {
  measure()
  // selection first, then today; when today is out of range start from the first month
  const target = pending.value[0] ?? (today.isBefore(minDate.value) || today.isAfter(maxDate.value) ? minDate.value : today)
  scrollToDate(target)
}

function reset(date?: CalendarValue | null) {
  pending.value = date === undefined ? valueDates.value : parseList(date)
  nextTick(scrollToCurrent)
}

watch(open, (val) => {
  if (val && props.poppable) {
    pending.value = valueDates.value
    nextTick(scrollToCurrent)
  }
})
onMounted(() => {
  if (!props.poppable || open.value)
    scrollToCurrent()
})

// ---------- tip ----------
const tip = ref('')
let tipTimer: ReturnType<typeof setTimeout> | undefined
function promptOverRange() {
  emit('overRange')
  if (!props.showRangePrompt || !props.maxRange)
    return
  tip.value = props.rangePrompt ?? locale.value.rangePrompt(props.maxRange)
  clearTimeout(tipTimer)
  tipTimer = setTimeout(() => {
    tip.value = ''
  }, 2000)
}
onBeforeUnmount(() => clearTimeout(tipTimer))

// ---------- selection ----------
function update(dates: Dayjs[]) {
  const next = toOutput(dates)
  setValue(next)
  emit('update:value', next)
  const texts = dates.map(formatDay)
  emit('change', next, props.selectionMode === 'single' ? texts[0] ?? '' : texts)
  commit()
}

function onConfirm() {
  if (!canConfirm.value)
    return
  const dates = pending.value
  const current = valueDates.value
  if (dates.length !== current.length || dates.some((date, index) => !date.isSame(current[index])))
    update(dates)
  emit('confirm', toOutput(dates))
  if (props.poppable)
    setOpen(false)
}

function select(dates: Dayjs[]) {
  pending.value = dates
  emit('select', toOutput(dates))
  if (!props.showConfirm && isComplete(dates))
    onConfirm()
}

function onDayClick(day: CalendarDay) {
  if (disabled.value || day.type === 'disabled')
    return
  const { date } = day
  const current = pending.value

  if (props.selectionMode === 'single') {
    select([date])
    return
  }

  if (props.selectionMode === 'multiple') {
    const index = current.findIndex(item => item.isSame(date))
    if (index >= 0) {
      select(current.filter((_, i) => i !== index))
    }
    else if (props.maxRange && current.length >= props.maxRange) {
      promptOverRange()
    }
    else {
      select([...current, date].sort((a, b) => a.valueOf() - b.valueOf()))
    }
    return
  }

  const [start, end] = current
  if (!start || end || date.isBefore(start)) {
    select([date])
    return
  }
  if (date.isSame(start)) {
    if (props.allowSameDay)
      select([date, date])
    return
  }
  // a range never crosses a disabled day
  let last = date
  for (let cursor = start.add(1, 'day'); cursor.isBefore(date); cursor = cursor.add(1, 'day')) {
    if (isDisabledDate(cursor)) {
      last = cursor.subtract(1, 'day')
      break
    }
  }
  if (props.maxRange && last.diff(start, 'day') + 1 > props.maxRange) {
    last = start.add(props.maxRange - 1, 'day')
    promptOverRange()
  }
  if (last.isSame(start) && !props.allowSameDay)
    return
  select([start, last])
}

function onCancel() {
  emit('cancel')
  setOpen(false)
}

function onClear() {
  pending.value = []
  update([])
  emit('clear')
}

// ---------- structure ----------
const builtinTrigger = computed(() => props.poppable && !slots.default && props.trigger)
const panelAttrs = computed(() => (builtinTrigger.value ? undefined : attrs))

const wrapperProps = computed(() => {
  if (!props.poppable)
    return undefined
  return {
    open: open.value,
    placement: 'bottom' as const,
    round: true,
    closable: props.closable,
    getContainer: props.getContainer,
    zIndex: props.zIndex,
    maskClosable: props.maskClosable,
    destroyOnHidden: props.destroyOnHidden,
    rootClass: cls('am-calendar-popup-root', props.rootClass),
    classes: { body: cls('am-calendar-popup', props.classes?.popup) },
    styles: { body: props.styles?.popup },
    onClose: onCancel,
  }
})

defineExpose({ scrollToDate, reset, toggle })
</script>

<template>
  <slot v-if="poppable && $slots.default" :open="open" :value="value" :label="label" :disabled="disabled" :toggle="toggle" />
  <PickerTrigger
    v-else-if="builtinTrigger"
    v-bind="$attrs"
    :id="id"
    class="am-calendar-trigger"
    :label="label"
    :placeholder="placeholder ?? locale.title"
    :open="open"
    :disabled="disabled"
    :allow-clear="allowClear"
    :status="status"
    :variant="variant"
    :size="size"
    :suffix-icon="suffixIcon"
    :root-class="rootClass"
    :classes="{ root: classes?.trigger }"
    :styles="{ root: styles?.trigger }"
    @click="toggle()"
    @clear="onClear"
  >
    <template v-if="$slots.suffixIcon" #suffixIcon>
      <slot name="suffixIcon" />
    </template>
  </PickerTrigger>
  <component :is="poppable ? Popup : 'div'" v-bind="wrapperProps" :class="poppable ? undefined : 'am-calendar-inline'">
    <div
      v-bind="panelAttrs"
      class="am-calendar"
      :class="[
        `am-calendar-${selectionMode}`,
        { 'am-calendar-disabled': disabled },
        poppable ? undefined : rootClass,
        classes?.root,
      ]"
      :style="[{ '--am-calendar-row-height': `${rowHeight}px` }, styles?.root]"
    >
      <div class="am-calendar-header" :class="classes?.header" :style="styles?.header">
        <div v-if="showTitle" class="am-calendar-title">
          <slot name="title">
            <RenderNode v-if="title !== undefined" :node="title" />
            <template v-else>
              {{ locale.title }}
            </template>
          </slot>
        </div>
        <div class="am-calendar-weekdays" role="row">
          <span v-for="name in weekdays" :key="name" class="am-calendar-weekday" role="columnheader">{{ name }}</span>
        </div>
      </div>
      <div ref="bodyRef" class="am-calendar-body" :class="classes?.body" :style="styles?.body" role="grid" @scroll.passive="onScroll">
        <div class="am-calendar-spacer" :style="{ height: `${range.offsetBefore.value}px` }" />
        <div
          v-for="month in visibleMonths"
          :key="month.key"
          class="am-calendar-month"
          :class="classes?.month"
          :style="[{ height: `${month.height}px` }, styles?.month]"
          :data-month="month.key"
        >
          <div class="am-calendar-month-title">
            {{ month.title }}
          </div>
          <div class="am-calendar-days" role="rowgroup">
            <div v-if="showMark" class="am-calendar-month-mark" aria-hidden="true">
              {{ month.date.month() + 1 }}
            </div>
            <div
              v-for="(day, index) in month.days"
              :key="index"
              class="am-calendar-day"
              :class="[
                day.type ? `am-calendar-day-${day.type}` : undefined,
                { 'am-calendar-day-today': day.isToday },
                day.className,
                classes?.day,
              ]"
              :style="[index === 0 && month.offset ? { marginInlineStart: `${(100 * month.offset) / 7}%` } : undefined, styles?.day]"
              role="gridcell"
              :aria-disabled="day.type === 'disabled' || undefined"
              :aria-selected="!!day.type && day.type !== 'disabled'"
              @click="onDayClick(day)"
            >
              <div class="am-calendar-day-inner">
                <slot name="cellRender" :date="day.date" :day="day">
                  <RenderNode v-if="cellRender !== undefined" :node="cellRender" :params="{ date: day.date, day }" />
                  <template v-else>
                    <span v-if="day.topInfo" class="am-calendar-day-top">{{ day.topInfo }}</span>
                    <span class="am-calendar-day-text">{{ day.text }}</span>
                    <span v-if="day.bottomInfo" class="am-calendar-day-bottom">{{ day.bottomInfo }}</span>
                  </template>
                </slot>
              </div>
            </div>
          </div>
        </div>
        <div class="am-calendar-spacer" :style="{ height: `${range.offsetAfter.value}px` }" />
      </div>
      <Transition name="am-fade">
        <div v-if="tip" class="am-calendar-tip" role="alert">
          {{ tip }}
        </div>
      </Transition>
      <div v-if="showConfirm || $slots.footer" class="am-calendar-footer" :class="classes?.footer" :style="styles?.footer">
        <slot name="footer" :confirm="onConfirm" :disabled="!canConfirm">
          <Button type="primary" block shape="round" :disabled="!canConfirm || disabled" class="am-calendar-confirm" @click="onConfirm">
            {{ okText ?? locale.confirm }}
          </Button>
        </slot>
      </div>
    </div>
  </component>
</template>
