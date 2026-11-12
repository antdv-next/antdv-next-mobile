import type { PickerColumns, PickerFieldNames, PickerOption, PickerValue } from './interface'

export interface NormalizedPickerOption {
  label: string
  value: PickerValue
  disabled: boolean
  raw: PickerOption
}

export interface ResolvedPicker {
  columns: NormalizedPickerOption[][]
  /** value of every column, snapped to an existing enabled option */
  value: PickerValue[]
  items: (PickerOption | undefined)[]
}

export function normalizeColumn(column: PickerOption[] | undefined, fieldNames?: PickerFieldNames): NormalizedPickerOption[] {
  const { label = 'label', value = 'value', disabled = 'disabled' } = fieldNames ?? {}
  return (column ?? []).map((raw) => {
    const val = raw[value] as PickerValue
    return { label: String(raw[label] ?? val ?? ''), value: val, disabled: !!raw[disabled], raw }
  })
}

/** Index of the enabled option nearest to `index`, `-1` when every option is disabled. */
export function findEnabledIndex(options: { disabled?: boolean }[], index: number): number {
  const count = options.length
  if (!count)
    return -1
  const start = Math.min(Math.max(index, 0), count - 1)
  for (let step = 0; step < count; step++) {
    const after = start + step
    if (after < count && !options[after].disabled)
      return after
    const before = start - step
    if (before >= 0 && !options[before].disabled)
      return before
  }
  return -1
}

function pickOption(column: NormalizedPickerOption[], value: PickerValue | undefined) {
  const index = column.findIndex(option => option.value === value)
  return column[findEnabledIndex(column, index < 0 ? 0 : index)]
}

function getColumns(columns: PickerColumns | undefined, value: PickerValue[], fieldNames?: PickerFieldNames) {
  const raw = typeof columns === 'function' ? columns(value) : columns
  return (raw ?? []).map(column => normalizeColumn(column, fieldNames))
}

/**
 * Resolves the columns for `value` and snaps every column value to an existing enabled option.
 * Function columns are re-evaluated until the value is stable, so cascading columns stay valid.
 */
export function resolvePicker(columns: PickerColumns | undefined, value: PickerValue[] | undefined, fieldNames?: PickerFieldNames): ResolvedPicker {
  let current = (value ?? []).slice()
  let resolved = getColumns(columns, current, fieldNames)
  let selected = resolved.map((column, index) => pickOption(column, current[index]))
  if (typeof columns === 'function') {
    for (let i = 0; i < 10; i++) {
      const next = selected.map(option => option?.value) as PickerValue[]
      if (next.length === current.length && next.every((val, index) => val === current[index]))
        break
      current = next
      resolved = getColumns(columns, current, fieldNames)
      selected = resolved.map((column, index) => pickOption(column, current[index]))
    }
  }
  return {
    columns: resolved,
    value: selected.map(option => option?.value) as PickerValue[],
    items: selected.map(option => option?.raw),
  }
}
