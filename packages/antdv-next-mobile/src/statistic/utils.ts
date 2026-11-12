import type { StatisticFormatConfig, StatisticTimeData, StatisticValueType } from './interface'

export interface FormattedNumber {
  /** `false` when the value is not a plain number and is rendered as is */
  isNumber: boolean
  int: string
  decimal: string
}

/** Same algorithm as antdv-next `Statistic` (`Number.tsx`). */
export function formatNumber(value: StatisticValueType, config: StatisticFormatConfig): FormattedNumber {
  const { groupSeparator = ',', decimalSeparator = '.', precision } = config
  const val = String(value)
  const cells = val.match(/^(-?)(\d*)(\.(\d+))?$/)
  if (!cells || val === '-')
    return { isNumber: false, int: val, decimal: '' }

  const negative = cells[1]
  let int = cells[2] || '0'
  let decimal = cells[4] || ''
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator)
  if (typeof precision === 'number')
    decimal = decimal.padEnd(precision, '0').slice(0, precision > 0 ? precision : 0)
  if (decimal)
    decimal = `${decimalSeparator}${decimal}`
  return { isNumber: true, int: `${negative}${int}`, decimal }
}

const timeUnits: [string, number][] = [
  ['Y', 1000 * 60 * 60 * 24 * 365],
  ['M', 1000 * 60 * 60 * 24 * 30],
  ['D', 1000 * 60 * 60 * 24],
  ['H', 1000 * 60 * 60],
  ['m', 1000 * 60],
  ['s', 1000],
  ['S', 1],
]

/** `formatTimeStr(90061001, 'D 天 HH:mm:ss.SSS')` -> `1 天 01:01:01.001`; text inside `[]` is escaped. */
export function formatTimeStr(duration: number, format: string) {
  let leftDuration = duration
  const escapeRegex = /\[[^\]]*\]/g
  const keepList = (format.match(escapeRegex) || []).map(str => str.slice(1, -1))
  const templateText = format.replace(escapeRegex, '[]')

  const replacedText = timeUnits.reduce((current, [name, unit]) => {
    if (current.includes(name)) {
      const value = Math.floor(leftDuration / unit)
      leftDuration -= value * unit
      return current.replace(new RegExp(`${name}+`, 'g'), match => value.toString().padStart(match.length, '0'))
    }
    return current
  }, templateText)

  let index = 0
  return replacedText.replace(escapeRegex, () => keepList[index++] ?? '')
}

export function parseTime(duration: number): StatisticTimeData {
  const DAY = 24 * 60 * 60 * 1000
  return {
    days: Math.floor(duration / DAY),
    hours: Math.floor((duration % DAY) / (60 * 60 * 1000)),
    minutes: Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000)),
    seconds: Math.floor((duration % (60 * 1000)) / 1000),
    milliseconds: Math.floor(duration % 1000),
  }
}
