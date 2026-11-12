import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import AntdvNextMobileResolver from '..'
import * as components from '../../components'
import map from '../components'

const from = '@antdv-next/mobile'

describe('AntdvNextMobileResolver', () => {
  it('resolves registered names to named exports', () => {
    const resolver = AntdvNextMobileResolver()
    expect(resolver.type).toBe('component')
    expect(resolver.resolve('AmButton')).toStrictEqual({ name: 'Button', from })
    expect(resolver.resolve('AmFormItem')).toStrictEqual({ name: 'FormItem', from })
    expect(resolver.resolve('AmInputOtp')).toStrictEqual({ name: 'InputOTP', from })
    expect(resolver.resolve('AmRangePicker')).toStrictEqual({ name: 'DateRangePicker', from })
  })

  it('accepts the export spelling as a tag', () => {
    const resolver = AntdvNextMobileResolver()
    expect(resolver.resolve('AmQRCode')).toStrictEqual({ name: 'QRCode', from })
    expect(resolver.resolve('AmTextArea')).toStrictEqual({ name: 'TextArea', from })
    expect(resolver.resolve('AmDateRangePicker')).toStrictEqual({ name: 'DateRangePicker', from })
  })

  it('ignores unknown names', () => {
    const resolver = AntdvNextMobileResolver()
    expect(resolver.resolve('AmButton2')).toBeUndefined()
    expect(resolver.resolve('Button')).toBeUndefined()
    expect(resolver.resolve('AButton')).toBeUndefined()
    expect(resolver.resolve('SearchOutlined')).toBeUndefined()
  })

  it('exclude matches the tag name or the export name', () => {
    expect(AntdvNextMobileResolver({ exclude: 'AmButton' }).resolve('AmButton')).toBeUndefined()
    expect(AntdvNextMobileResolver({ exclude: ['Button'] }).resolve('AmButton')).toBeUndefined()
    expect(AntdvNextMobileResolver({ exclude: /^AmInput/ }).resolve('AmInputNumber')).toBeUndefined()
    expect(AntdvNextMobileResolver({ exclude: [/Picker$/] }).resolve('AmButton')).toStrictEqual({ name: 'Button', from })
    expect(AntdvNextMobileResolver({ exclude: null }).resolve('AmButton')).toStrictEqual({ name: 'Button', from })
  })

  it('resolveIcons imports from @antdv-next/icons', () => {
    const resolver = AntdvNextMobileResolver({ resolveIcons: true })
    expect(resolver.resolve('SearchOutlined')).toStrictEqual({ name: 'SearchOutlined', from: '@antdv-next/icons' })
    expect(resolver.resolve('HeartTwoTone')).toStrictEqual({ name: 'HeartTwoTone', from: '@antdv-next/icons' })
    expect(resolver.resolve('Search')).toBeUndefined()
    expect(AntdvNextMobileResolver({ resolveIcons: true, exclude: ['SearchOutlined'] }).resolve('SearchOutlined')).toBeUndefined()
  })
})

describe('generated lists (pnpm gen:components)', () => {
  const expected: Record<string, string> = {}
  Object.entries(components).forEach(([exportName, value]: [string, any]) => {
    if (value && typeof value.name === 'string' && /^Am[A-Z]/.test(value.name))
      expected[value.name] = exportName
  })

  it('resolver map follows components.ts', () => {
    expect(map).toStrictEqual(expected)
  })

  it('global.d.ts follows components.ts', () => {
    const dts = readFileSync(join(__dirname, '../../../global.d.ts'), 'utf-8')
    const declared: Record<string, string> = {}
    for (const match of dts.matchAll(/(\w+): typeof import\('@antdv-next\/mobile'\)\['(\w+)'\]/g))
      declared[match[1]] = match[2]
    expect(declared).toStrictEqual(expected)
  })
})
