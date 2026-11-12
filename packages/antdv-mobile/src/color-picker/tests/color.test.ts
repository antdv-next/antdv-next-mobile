import { describe, expect, it } from 'vitest'
import { AggregationColor, formatColor, genAlphaColor, genClearColor, generateColor, getColorAlpha, isBright, toHexFormat } from '../color'

/**
 * Reference values computed with the PC implementation
 * (`Color` of `@v-c/color-picker` 1.0.7 on top of `@ant-design/fast-color`):
 * input, toHexString(), toRgbString(), toHsbString(), toRgb(), toHsb().
 */
const reference: [any, string, string, string, Record<string, number>, Record<string, number>][] = [
  ['#1677ff', '#1677ff', 'rgb(22,119,255)', 'hsb(215, 91%, 100%)', { r: 22, g: 119, b: 255, a: 1 }, { h: 215, s: 0.9137254901960784, b: 1, a: 1 }],
  ['1677FF', '#1677ff', 'rgb(22,119,255)', 'hsb(215, 91%, 100%)', { r: 22, g: 119, b: 255, a: 1 }, { h: 215, s: 0.9137254901960784, b: 1, a: 1 }],
  ['#fff', '#ffffff', 'rgb(255,255,255)', 'hsb(0, 0%, 100%)', { r: 255, g: 255, b: 255, a: 1 }, { h: 0, s: 0, b: 1, a: 1 }],
  ['#f00c', '#ff0000cc', 'rgba(255,0,0,0.8)', 'hsba(0, 100%, 100%, 0.80)', { r: 255, g: 0, b: 0, a: 0.8 }, { h: 0, s: 1, b: 1, a: 0.8 }],
  ['#abcde', '#aabbccdd', 'rgba(170,187,204,0.8666666666666667)', 'hsba(210, 17%, 80%, 0.87)', { r: 170, g: 187, b: 204, a: 0.8666666666666667 }, { h: 210, s: 0.16666666666666666, b: 0.8, a: 0.8666666666666667 }],
  ['#1677ff80', '#1677ff80', 'rgba(22,119,255,0.5019607843137255)', 'hsba(215, 91%, 100%, 0.50)', { r: 22, g: 119, b: 255, a: 0.5019607843137255 }, { h: 215, s: 0.9137254901960784, b: 1, a: 0.5019607843137255 }],
  ['#1677ff8', '#1677ff08', 'rgba(22,119,255,0.03137254901960784)', 'hsba(215, 91%, 100%, 0.03)', { r: 22, g: 119, b: 255, a: 0.03137254901960784 }, { h: 215, s: 0.9137254901960784, b: 1, a: 0.03137254901960784 }],
  ['#00000000', '#00000000', 'rgba(0,0,0,0)', 'hsba(0, 0%, 0%, 0)', { r: 0, g: 0, b: 0, a: 0 }, { h: 0, s: 0, b: 0, a: 0 }],
  ['#12', '#000000', 'rgb(0,0,0)', 'hsb(0, 0%, 0%)', { r: 0, g: 0, b: 0, a: 1 }, { h: 0, s: 0, b: 0, a: 1 }],
  ['nonsense', '#000000', 'rgb(0,0,0)', 'hsb(0, 0%, 0%)', { r: 0, g: 0, b: 0, a: 1 }, { h: 0, s: 0, b: 0, a: 1 }],
  ['  #52c41a  ', '#52c41a', 'rgb(82,196,26)', 'hsb(100, 87%, 77%)', { r: 82, g: 196, b: 26, a: 1 }, { h: 100, s: 0.8673469387755102, b: 0.7686274509803922, a: 1 }],
  ['rgb(22, 119, 255)', '#1677ff', 'rgb(22,119,255)', 'hsb(215, 91%, 100%)', { r: 22, g: 119, b: 255, a: 1 }, { h: 215, s: 0.9137254901960784, b: 1, a: 1 }],
  ['rgba(22,119,255,0.5)', '#1677ff80', 'rgba(22,119,255,0.5)', 'hsba(215, 91%, 100%, 0.50)', { r: 22, g: 119, b: 255, a: 0.5 }, { h: 215, s: 0.9137254901960784, b: 1, a: 0.5 }],
  ['rgb(22 119 255 / 50%)', '#1677ff80', 'rgba(22,119,255,0.5)', 'hsba(215, 91%, 100%, 0.50)', { r: 22, g: 119, b: 255, a: 0.5 }, { h: 215, s: 0.9137254901960784, b: 1, a: 0.5 }],
  ['rgb(100%, 50%, 0%)', '#ff8000', 'rgb(255,128,0)', 'hsb(30, 100%, 100%)', { r: 255, g: 128, b: 0, a: 1 }, { h: 30, s: 1, b: 1, a: 1 }],
  ['hsb(215, 91%, 100%)', '#1778ff', 'rgb(23,120,255)', 'hsb(215, 91%, 100%)', { r: 23, g: 120, b: 255, a: 1 }, { h: 215, s: 0.91, b: 1, a: 1 }],
  ['hsba(215, 91%, 100%, 0.5)', '#1778ff80', 'rgba(23,120,255,0.5)', 'hsba(215, 91%, 100%, 0.50)', { r: 23, g: 120, b: 255, a: 0.5 }, { h: 215, s: 0.91, b: 1, a: 0.5 }],
  ['hsv(120, 50%, 50%)', '#408040', 'rgb(64,128,64)', 'hsb(120, 50%, 50%)', { r: 64, g: 128, b: 64, a: 1 }, { h: 120, s: 0.5, b: 0.5, a: 1 }],
  ['hsb(400, 20%, 0%)', '#000000', 'rgb(0,0,0)', 'hsb(40, 20%, 0%)', { r: 0, g: 0, b: 0, a: 1 }, { h: 40, s: 0.2, b: 0, a: 1 }],
  ['hsb(0, 0%, 100%)', '#ffffff', 'rgb(255,255,255)', 'hsb(0, 0%, 100%)', { r: 255, g: 255, b: 255, a: 1 }, { h: 0, s: 0, b: 1, a: 1 }],
  ['hsl(215, 100%, 54%)', '#1476ff', 'rgb(20,118,255)', 'hsb(215, 92%, 100%)', { r: 20, g: 118, b: 255, a: 1 }, { h: 215, s: 0.9215686274509803, b: 1, a: 1 }],
  ['hsla(270, 60%, 40%, .5)', '#6629a380', 'rgba(102,41,163,0.5)', 'hsba(270, 75%, 64%, 0.50)', { r: 102, g: 41, b: 163, a: 0.5 }, { h: 270, s: 0.7484662576687117, b: 0.6392156862745098, a: 0.5 }],
  ['hsl(0, 0%, 50%)', '#808080', 'rgb(128,128,128)', 'hsb(0, 0%, 50%)', { r: 128, g: 128, b: 128, a: 1 }, { h: 0, s: 0, b: 0.5019607843137255, a: 1 }],
  [{ r: 22, g: 119, b: 255 }, '#1677ff', 'rgb(22,119,255)', 'hsb(215, 91%, 100%)', { r: 22, g: 119, b: 255, a: 1 }, { h: 215, s: 0.9137254901960784, b: 1, a: 1 }],
  [{ r: 300, g: -1, b: 12, a: 0.333 }, '#ff000c55', 'rgba(255,0,12,0.333)', 'hsba(357, 100%, 100%, 0.33)', { r: 255, g: 0, b: 12, a: 0.333 }, { h: 357, s: 1, b: 1, a: 0.333 }],
  [{ r: 0, g: 0, b: 0, a: 0 }, '#00000000', 'rgba(0,0,0,0)', 'hsba(0, 0%, 0%, 0)', { r: 0, g: 0, b: 0, a: 0 }, { h: 0, s: 0, b: 0, a: 0 }],
  [{ h: 215, s: 0.91, b: 1 }, '#1778ff', 'rgb(23,120,255)', 'hsb(215, 91%, 100%)', { r: 23, g: 120, b: 255, a: 1 }, { h: 215, s: 0.91, b: 1, a: 1 }],
  [{ h: 215, s: 0.91, b: 1, a: 0.5 }, '#1778ff80', 'rgba(23,120,255,0.5)', 'hsba(215, 91%, 100%, 0.50)', { r: 23, g: 120, b: 255, a: 0.5 }, { h: 215, s: 0.91, b: 1, a: 0.5 }],
  [{ h: 359, s: 0, b: 0.5 }, '#808080', 'rgb(128,128,128)', 'hsb(359, 0%, 50%)', { r: 128, g: 128, b: 128, a: 1 }, { h: 359, s: 0, b: 0.5, a: 1 }],
  [{ h: -30, s: 0.5, b: 0.5 }, '#804060', 'rgb(128,64,96)', 'hsb(330, 50%, 50%)', { r: 128, g: 64, b: 96, a: 1 }, { h: 330, s: 0.5, b: 0.5, a: 1 }],
  [{ h: 720.5, s: 1, b: 1, a: 0 }, '#ff020000', 'rgba(255,2,0,0)', 'hsba(1, 100%, 100%, 0)', { r: 255, g: 2, b: 0, a: 0 }, { h: 0.5, s: 1, b: 1, a: 0 }],
  [{ h: 60, s: 0.333, b: 0.777, a: 0.126 }, '#c6c68420', 'rgba(198,198,132,0.126)', 'hsba(60, 33%, 78%, 0.13)', { r: 198, g: 198, b: 132, a: 0.126 }, { h: 60, s: 0.333, b: 0.777, a: 0.126 }],
  [{ h: 180, s: 1, b: 0 }, '#000000', 'rgb(0,0,0)', 'hsb(180, 100%, 0%)', { r: 0, g: 0, b: 0, a: 1 }, { h: 180, s: 1, b: 0, a: 1 }],
  [{ h: 299.9, s: 0.5, b: 0.25 }, '#402040', 'rgb(64,32,64)', 'hsb(300, 50%, 25%)', { r: 64, g: 32, b: 64, a: 1 }, { h: 299.9, s: 0.5, b: 0.25, a: 1 }],
  [{ h: 100, s: 0.2, v: 0.3 }, '#424d3d', 'rgb(66,77,61)', 'hsb(100, 20%, 30%)', { r: 66, g: 77, b: 61, a: 1 }, { h: 100, s: 0.2, b: 0.3, a: 1 }],
  [{ h: 215, s: 1, l: 0.54 }, '#1476ff', 'rgb(20,118,255)', 'hsb(215, 92%, 100%)', { r: 20, g: 118, b: 255, a: 1 }, { h: 215, s: 0.9215686274509803, b: 1, a: 1 }],
]

describe('color model', () => {
  it.each(reference)('%j matches the PC output', (input, hex, rgb, hsb, toRgb, toHsb) => {
    const color = new AggregationColor(input)
    expect(color.toHexString()).toBe(hex)
    expect(color.toRgbString()).toBe(rgb)
    expect(color.toHsbString()).toBe(hsb)
    expect(color.toRgb()).toEqual(toRgb)
    expect(color.toHsb()).toEqual(toHsb)
    expect(color.toCssString()).toBe(rgb)
    expect(String(color)).toBe(rgb)
    expect(color.cleared).toBe(false)
  })

  it('treats an empty value as cleared (alpha 0)', () => {
    for (const input of ['', null, undefined] as const) {
      const color = new AggregationColor(input)
      expect(color.cleared).toBe(true)
      expect(color.toRgbString()).toBe('rgba(0,0,0,0)')
      expect(color.toHexString()).toBe('#00000000')
      expect(color.toHsbString()).toBe('hsba(0, 0%, 0%, 0)')
    }
  })

  it('clamps rgb strings and objects', () => {
    expect(new AggregationColor('rgba(300, 5, 12, 2)').toRgbString()).toBe('rgb(255,5,12)')
    expect(new AggregationColor({ r: 300, g: -1, b: 12, a: 3 }).toRgbString()).toBe('rgb(255,0,12)')
  })

  it('clones another color with its hsb and cleared state', () => {
    const grey = new AggregationColor({ h: 200, s: 0, b: 0.5 })
    const copy = new AggregationColor(grey)
    expect(copy).not.toBe(grey)
    expect(copy.toHsb()).toEqual({ h: 200, s: 0, b: 0.5, a: 1 })
    const cleared = genClearColor(new AggregationColor('#1677ff'))
    expect(new AggregationColor(cleared).cleared).toBe(true)
  })

  it('toHex() drops the # and only keeps alpha when translucent', () => {
    expect(new AggregationColor('#1677FF').toHex()).toBe('1677ff')
    expect(new AggregationColor('#1677ff80').toHex()).toBe('1677ff80')
  })

  it('equals() compares the hex output', () => {
    expect(new AggregationColor('#1677ff').equals(new AggregationColor('rgb(22, 119, 255)'))).toBe(true)
    expect(new AggregationColor('#1677ff').equals(new AggregationColor('#1677ff80'))).toBe(false)
    expect(new AggregationColor('#1677ff').equals(null)).toBe(false)
  })
})

describe('color helpers', () => {
  it('generateColor returns the same instance for a color object', () => {
    const color = new AggregationColor('#fff')
    expect(generateColor(color)).toBe(color)
    expect(generateColor('#fff')).toBeInstanceOf(AggregationColor)
  })

  it('toHexFormat strips everything that is not a hex digit', () => {
    expect(toHexFormat('#16-77zzFF80')).toBe('1677FF')
    expect(toHexFormat('#16-77zzFF80', true)).toBe('1677FF80')
    expect(toHexFormat(undefined)).toBe('')
  })

  it('getColorAlpha rounds to a percentage', () => {
    expect(getColorAlpha(new AggregationColor('#1677ff80'))).toBe(50)
    expect(getColorAlpha(new AggregationColor('#1677ff'))).toBe(100)
    expect(getColorAlpha(new AggregationColor(''))).toBe(0)
  })

  it('genAlphaColor makes a color opaque and keeps the hue of black', () => {
    expect(genAlphaColor(new AggregationColor('rgba(22,119,255,0.3)')).toRgbString()).toBe('rgb(22,119,255)')
    expect(genAlphaColor(new AggregationColor('#1677ff'), 0.5).toRgbString()).toBe('rgba(22,119,255,0.5)')
    const black = genAlphaColor(new AggregationColor({ h: 120, s: 1, b: 0, a: 0.2 }))
    expect(black.toHsb()).toEqual({ h: 120, s: 1, b: 0, a: 1 })
  })

  it('genClearColor keeps the hue and marks the color cleared', () => {
    const cleared = genClearColor(new AggregationColor('#1677ff'))
    expect(cleared.cleared).toBe(true)
    expect(cleared.toHsb().a).toBe(0)
    expect(cleared.toHsb().h).toBe(215)
  })

  it('isBright', () => {
    expect(isBright(new AggregationColor('#ffffff'))).toBe(true)
    expect(isBright(new AggregationColor('#fadb14'))).toBe(true)
    expect(isBright(new AggregationColor('#1677ff'))).toBe(false)
    expect(isBright(new AggregationColor('#000000'))).toBe(false)
  })

  it('formatColor', () => {
    const color = new AggregationColor('#1677ff80')
    expect(formatColor(color, 'hex')).toBe('#1677ff80')
    expect(formatColor(color, 'hsb')).toBe('hsba(215, 91%, 100%, 0.50)')
    expect(formatColor(color, 'rgb')).toBe('rgba(22,119,255,0.5019607843137255)')
    expect(formatColor(color)).toBe('rgba(22,119,255,0.5019607843137255)')
  })
})
