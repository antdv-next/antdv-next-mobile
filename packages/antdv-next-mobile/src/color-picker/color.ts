/**
 * Local color model of the ColorPicker. It mirrors what antdv-next gets from
 * `@v-c/color-picker` + `@ant-design/fast-color` (same parsing rules, rounding and
 * output strings) without adding a dependency.
 */

export interface ColorPickerRGB {
  r: number
  g: number
  b: number
  a?: number
}

export interface ColorPickerHSB {
  h: number
  s: number
  b: number
  a?: number
}

interface HSVInput { h: number, s: number, v: number, a?: number }
interface HSLInput { h: number, s: number, l: number, a?: number }

const round = Math.round

function limitRange(value: number, max = 255) {
  if (value > max)
    return max
  if (value < 0)
    return 0
  return value
}

/**
 * - `rgba(102, 204, 255, .5)` / `rgb(102 204 255 / 50%)` / `rgb(100%, 50%, 0%)`
 * - `hsb(215, 91%, 100%)` / `hsba(215, 91%, 100%, 0.5)` / `hsl(270deg 60% 40% / 50%)`
 */
function splitColorStr(str: string, parseNum: (num: number, txt: string, index: number) => number) {
  const match = str.replace(/^[^(]*\((.*)/, '$1').replace(/\).*/, '').match(/\d*\.?\d+%?/g) || []
  const numList = match.map(item => Number.parseFloat(item))
  for (let i = 0; i < 3; i += 1)
    numList[i] = parseNum(numList[i] || 0, match[i] || '', i)
  numList[3] = match[3] ? (match[3].includes('%') ? numList[3] / 100 : numList[3]) : 1
  return numList
}

const parseHsvOrHsl = (num: number, _: string, index: number) => (index === 0 ? num : num / 100)

const isObj = (val: unknown): val is Record<string, any> => typeof val === 'object' && val !== null
const has = (val: Record<string, any>, keys: string) => keys.split('').every(key => key in val)

export function toHexFormat(value?: string, alpha?: boolean) {
  return value?.replace(/[^0-9a-f]/gi, '').slice(0, alpha ? 8 : 6) || ''
}

export const getRoundNumber = (value: number) => Math.round(Number(value || 0))

/**
 * The color object handed to `change` / `showText` / `v-model:value` (antdv-next: `Color`).
 * Immutable from the outside: build a new one with `generateColor()`.
 */
export class AggregationColor {
  /** `true` when the color was cleared (`allowClear`) or built from an empty value */
  public cleared = false

  private r = 0
  private g = 0
  private b = 0
  private a = 1
  /** hue / saturation / brightness as entered, so they survive `s = 0` or `b = 0` */
  private _h?: number
  private _s?: number
  private _v?: number

  constructor(input?: ColorPickerColorInput) {
    if (input instanceof AggregationColor) {
      this.r = input.r
      this.g = input.g
      this.b = input.b
      this.a = input.a
      this._h = input._h
      this._s = input._s
      this._v = input._v
      this.cleared = input.cleared
      return
    }
    if (typeof input === 'string') {
      const str = input.trim()
      if (/^#?[A-F\d]{3,8}$/i.test(str))
        this.fromHexString(str)
      else if (str.startsWith('rgb'))
        this.fromRgbString(str)
      else if (str.startsWith('hsl'))
        this.fromHslString(str)
      else if (str.startsWith('hsv') || str.startsWith('hsb'))
        this.fromHsvString(str)
    }
    else if (isObj(input)) {
      const obj: Record<string, any> = input
      if (has(obj, 'rgb')) {
        this.r = limitRange(obj.r)
        this.g = limitRange(obj.g)
        this.b = limitRange(obj.b)
        this.a = typeof obj.a === 'number' ? limitRange(obj.a, 1) : 1
      }
      else if (has(obj, 'hsb')) {
        this.fromHsv({ h: obj.h, s: obj.s, v: obj.b, a: obj.a })
      }
      else if (has(obj, 'hsv')) {
        this.fromHsv(obj as HSVInput)
      }
      else if (has(obj, 'hsl')) {
        this.fromHsl(obj as HSLInput)
      }
    }
    if (!input) {
      this.a = 0
      this.cleared = true
    }
  }

  // ---------- output ----------
  toRgb(): Required<ColorPickerRGB> {
    return { r: this.r, g: this.g, b: this.b, a: this.a }
  }

  toHsb(): Required<ColorPickerHSB> {
    return { h: this.getHue(), s: this.getSaturation(), b: this.getValue(), a: this.a }
  }

  /** `#rrggbb`, or `#rrggbbaa` when the color is translucent */
  toHexString() {
    const part = (num: number) => {
      const hex = (num || 0).toString(16)
      return hex.length === 2 ? hex : `0${hex}`
    }
    let hex = `#${part(this.r)}${part(this.g)}${part(this.b)}`
    if (this.a >= 0 && this.a < 1)
      hex += part(round(this.a * 255))
    return hex
  }

  /** `toHexString()` without the `#` */
  toHex() {
    return toHexFormat(this.toHexString(), this.a < 1)
  }

  /** `rgb(r,g,b)` or `rgba(r,g,b,a)` */
  toRgbString() {
    return this.a !== 1 ? `rgba(${this.r},${this.g},${this.b},${this.a})` : `rgb(${this.r},${this.g},${this.b})`
  }

  /** `hsb(h, s%, b%)` or `hsba(h, s%, b%, a)` */
  toHsbString() {
    const hsb = this.toHsb()
    const base = `${getRoundNumber(hsb.h)}, ${getRoundNumber(hsb.s * 100)}%, ${getRoundNumber(hsb.b * 100)}%`
    return hsb.a === 1 ? `hsb(${base})` : `hsba(${base}, ${hsb.a.toFixed(hsb.a === 0 ? 0 : 2)})`
  }

  /** What CSS understands (`toRgbString()`) */
  toCssString() {
    return this.toRgbString()
  }

  toString() {
    return this.toRgbString()
  }

  equals(color?: AggregationColor | null) {
    return !!color && this.toHexString() === color.toHexString()
  }

  // ---------- internals ----------
  private getHue() {
    if (this._h === undefined) {
      const { r, g, b } = this
      const max = Math.max(r, g, b)
      const delta = max - Math.min(r, g, b)
      if (delta === 0)
        this._h = 0
      else
        this._h = round(60 * (r === max ? (g - b) / delta + (g < b ? 6 : 0) : g === max ? (b - r) / delta + 2 : (r - g) / delta + 4))
    }
    return this._h
  }

  private getSaturation() {
    if (this._s === undefined) {
      const max = Math.max(this.r, this.g, this.b)
      const delta = max - Math.min(this.r, this.g, this.b)
      this._s = delta === 0 ? 0 : delta / max
    }
    return this._s
  }

  private getValue() {
    if (this._v === undefined)
      this._v = Math.max(this.r, this.g, this.b) / 255
    return this._v
  }

  private fromHexString(str: string) {
    const hex = str.replace('#', '')
    const num = (a: number, b: number = a) => Number.parseInt(hex[a] + (hex[b] ?? ''), 16)
    if (hex.length < 6) {
      // #rgb or #rgba
      this.r = num(0)
      this.g = num(1)
      this.b = num(2)
      this.a = hex[3] ? num(3) / 255 : 1
    }
    else {
      // #rrggbb or #rrggbbaa
      this.r = num(0, 1)
      this.g = num(2, 3)
      this.b = num(4, 5)
      this.a = hex[6] ? num(6, 7) / 255 : 1
    }
  }

  private fromRgbString(str: string) {
    const cells = splitColorStr(str, (num, txt) => (txt.includes('%') ? round((num / 100) * 255) : num))
    this.r = limitRange(cells[0])
    this.g = limitRange(cells[1])
    this.b = limitRange(cells[2])
    this.a = limitRange(cells[3], 1)
  }

  private fromHsvString(str: string) {
    const cells = splitColorStr(str, parseHsvOrHsl)
    this.fromHsv({ h: cells[0], s: cells[1], v: cells[2], a: cells[3] })
  }

  private fromHslString(str: string) {
    const cells = splitColorStr(str, parseHsvOrHsl)
    this.fromHsl({ h: cells[0], s: cells[1], l: cells[2], a: cells[3] })
  }

  private fromHsv({ h: rawH, s, v, a }: HSVInput) {
    const h = ((rawH % 360) + 360) % 360
    this._h = h
    this._s = s
    this._v = v
    this.a = typeof a === 'number' ? a : 1
    const vv = round(v * 255)
    this.r = vv
    this.g = vv
    this.b = vv
    if (s <= 0)
      return
    const hh = h / 60
    const i = Math.floor(hh)
    const ff = hh - i
    const p = round(v * (1 - s) * 255)
    const q = round(v * (1 - s * ff) * 255)
    const t = round(v * (1 - s * (1 - ff)) * 255)
    switch (i) {
      case 0:
        this.g = t
        this.b = p
        break
      case 1:
        this.r = q
        this.b = p
        break
      case 2:
        this.r = p
        this.b = t
        break
      case 3:
        this.r = p
        this.g = q
        break
      case 4:
        this.r = t
        this.g = p
        break
      default:
        this.g = p
        this.b = q
        break
    }
  }

  private fromHsl({ h: rawH, s, l, a }: HSLInput) {
    const h = ((rawH % 360) + 360) % 360
    this._h = h
    this.a = typeof a === 'number' ? a : 1
    if (s <= 0) {
      const rgb = round(l * 255)
      this.r = rgb
      this.g = rgb
      this.b = rgb
      return
    }
    const huePrime = h / 60
    const chroma = (1 - Math.abs(2 * l - 1)) * s
    const second = chroma * (1 - Math.abs((huePrime % 2) - 1))
    const list = [
      [chroma, second, 0],
      [second, chroma, 0],
      [0, chroma, second],
      [0, second, chroma],
      [second, 0, chroma],
      [chroma, 0, second],
    ][Math.floor(huePrime)] ?? [0, 0, 0]
    const m = l - chroma / 2
    this.r = round((list[0] + m) * 255)
    this.g = round((list[1] + m) * 255)
    this.b = round((list[2] + m) * 255)
  }
}

/** Everything a color can be created from */
export type ColorPickerColorInput = string | AggregationColor | ColorPickerRGB | ColorPickerHSB | null

export function generateColor(color?: ColorPickerColorInput): AggregationColor {
  return color instanceof AggregationColor ? color : new AggregationColor(color)
}

/** Alpha in percent, 0 - 100 */
export const getColorAlpha = (color: AggregationColor) => getRoundNumber(color.toHsb().a * 100)

/** The same color with another alpha (default: opaque) */
export function genAlphaColor(color: AggregationColor, alpha?: number) {
  const rgba = color.toRgb()
  // A color entered as hsb may be (0, 0, 0) in rgb when `b` is 0: keep its hue / saturation
  if (!rgba.r && !rgba.g && !rgba.b) {
    const hsba = color.toHsb()
    hsba.a = alpha || 1
    return generateColor(hsba)
  }
  rgba.a = alpha || 1
  return generateColor(rgba)
}

/** The cleared version of a color (alpha 0, `cleared: true`) */
export function genClearColor(color: AggregationColor) {
  const hsba = color.toHsb()
  hsba.a = 0
  const next = generateColor(hsba)
  next.cleared = true
  return next
}

/** Whether a dark check mark / border is needed on top of the color */
export function isBright(color: AggregationColor) {
  const { r, g, b, a } = color.toRgb()
  // mostly transparent: the surface behind it decides (the presets follow the text colour then)
  if (a <= 0.5)
    return false
  return r * 0.299 + g * 0.587 + b * 0.114 > 192
}

export function formatColor(color: AggregationColor, format?: 'hex' | 'rgb' | 'hsb') {
  switch (format) {
    case 'hex':
      return color.toHexString()
    case 'hsb':
      return color.toHsbString()
    default:
      return color.toRgbString()
  }
}
