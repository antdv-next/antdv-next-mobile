import type { Dayjs } from 'dayjs'
import type { Locale } from '../locale/interface'
import type { PickerOption } from '../picker-view/interface'
import type {
  DatePickerBaseProps,
  DatePickerColumnType,
  DatePickerMode,
  DatePickerShowTime,
  DatePickerValue,
} from './interface'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { padZero } from '../_util'

// Same plugins the PC date components rely on: string values in `valueFormat`, `Q` / `WW` format tokens.
dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(isoWeek)
dayjs.extend(quarterOfYear)

export interface DateContext {
  picker: DatePickerMode
  types: DatePickerColumnType[]
  /** undefined: unbounded (time-only pickers) */
  min?: Dayjs
  max?: Dayjs
  use12Hours: boolean
  hourStep: number
  minuteStep: number
  secondStep: number
  /** display format */
  format: string | ((value: Dayjs) => string)
  valueFormat?: string
  disabledDate?: DatePickerBaseProps['disabledDate']
  disabledTime?: DatePickerBaseProps['disabledTime']
  filter?: DatePickerBaseProps['filter']
  renderLabel?: DatePickerBaseProps['renderLabel']
  locale: Locale['DatePicker']
}

const DEFAULT_TIME_FORMAT = 'HH:mm:ss'
const DEFAULT_FORMATS: Record<Exclude<DatePickerMode, 'time'>, string> = {
  date: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY',
  quarter: 'YYYY-[Q]Q',
  week: 'GGGG-[W]WW',
}

/** Parses a bound value: dayjs objects pass through, strings are read with `valueFormat` (then `fallbackFormat`). */
export function toDayjs(value: DatePickerValue | Date | number | null | undefined, valueFormat?: string, fallbackFormat?: string): Dayjs | undefined {
  if (value === undefined || value === null || value === '')
    return undefined
  if (dayjs.isDayjs(value))
    return value.isValid() ? value : undefined
  if (typeof value === 'string') {
    if (valueFormat) {
      const parsed = dayjs(value, valueFormat)
      if (parsed.isValid())
        return parsed
    }
    const loose = dayjs(value)
    if (loose.isValid())
      return loose
    if (fallbackFormat) {
      const parsed = dayjs(value, fallbackFormat)
      if (parsed.isValid())
        return parsed
    }
    return undefined
  }
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed : undefined
}

function getTimeTypes(format: string, config: DatePickerShowTime, use12Hours: boolean): DatePickerColumnType[] {
  // ignore escaped text such as `[at]`
  const tokens = format.replace(/\[[^\]]*\]/g, '')
  const types: DatePickerColumnType[] = []
  if (/h/i.test(tokens) && config.showHour !== false)
    types.push('hour')
  if (tokens.includes('m') && config.showMinute !== false)
    types.push('minute')
  if (tokens.includes('s') && config.showSecond !== false)
    types.push('second')
  if (use12Hours && types.includes('hour'))
    types.push('meridiem')
  return types
}

export function createDateContext(props: DatePickerBaseProps, locale: Locale['DatePicker'], now: Dayjs = dayjs()): DateContext {
  const picker = props.picker ?? 'date'
  const showTime: DatePickerShowTime | undefined = picker === 'time' || (picker === 'date' && props.showTime)
    ? (typeof props.showTime === 'object' ? props.showTime : {})
    : undefined

  let types: DatePickerColumnType[] = []
  let format: DateContext['format'] = props.format ?? ''
  let use12Hours = false

  if (showTime) {
    const explicit12 = showTime.use12Hours ?? props.use12Hours
    let timeFormat = showTime.format
    if (!timeFormat && picker === 'time' && typeof props.format === 'string')
      timeFormat = props.format
    const tokens = (timeFormat ?? '').replace(/\[[^\]]*\]/g, '')
    use12Hours = explicit12 ?? (tokens.includes('h') || /a/i.test(tokens))
    if (!timeFormat)
      timeFormat = use12Hours ? 'h:mm:ss a' : DEFAULT_TIME_FORMAT
    types = getTimeTypes(timeFormat, showTime, use12Hours)
    if (!props.format)
      format = picker === 'time' ? timeFormat : `${DEFAULT_FORMATS.date} ${timeFormat}`
  }

  if (picker !== 'time') {
    const dateTypes: Record<Exclude<DatePickerMode, 'time'>, DatePickerColumnType[]> = {
      date: ['year', 'month', 'day'],
      month: ['year', 'month'],
      year: ['year'],
      quarter: ['year', 'quarter'],
      week: ['year', 'week'],
    }
    types = [...dateTypes[picker], ...types]
    if (!format)
      format = DEFAULT_FORMATS[picker]
  }

  const bounded = picker !== 'time'
  let min = toDayjs(props.minDate, props.valueFormat) ?? (bounded ? now.subtract(10, 'year').startOf('year') : undefined)
  let max = toDayjs(props.maxDate, props.valueFormat) ?? (bounded ? now.add(10, 'year').endOf('year') : undefined)
  if (min && max && min.isAfter(max))
    [min, max] = [max, min]

  return {
    picker,
    types,
    min,
    max,
    use12Hours,
    hourStep: Math.max(showTime?.hourStep ?? props.hourStep ?? 1, 1),
    minuteStep: Math.max(showTime?.minuteStep ?? props.minuteStep ?? 1, 1),
    secondStep: Math.max(showTime?.secondStep ?? props.secondStep ?? 1, 1),
    format,
    valueFormat: props.valueFormat,
    disabledDate: props.disabledDate,
    disabledTime: props.disabledTime,
    filter: props.filter,
    renderLabel: props.renderLabel,
    locale,
  }
}

export function formatDate(ctx: DateContext, date: Dayjs | undefined): string {
  if (!date)
    return ''
  return typeof ctx.format === 'function' ? ctx.format(date) : date.format(ctx.format)
}

/** dayjs -> bound value (`valueFormat` string or dayjs) */
export function toValue(ctx: DateContext, date: Dayjs): DatePickerValue {
  return ctx.valueFormat ? date.format(ctx.valueFormat) : date
}

export function clampDate(date: Dayjs, min?: Dayjs, max?: Dayjs) {
  if (min && date.isBefore(min))
    return min
  if (max && date.isAfter(max))
    return max
  return date
}

function range(from: number, to: number, step = 1) {
  const list: number[] = []
  // steps are aligned to multiples of `step`, like the PC time panel
  for (let value = Math.ceil(from / step) * step; value <= to; value += step)
    list.push(value)
  return list
}

/** ISO weeks of a year: Dec 28th is always in the last week */
const isoWeeksInYear = (year: number) => dayjs(new Date(year, 11, 28)).isoWeek()
/** Monday of an ISO week: Jan 4th is always in week 1 */
const isoWeekStart = (year: number, week: number) => dayjs(new Date(year, 0, 4)).startOf('isoWeek').add(week - 1, 'week')

const yearOf = (ctx: DateContext, date: Dayjs) => (ctx.picker === 'week' ? date.isoWeekYear() : date.year())
const toHour12 = (hour: number) => hour % 12 || 12

function defaultLabel(ctx: DateContext, type: DatePickerColumnType, value: number): string {
  const { locale } = ctx
  if (type === 'meridiem')
    return value ? locale.pm : locale.am
  const unit = locale[type]
  const text = type === 'hour' || type === 'minute' || type === 'second' ? padZero(value) : String(value)
  // single latin letter units are prefixes (`Q1`, `W32`), everything else is a suffix (`1季度`, `2024年`)
  return /^[a-z]$/i.test(unit) ? `${unit}${text}` : `${text}${unit}`
}

function getColumn(ctx: DateContext, type: DatePickerColumnType, date: Dayjs): PickerOption[] {
  const { min, max, picker } = ctx
  const year = yearOf(ctx, date)
  const same = (bound: Dayjs | undefined, unit: 'year' | 'month' | 'day' | 'hour' | 'minute') => !!bound && date.isSame(bound, unit)
  const disabledTimes = (type === 'hour' || type === 'minute' || type === 'second') ? ctx.disabledTime?.(date) : undefined
  let values: number[] = []
  let isDisabled: ((value: number) => boolean) | undefined

  switch (type) {
    case 'year':
      values = range(min ? yearOf(ctx, min) : year - 10, max ? yearOf(ctx, max) : year + 10)
      if (picker === 'year' && ctx.disabledDate)
        isDisabled = value => ctx.disabledDate!(date.year(value), { type: picker })
      break
    case 'quarter':
      values = range(same(min, 'year') ? min!.quarter() : 1, same(max, 'year') ? max!.quarter() : 4)
      if (ctx.disabledDate)
        isDisabled = value => ctx.disabledDate!(date.month((value - 1) * 3).startOf('month'), { type: picker })
      break
    case 'month':
      values = range(same(min, 'year') ? min!.month() + 1 : 1, same(max, 'year') ? max!.month() + 1 : 12)
      if (picker === 'month' && ctx.disabledDate)
        isDisabled = value => ctx.disabledDate!(date.date(1).month(value - 1), { type: picker })
      break
    case 'week':
      values = range(
        min && min.isoWeekYear() === year ? min.isoWeek() : 1,
        max && max.isoWeekYear() === year ? max.isoWeek() : isoWeeksInYear(year),
      )
      if (ctx.disabledDate)
        isDisabled = value => ctx.disabledDate!(isoWeekStart(year, value), { type: picker })
      break
    case 'day':
      values = range(same(min, 'month') ? min!.date() : 1, same(max, 'month') ? max!.date() : date.daysInMonth())
      if (ctx.disabledDate)
        isDisabled = value => ctx.disabledDate!(date.date(value), { type: picker })
      break
    case 'hour': {
      let hours = range(same(min, 'day') ? min!.hour() : 0, same(max, 'day') ? max!.hour() : 23, ctx.hourStep)
      const disabledHours = disabledTimes?.disabledHours?.() ?? []
      if (ctx.use12Hours) {
        const pm = date.hour() >= 12
        hours = hours.filter(hour => (hour >= 12) === pm)
        isDisabled = value => disabledHours.includes((value % 12) + (pm ? 12 : 0))
        values = hours.map(toHour12)
      }
      else {
        isDisabled = value => disabledHours.includes(value)
        values = hours
      }
      break
    }
    case 'minute': {
      values = range(same(min, 'hour') ? min!.minute() : 0, same(max, 'hour') ? max!.minute() : 59, ctx.minuteStep)
      const disabledMinutes = disabledTimes?.disabledMinutes?.(date.hour()) ?? []
      isDisabled = value => disabledMinutes.includes(value)
      break
    }
    case 'second': {
      values = range(same(min, 'minute') ? min!.second() : 0, same(max, 'minute') ? max!.second() : 59, ctx.secondStep)
      const disabledSeconds = disabledTimes?.disabledSeconds?.(date.hour(), date.minute()) ?? []
      isDisabled = value => disabledSeconds.includes(value)
      break
    }
    case 'meridiem':
      values = [0, 1].filter(value => !(value === 0 && same(min, 'day') && min!.hour() >= 12) && !(value === 1 && same(max, 'day') && max!.hour() < 12))
      break
  }

  const options: PickerOption[] = values.map(value => ({
    label: ctx.renderLabel ? ctx.renderLabel(type, value) : defaultLabel(ctx, type, value),
    value,
    disabled: isDisabled?.(value) || undefined,
  }))
  return ctx.filter ? ctx.filter(type, options) : options
}

export function generateColumns(ctx: DateContext, date: Dayjs): PickerOption[][] {
  return ctx.types.map(type => getColumn(ctx, type, date))
}

function getValue(ctx: DateContext, type: DatePickerColumnType, date: Dayjs): number {
  switch (type) {
    case 'year': return yearOf(ctx, date)
    case 'quarter': return date.quarter()
    case 'month': return date.month() + 1
    case 'week': return date.isoWeek()
    case 'day': return date.date()
    case 'hour': return ctx.use12Hours ? toHour12(date.hour()) : date.hour()
    case 'minute': return date.minute()
    case 'second': return date.second()
    default: return date.hour() >= 12 ? 1 : 0
  }
}

export function dateToValues(ctx: DateContext, date: Dayjs): number[] {
  return ctx.types.map(type => getValue(ctx, type, date))
}

/** Applies wheel values on top of `base`, keeping the result a real date (e.g. Jan 31 -> Feb 29). */
export function valuesToDate(ctx: DateContext, values: (number | string | undefined)[], base: Dayjs): Dayjs {
  const get = (type: DatePickerColumnType) => {
    const index = ctx.types.indexOf(type)
    const value = index < 0 ? undefined : values[index]
    return value === undefined ? undefined : Number(value)
  }
  let date = base
  const year = get('year') ?? yearOf(ctx, date)

  if (ctx.picker === 'week') {
    const week = Math.min(get('week') ?? date.isoWeek(), isoWeeksInYear(year))
    return isoWeekStart(year, week)
  }
  if (ctx.picker !== 'time') {
    const quarter = get('quarter')
    const month = quarter !== undefined ? (quarter - 1) * 3 : (get('month') ?? date.month() + 1) - 1
    const first = date.date(1).year(year).month(month)
    date = first.date(Math.min(get('day') ?? date.date(), first.daysInMonth()))
    if (ctx.picker === 'year')
      date = date.startOf('year')
    else if (ctx.picker === 'month' || ctx.picker === 'quarter')
      date = date.startOf('month')
  }

  const hour = get('hour')
  if (hour !== undefined) {
    if (ctx.use12Hours) {
      const meridiem = get('meridiem') ?? (date.hour() >= 12 ? 1 : 0)
      date = date.hour((hour % 12) + meridiem * 12)
    }
    else {
      date = date.hour(hour)
    }
    const minute = get('minute')
    const second = get('second')
    // columns that are not shown are zeroed so `HH:mm` never commits stray seconds
    date = date.minute(minute ?? (ctx.types.includes('minute') ? date.minute() : 0))
      .second(second ?? (ctx.types.includes('second') ? date.second() : 0))
      .millisecond(0)
  }
  return date
}

/**
 * Makes `date` selectable: clamps it into `[min, max]`, then walks the columns from coarse to fine and
 * snaps every value that is missing (steps, filters, bounds) or disabled to the nearest enabled option.
 */
export function settleDate(ctx: DateContext, input: Dayjs): Dayjs {
  let date = clampDate(input, ctx.min, ctx.max)
  for (let index = 0; index < ctx.types.length; index++) {
    const column = getColumn(ctx, ctx.types[index], date)
    const values = dateToValues(ctx, date)
    const current = values[index]
    const hit = column.find(option => option.value === current)
    if (hit && !hit.disabled)
      continue
    const enabled = column.filter(option => !option.disabled)
    if (!enabled.length)
      continue
    const nearest = enabled.reduce((best, option) =>
      Math.abs(Number(option.value) - current) < Math.abs(Number(best.value) - current) ? option : best)
    values[index] = Number(nearest.value)
    date = clampDate(valuesToDate(ctx, values, date), ctx.min, ctx.max)
  }
  return date
}
