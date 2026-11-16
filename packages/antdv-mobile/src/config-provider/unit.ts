import type { Ref } from 'vue'
import { getCurrentInstance, onMounted } from 'vue'
import { inBrowser } from '../_util'
import { useConfig } from './context'
import { globalDesignUnit, globalUnit } from './unit-state'

/** width of the probe in units: large enough to measure fractions of a pixel */
const PROBE_UNITS = 100
const PROBE_CLASS = 'am-unit-probe'

function toUnitSize(length: string) {
  const size = Number.parseFloat(length)
  return Number.isFinite(size) && size > 0 ? Math.round((size / PROBE_UNITS) * 1e4) / 1e4 : 1
}

/**
 * Real pixels of one unit and of one design unit at `probe` (an element styled by `.am-unit-probe`:
 * 100 units wide, 100 design units high). `1` when it cannot be measured.
 */
export function measureUnit(probe: HTMLElement): { unit: number, designUnit: number } {
  const style = getComputedStyle(probe)
  const unit = toUnitSize(style.width)
  // without layout information (SSR-like environments) a design unit is a unit
  const designUnit = Number.parseFloat(style.height) > 0 ? toUnitSize(style.height) : unit
  return { unit, designUnit }
}

/**
 * Keeps `target` in sync with what is measured at `probe`: the probe resizes whenever a unit
 * changes (viewport resize for `vw`, root font size for `rem` ...).
 * Returns a function that stops watching.
 */
export function watchUnit(probe: HTMLElement, target: { unit: Ref<number>, designUnit: Ref<number> }) {
  const update = () => {
    const measured = measureUnit(probe)
    target.unit.value = measured.unit
    target.designUnit.value = measured.designUnit
  }
  update()
  const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : undefined
  observer?.observe(probe)
  window.addEventListener('resize', update)
  return () => {
    observer?.disconnect()
    window.removeEventListener('resize', update)
  }
}

let globalProbe: HTMLElement | undefined
let stopGlobal: (() => void) | undefined

function ensureGlobalProbe() {
  if (!inBrowser || globalProbe?.isConnected)
    return
  stopGlobal?.()
  globalProbe = document.createElement('span')
  globalProbe.className = PROBE_CLASS
  globalProbe.setAttribute('aria-hidden', 'true')
  // next to <body>, so it never shows up among the children of the app container
  document.documentElement.appendChild(globalProbe)
  stopGlobal = watchUnit(globalProbe, { unit: globalUnit, designUnit: globalDesignUnit })
}

export interface UseUnitResult {
  /** real pixels of one unit (`--am-unit`) in the current ConfigProvider scope, `1` by default */
  unit: Readonly<Ref<number>>
  /** real pixels of one design unit (`--am-design-unit`): the length of a number written on your design */
  designUnit: Readonly<Ref<number>>
  /** units (the 375 design of the library) -> real pixels */
  toPx: (value: number) => number
  /** real pixels -> units */
  toUnits: (value: number) => number
  /** a number written on your design (`theme.token.designWidth`) -> real pixels */
  designToPx: (value: number) => number
  /** units -> a number on your design, e.g. to hand a library constant to a numeric prop */
  unitsToDesign: (value: number) => number
}

/**
 * Sizes that JS has to compute with (row heights of a virtual list, wheel item height ...) are
 * not pixels: library constants are units (`toPx`), numbers given by the user are lengths on
 * their design (`designToPx`).
 */
export function useUnit(): UseUnitResult {
  const config = useConfig()
  if (getCurrentInstance())
    onMounted(ensureGlobalProbe)
  const { unit, designUnit } = config
  return {
    unit,
    designUnit,
    toPx: value => value * unit.value,
    toUnits: value => value / unit.value,
    designToPx: value => value * designUnit.value,
    unitsToDesign: value => (value * unit.value) / designUnit.value,
  }
}
