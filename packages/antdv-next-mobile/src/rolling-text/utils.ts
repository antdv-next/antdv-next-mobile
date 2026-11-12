import type { RollingTextDirection } from './interface'

export interface RollingTextColumn {
  /** `false`: a static character such as the sign or the decimal point */
  rolling: boolean
  /** Figures from top to bottom */
  figures: string[]
  /** Position among the rolling columns, `-1` for a static one */
  order: number
}

/** How many full 0-9 loops a digit column makes between its start and target figure. */
const LOOPS = 2

function getDecimals(num: number) {
  const text = String(num)
  if (text.includes('e'))
    return 0
  const dot = text.indexOf('.')
  return dot === -1 ? 0 : text.length - dot - 1
}

function toFinite(num: unknown) {
  const value = Number(num)
  return Number.isFinite(value) ? value : 0
}

/** `from` and `value` as equal-length digit strings (same number of decimals, zero padded). */
export function formatNumbers(from: unknown, value: unknown) {
  const start = toFinite(from)
  const target = toFinite(value)
  const decimals = Math.min(Math.max(getDecimals(start), getDecimals(target)), 20)
  const startText = Math.abs(start).toFixed(decimals)
  const targetText = Math.abs(target).toFixed(decimals)
  const length = Math.max(startText.length, targetText.length)
  return {
    start: startText.padStart(length, '0'),
    target: targetText.padStart(length, '0'),
    negative: target < 0,
    label: target.toFixed(decimals),
  }
}

function getDigitFigures(start: number, target: number) {
  const figures: string[] = []
  for (let i = start; i <= 9; i++)
    figures.push(String(i))
  for (let loop = 0; loop < LOOPS; loop++) {
    for (let i = 0; i <= 9; i++)
      figures.push(String(i))
  }
  for (let i = 0; i <= target; i++)
    figures.push(String(i))
  return figures
}

function finalize(columns: Omit<RollingTextColumn, 'order'>[], direction: RollingTextDirection): RollingTextColumn[] {
  let order = 0
  return columns.map(column => ({
    rolling: column.rolling,
    // Rolling down shows the list bottom-up, so the target sits on top.
    figures: column.rolling && direction === 'down' ? [...column.figures].reverse() : column.figures,
    order: column.rolling ? order++ : -1,
  }))
}

export function getNumberColumns(from: unknown, value: unknown, direction: RollingTextDirection): RollingTextColumn[] {
  const { start, target, negative } = formatNumbers(from, value)
  const columns: Omit<RollingTextColumn, 'order'>[] = []
  if (negative)
    columns.push({ rolling: false, figures: ['-'] })
  for (let i = 0; i < target.length; i++) {
    const char = target[i]
    if (char >= '0' && char <= '9')
      columns.push({ rolling: true, figures: getDigitFigures(Number(start[i]) || 0, Number(char)) })
    else
      columns.push({ rolling: false, figures: [char] })
  }
  return finalize(columns, direction)
}

export function getTextColumns(texts: string[], direction: RollingTextDirection): RollingTextColumn[] {
  const rows = texts.map(text => Array.from(String(text ?? '')))
  const length = rows.length ? rows[rows.length - 1].length : 0
  const columns: Omit<RollingTextColumn, 'order'>[] = []
  for (let i = 0; i < length; i++)
    columns.push({ rolling: true, figures: rows.map(row => row[i] ?? '') })
  return finalize(columns, direction)
}
