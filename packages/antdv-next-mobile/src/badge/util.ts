export const presetColors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
]

export function isPresetColor(color?: string | null): boolean {
  return !!color && presetColors.includes(color)
}
