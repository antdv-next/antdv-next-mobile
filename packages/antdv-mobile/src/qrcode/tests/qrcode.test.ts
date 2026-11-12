import type { QRCodeEncodeOptions } from '../encoder'
import { createHash } from 'node:crypto'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import QRCode from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'
import { encodeQRCode, excavateModules, generatePath, toUtf8Bytes } from '../encoder'

function toText(modules: boolean[][]) {
  return modules.map(row => row.map(cell => (cell ? '#' : '.')).join('')).join('\n')
}

function digest(value: string | string[], options?: QRCodeEncodeOptions) {
  const code = encodeQRCode(value, options)
  const bits = code.modules.map(row => row.map(cell => (cell ? 1 : 0)).join('')).join('\n')
  return [code.version, code.errorLevel, code.mask, createHash('sha256').update(bits).digest('hex').slice(0, 16)]
}

// Vectors frozen from a cross-check against the Nayuki reference encoder (the one behind `@v-c/qrcode`).
describe('QRCode encoder', () => {
  it('encodes the reference matrix of "HELLO WORLD" (1-Q, alphanumeric)', () => {
    const code = encodeQRCode('HELLO WORLD', { errorLevel: 'Q' })
    expect(code).toMatchObject({ version: 1, size: 21, errorLevel: 'Q', mask: 0 })
    expect(toText(code.modules)).toBe([
      '#######.##....#######',
      '#.....#.#..#..#.....#',
      '#.###.#.#..##.#.###.#',
      '#.###.#.#.....#.###.#',
      '#.###.#.#.#...#.###.#',
      '#.....#...#...#.....#',
      '#######.#.#.#.#######',
      '........#............',
      '.##.#.##....#.#.#####',
      '.#......####....#...#',
      '..##.###.##...#.##...',
      '.##.##.#..##.#.#.###.',
      '#...#.#.#.###.###.#.#',
      '........##.#..#...#.#',
      '#######.#.#....#.##..',
      '#.....#..#.##.##.#...',
      '#.###.#.#.#...#######',
      '#.###.#..#.#.#.#...#.',
      '#.###.#.#..#.###.#..#',
      '#.....#.#.####...#.##',
      '#######....#.###....#',
    ].join('\n'))
  })

  it('matches the frozen vectors (byte / numeric / UTF-8 / multi block / segments)', () => {
    expect(digest('https://www.antdv-next.com')).toEqual([2, 'M', 4, 'f6c9ddd82d8590e4'])
    expect(digest('https://www.antdv-next.com', { errorLevel: 'H' })).toEqual([4, 'H', 0, '8f7d4e44244aa634'])
    expect(digest('0123456789012345678901234567890123456789', { errorLevel: 'L', boostLevel: false }))
      .toEqual([1, 'L', 1, '91eb8d49c15bc3f0'])
    expect(digest('你好，世界 😀', { errorLevel: 'M' })).toEqual([2, 'Q', 7, '82e8fc0ff864bda1'])
    expect(digest('antdv-next-mobile '.repeat(60), { errorLevel: 'Q' })).toEqual([32, 'Q', 2, 'a8013669c4d96c64'])
    expect(digest(['HELLO', '12345', 'world 你好'], { errorLevel: 'L' })).toEqual([2, 'M', 6, 'd8be397167d68200'])
  })

  it('picks the smallest version and boosts the level only when it is free', () => {
    expect(encodeQRCode('A', { errorLevel: 'L' })).toMatchObject({ version: 1, errorLevel: 'H' })
    expect(encodeQRCode('A', { errorLevel: 'L', boostLevel: false })).toMatchObject({ version: 1, errorLevel: 'L' })
    // capacities of version 1-L: 41 digits, 25 alphanumeric chars, 17 bytes
    expect(encodeQRCode('1'.repeat(41), { errorLevel: 'L' }).version).toBe(1)
    expect(encodeQRCode('1'.repeat(42), { errorLevel: 'L' }).version).toBe(2)
    expect(encodeQRCode('A'.repeat(25), { errorLevel: 'L' }).version).toBe(1)
    expect(encodeQRCode('A'.repeat(26), { errorLevel: 'L' }).version).toBe(2)
    expect(encodeQRCode('a'.repeat(17), { errorLevel: 'L' }).version).toBe(1)
    expect(encodeQRCode('a'.repeat(18), { errorLevel: 'L' }).version).toBe(2)
  })

  it('supports version 40, minVersion and a forced mask', () => {
    const max = encodeQRCode('1'.repeat(7089), { errorLevel: 'L' })
    expect(max).toMatchObject({ version: 40, size: 177, errorLevel: 'L' })
    expect(encodeQRCode('a', { minVersion: 7 })).toMatchObject({ version: 7, size: 45 })
    expect(encodeQRCode('a', { mask: 5 }).mask).toBe(5)
  })

  it('throws when the data is too long', () => {
    expect(() => encodeQRCode('1'.repeat(7090), { errorLevel: 'L' })).toThrow(RangeError)
    expect(() => encodeQRCode('a'.repeat(2954), { errorLevel: 'L' })).toThrow(RangeError)
    expect(() => encodeQRCode('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', { maxVersion: 1, errorLevel: 'H' })).toThrow(RangeError)
  })

  it('always draws the three finder patterns', () => {
    const { modules, size } = encodeQRCode('finder')
    const finder = ['#######', '#.....#', '#.###.#', '#.###.#', '#.###.#', '#.....#', '#######'].join('\n')
    const cut = (x: number, y: number) => toText(modules.slice(y, y + 7).map(row => row.slice(x, x + 7)))
    expect(cut(0, 0)).toBe(finder)
    expect(cut(size - 7, 0)).toBe(finder)
    expect(cut(0, size - 7)).toBe(finder)
  })

  it('encodes UTF-8', () => {
    expect(toUtf8Bytes('aé你😀')).toEqual([0x61, 0xC3, 0xA9, 0xE4, 0xBD, 0xA0, 0xF0, 0x9F, 0x98, 0x80])
    expect(toUtf8Bytes('\uD800')).toEqual([0xEF, 0xBF, 0xBD])
  })

  it('generates a merged path and excavates', () => {
    const modules = [
      [true, true, false],
      [false, false, true],
      [true, false, true],
    ]
    expect(generatePath(modules)).toBe('M0 0h2v1H0zM2 1h1v1H2zM0 2h1v1H0zM2 2h1v1H2z')
    expect(generatePath(modules, 2)).toBe('M2 2h2v1H2zM4 3h1v1H4zM2 4h1v1H2zM4 4h1v1H4z')
    expect(excavateModules(modules, { x: 1, y: 0, w: 2, h: 2 })).toEqual([
      [true, false, false],
      [false, false, false],
      [true, false, true],
    ])
  })
})

describe('QRCode', () => {
  const VALUE = 'https://www.antdv-next.com'
  let ctx: Record<string, any>

  beforeEach(() => {
    ctx = {
      fillStyle: '',
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => ctx as any)
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(
      (type?: string) => `data:${type ?? 'image/png'};base64,QR`,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a canvas by default with base classes and size', async () => {
    const wrapper = mount(QRCode, { props: { value: VALUE } })
    await nextTick()
    expect(wrapper.classes()).toEqual(['am-qrcode'])
    expect(wrapper.find('canvas.am-qrcode-canvas').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.find('.am-qrcode-cover').exists()).toBe(false)
    expect((wrapper.element as HTMLElement).style.width).toBe('160px')
  })

  it('draws the modules on the canvas with the device pixel ratio', async () => {
    vi.stubGlobal('devicePixelRatio', 2)
    const wrapper = mount(QRCode, { props: { value: VALUE, size: 100, color: '#123456', bgColor: '#ffffff' } })
    await nextTick()
    const canvas = wrapper.find('canvas').element
    expect(canvas.width).toBe(200)
    expect(canvas.height).toBe(200)
    // background first, then one rect per horizontal run
    expect(ctx.fillRect.mock.calls[0]).toEqual([0, 0, 200, 200])
    expect(ctx.fillRect.mock.calls.length).toBeGreaterThan(25)
    expect(ctx.fillStyle).toBe('#123456')
    // version 2 (25 modules): the top row of the finder pattern is 7 modules of 8 device pixels
    expect(ctx.fillRect.mock.calls[1]).toEqual([0, 0, 56, 8])
    vi.unstubAllGlobals()
  })

  it('re-draws when the value changes and renders nothing without a value', async () => {
    const wrapper = mount(QRCode, { props: { value: VALUE } })
    await nextTick()
    const calls = ctx.fillRect.mock.calls.length
    await wrapper.setProps({ value: 'another value' })
    await nextTick()
    expect(ctx.fillRect.mock.calls.length).toBeGreaterThan(calls)
    await wrapper.setProps({ value: '' })
    expect(wrapper.find('.am-qrcode').exists()).toBe(false)
    expect(mount(QRCode).find('.am-qrcode').exists()).toBe(false)
  })

  it('renders nothing (and reports) when the value is too long', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(QRCode, { props: { value: 'a'.repeat(3000) } })
    expect(wrapper.find('.am-qrcode').exists()).toBe(false)
    expect(error).toHaveBeenCalled()
  })

  it('renders svg with a single path', () => {
    const wrapper = mount(QRCode, { props: { value: VALUE, type: 'svg', color: 'red', bgColor: 'white', title: 'Site' } })
    expect(wrapper.find('canvas').exists()).toBe(false)
    const svg = wrapper.find('svg.am-qrcode-svg')
    expect(svg.attributes('viewBox')).toBe('0 0 25 25')
    expect(svg.find('title').text()).toBe('Site')
    expect(svg.findAll('path')).toHaveLength(2)
    expect(svg.find('.am-qrcode-svg-bg').attributes('fill')).toBe('white')
    const fg = svg.find('.am-qrcode-svg-fg')
    expect(fg.attributes('fill')).toBe('red')
    expect(fg.attributes('d')).toBe(generatePath(encodeQRCode(VALUE).modules))
  })

  it('svg follows the theme color by default', () => {
    const wrapper = mount(QRCode, { props: { value: VALUE, type: 'svg' } })
    expect(wrapper.find('.am-qrcode-svg-fg').attributes('fill')).toBe('currentColor')
    expect(wrapper.find('.am-qrcode-svg-bg').attributes('fill')).toBe('none')
  })

  it('supports marginSize, errorLevel and boostLevel', async () => {
    const wrapper = mount(QRCode, { props: { value: VALUE, type: 'svg', marginSize: 4 } })
    expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 33 33')
    expect(wrapper.find('.am-qrcode-svg-fg').attributes('d')).toBe(generatePath(encodeQRCode(VALUE).modules, 4))
    await wrapper.setProps({ marginSize: 0, errorLevel: 'H' })
    expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 33 33')
    await wrapper.setProps({ value: 'A', errorLevel: 'L', boostLevel: false })
    expect(wrapper.find('.am-qrcode-svg-fg').attributes('d'))
      .toBe(generatePath(encodeQRCode('A', { errorLevel: 'L', boostLevel: false }).modules))
  })

  it('accepts an array value and a css length size', () => {
    const wrapper = mount(QRCode, { props: { value: ['HELLO', '12345'], type: 'svg', size: '100%' } })
    expect((wrapper.element as HTMLElement).style.width).toBe('100%')
    expect(wrapper.find('.am-qrcode-svg-fg').attributes('d')).toBe(generatePath(encodeQRCode(['HELLO', '12345']).modules))
  })

  it('svg icon is centered and excavated', () => {
    const wrapper = mount(QRCode, {
      props: { value: VALUE, type: 'svg', errorLevel: 'H', icon: 'logo.png', iconSize: 40 },
    })
    // version 4 = 33 modules on 160px: 40px -> 8.25 modules
    const image = wrapper.find('svg image')
    expect(image.attributes('href')).toBe('logo.png')
    expect(Number(image.attributes('width'))).toBeCloseTo(8.25)
    expect(Number(image.attributes('height'))).toBeCloseTo(8.25)
    expect(Number(image.attributes('x'))).toBeCloseTo(12.375)
    const modules = encodeQRCode(VALUE, { errorLevel: 'H' }).modules
    expect(wrapper.find('.am-qrcode-svg-fg').attributes('d'))
      .toBe(generatePath(excavateModules(modules, { x: 12, y: 12, w: 9, h: 9 })))
  })

  it('supports a width / height icon size', () => {
    const wrapper = mount(QRCode, {
      props: { value: VALUE, type: 'svg', errorLevel: 'H', icon: 'logo.png', iconSize: { width: 80, height: 20 } },
    })
    const image = wrapper.find('svg image')
    expect(Number(image.attributes('width'))).toBeCloseTo(16.5)
    expect(Number(image.attributes('height'))).toBeCloseTo(4.125)
  })

  it('canvas icon is drawn once the image is loaded', async () => {
    const wrapper = mount(QRCode, { props: { value: VALUE, errorLevel: 'H', icon: 'logo.png', size: 165 } })
    await nextTick()
    const img = wrapper.find('img.am-qrcode-icon')
    expect(img.attributes('src')).toBe('logo.png')
    expect(img.attributes('crossorigin')).toBe('anonymous')
    expect(ctx.drawImage).not.toHaveBeenCalled()
    Object.defineProperty(img.element, 'naturalWidth', { value: 10 })
    Object.defineProperty(img.element, 'naturalHeight', { value: 10 })
    await img.trigger('load')
    await nextTick()
    await nextTick()
    // 33 modules on 165px -> 5px per module, 40px icon centered
    expect(ctx.drawImage).toHaveBeenCalledWith(img.element, 62.5, 62.5, 40, 40)
  })

  it('bordered / rootClass / classes / styles / attrs', async () => {
    const wrapper = mount(QRCode, {
      props: {
        value: VALUE,
        bordered: false,
        status: 'scanned',
        rootClass: 'my-root',
        classes: { root: 'c-root', cover: 'c-cover' },
        styles: { root: { margin: '4px' }, cover: { opacity: 0.5 } },
      },
      attrs: { 'class': 'from-attrs', 'style': 'width: 200px', 'data-id': 'qr' },
    })
    await nextTick()
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['am-qrcode', 'am-qrcode-borderless', 'am-qrcode-status-scanned', 'my-root', 'c-root', 'from-attrs']),
    )
    const root = wrapper.element as HTMLElement
    expect(root.style.margin).toBe('4px')
    // attrs win
    expect(root.style.width).toBe('200px')
    expect(wrapper.attributes('data-id')).toBe('qr')
    const cover = wrapper.find('.am-qrcode-cover')
    expect(cover.classes()).toContain('c-cover')
    expect((cover.element as HTMLElement).style.opacity).toBe('0.5')
  })

  it('color / bgColor land on the root', () => {
    const wrapper = mount(QRCode, { props: { value: VALUE, color: 'rgb(1, 2, 3)', bgColor: 'rgb(4, 5, 6)' } })
    const root = wrapper.element as HTMLElement
    expect(root.style.color).toBe('rgb(1, 2, 3)')
    expect(root.style.backgroundColor).toBe('rgb(4, 5, 6)')
  })

  it('status loading shows the spinner', () => {
    const wrapper = mount(QRCode, { props: { value: VALUE, status: 'loading' } })
    expect(wrapper.classes()).toContain('am-qrcode-status-loading')
    expect(wrapper.find('.am-qrcode-cover .am-spinner').exists()).toBe(true)
  })

  it('status scanned shows the locale text', () => {
    const wrapper = mount(QRCode, { props: { value: VALUE, status: 'scanned' } })
    expect(wrapper.find('.am-qrcode-cover .am-qrcode-scanned').text()).toBe('已扫描')
  })

  it('status expired shows the text, and the refresh action only with a listener', async () => {
    const plain = mount(QRCode, { props: { value: VALUE, status: 'expired' } })
    expect(plain.find('.am-qrcode-expired').text()).toBe('二维码过期')
    expect(plain.find('.am-button').exists()).toBe(false)

    const onRefresh = vi.fn()
    const wrapper = mount(QRCode, { props: { value: VALUE, status: 'expired' }, attrs: { onRefresh } })
    const button = wrapper.find('.am-qrcode-cover .am-button')
    expect(button.classes()).toContain('am-button-variant-link')
    expect(button.text()).toBe('点击刷新')
    await button.trigger('click')
    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('refresh')).toHaveLength(1)
  })

  it('follows ConfigProvider locale', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(QRCode, { value: VALUE, status: 'expired', onRefresh: () => {} }) },
    })
    expect(wrapper.find('.am-qrcode-expired').text()).toBe(enUS.QRCode.expired)
    expect(wrapper.find('.am-button').text()).toBe(enUS.QRCode.refresh)
  })

  it('statusRender prop receives the info', async () => {
    const onRefresh = vi.fn()
    const statusRender = vi.fn((info: any) => h('button', { class: 'custom', onClick: info.onRefresh }, `${info.status}:${info.locale.expired}`))
    const wrapper = mount(QRCode, { props: { value: VALUE, status: 'expired', statusRender }, attrs: { onRefresh } })
    const custom = wrapper.find('.am-qrcode-cover .custom')
    expect(custom.text()).toBe('expired:二维码过期')
    expect(wrapper.find('.am-qrcode-expired').exists()).toBe(false)
    await custom.trigger('click')
    expect(onRefresh).toHaveBeenCalledTimes(1)
  })

  it('statusRender slot wins over the prop', () => {
    const wrapper = mount(QRCode, {
      props: { value: VALUE, status: 'loading', statusRender: () => h('i', { class: 'from-prop' }) },
      slots: { statusRender: (info: any) => h('i', { class: 'from-slot' }, info.status) },
    })
    expect(wrapper.find('.from-slot').text()).toBe('loading')
    expect(wrapper.find('.from-prop').exists()).toBe(false)
    expect(wrapper.find('.am-spinner').exists()).toBe(false)
  })

  it('statusRender info has no onRefresh without a listener', () => {
    const statusRender = vi.fn(() => null)
    mount(QRCode, { props: { value: VALUE, status: 'expired', statusRender } })
    expect(statusRender).toHaveBeenCalledWith(expect.objectContaining({ status: 'expired', onRefresh: undefined }))
  })

  it('exposes nativeElement and toDataURL', async () => {
    const wrapper = mount(QRCode, { props: { value: VALUE } })
    await nextTick()
    const vm = wrapper.vm as any
    expect(vm.nativeElement).toBe(wrapper.element)
    expect(vm.toDataURL()).toBe('data:image/png;base64,QR')
    expect(vm.toDataURL('image/jpeg', 0.8)).toBe('data:image/jpeg;base64,QR')
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenLastCalledWith('image/jpeg', 0.8)

    await wrapper.setProps({ type: 'svg', color: '#112233' })
    const url: string = vm.toDataURL()
    expect(url.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true)
    const markup = decodeURIComponent(url.slice(url.indexOf(',') + 1))
    expect(markup).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(markup).toContain('width="160"')
    expect(markup).toContain('fill="#112233"')
    expect(markup).not.toContain('currentColor')
  })
})
