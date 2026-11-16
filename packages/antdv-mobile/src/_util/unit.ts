/**
 * Every length of the library is expressed in "units": `1 unit = var(--am-unit)` (default `1px`).
 * The library is drawn on a 375 wide design, so `--am-unit: calc(100vw / 375)` scales it with the
 * viewport, `calc(1rem / 37.5)` follows a rem based project, `2px` fits a 750 wide viewport ...
 *
 * Stylesheets are written in `px` and rewritten at build time (`build/unit.ts`); values created
 * in JS go through `toUnit()` so both follow the same rule.
 *
 * Numbers that come from the user (props, `theme.token`) are written on *their* design, which may
 * not be 375 wide. They are multiples of `--am-design-unit` (`toDesignUnit()`), which equals
 * `--am-unit` unless `theme.token.designWidth` says otherwise (750 -> half a unit).
 */
export const UNIT_VAR = '--am-unit'
export const DESIGN_UNIT_VAR = '--am-design-unit'
/** width of the design the library is drawn on */
export const BASE_DESIGN_WIDTH = 375

/** Lengths that never scale: hairlines (`<= 1`) and "infinite" radii (`>= 999`). */
export function isFixedLength(value: number) {
  const abs = Math.abs(value)
  return abs <= 1 || abs >= 999
}

/** `16` -> `calc(16 * var(--am-unit))`, `1` -> `1px`, `999` -> `999px` */
export function toUnit(value: number | string): string {
  const num = Number(value)
  return isFixedLength(num) ? `${num}px` : `calc(${num} * var(${UNIT_VAR}))`
}

/** A number given by the user: `16` -> `calc(16 * var(--am-design-unit))`, `1` -> `1px` */
export function toDesignUnit(value: number | string): string {
  const num = Number(value)
  return isFixedLength(num) ? `${num}px` : `calc(${num} * var(${DESIGN_UNIT_VAR}))`
}
