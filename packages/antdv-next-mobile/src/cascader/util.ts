import type { CascaderFieldNames, CascaderOption, CascaderValue } from './interface'

export function resolveFieldNames(fieldNames?: CascaderFieldNames): Required<CascaderFieldNames> {
  return { label: 'label', value: 'value', children: 'children', ...fieldNames }
}

/** Options along `path`; stops at the first value that is not found (e.g. not loaded yet). */
export function getSelectedOptions(options: CascaderOption[] | undefined, path: CascaderValue[], fieldNames?: CascaderFieldNames): CascaderOption[] {
  const names = resolveFieldNames(fieldNames)
  const selected: CascaderOption[] = []
  let level = options ?? []
  for (const value of path) {
    const option = level.find(item => item[names.value] === value)
    if (!option)
      break
    selected.push(option)
    level = option[names.children] ?? []
  }
  return selected
}

/** Labels of `path`; values without a matching option fall back to the value itself. */
export function getLabels(options: CascaderOption[] | undefined, path: CascaderValue[], fieldNames?: CascaderFieldNames): string[] {
  const names = resolveFieldNames(fieldNames)
  const selected = getSelectedOptions(options, path, fieldNames)
  return path.map((value, index) => String(selected[index]?.[names.label] ?? value))
}
