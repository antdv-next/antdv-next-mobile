import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { pxToUnit, unitPlugin } from '../unit'

const u = (n: number) => `calc(${n} * var(--am-unit))`

describe('build/unit', () => {
  it('rewrites px lengths into units', () => {
    expect(pxToUnit('.a{height:40px;padding:0 16px}')).toBe(`.a{height:${u(40)};padding:0 ${u(16)}}`)
    expect(pxToUnit('.a{margin:-4px 1.5px;width:calc(100% - 24px)}'))
      .toBe(`.a{margin:${u(-4)} ${u(1.5)};width:calc(100% - ${u(24)})}`)
    expect(pxToUnit(':root{--am-control-height: 40px}')).toBe(`:root{--am-control-height: ${u(40)}}`)
    expect(pxToUnit('.a{transform:translate3d(-50%,12px,0)}')).toBe(`.a{transform:translate3d(-50%,${u(12)},0)}`)
  })

  it('keeps hairlines, zero and infinite radii', () => {
    const css = '.a{border:1px solid;top:-1px;left:0px;inset:.5px;border-radius:999px;--am-unit:1px}'
    expect(pxToUnit(css)).toBe(css)
  })

  it('leaves comments, strings, urls, at-rule preludes and identifiers alone', () => {
    const css = [
      '/* 40px */',
      '.mt-12px{content:"16px";background:url(a-24px.png)}',
      '@media (min-width: 768px){.a{color:red}}',
      '@supports (offset-path: rect(0 auto auto 0 round 8px)){.b{color:red}}',
      '.c{color:#12px}',
    ].join('\n')
    expect(pxToUnit(css)).toBe(css)
    expect(pxToUnit('@media (min-width: 768px){.a{width:20px}}')).toBe(`@media (min-width: 768px){.a{width:${u(20)}}}`)
  })

  it('am-unit: off / on keeps real pixels', () => {
    expect(pxToUnit('/* am-unit: off */.a{width:20px}/* am-unit: on */.b{width:20px}'))
      .toBe(`/* am-unit: off */.a{width:20px}/* am-unit: on */.b{width:${u(20)}}`)
  })

  it('only transforms the library stylesheets', () => {
    const plugin = unitPlugin()
    const transform = plugin.transform as (code: string, id: string) => { code: string } | undefined
    const code = '.a{width:20px}'
    expect(transform(code, '/repo/packages/antdv-mobile/src/button/style/index.css?direct')!.code).toBe(`.a{width:${u(20)}}`)
    expect(transform(code, '/repo/docs/src/site/style.css')).toBeUndefined()
    expect(transform(code, '/repo/packages/antdv-mobile/src/button/Button.vue')).toBeUndefined()
    expect(transform('.a{width:1px}', '/repo/packages/antdv-mobile/src/a/style/index.css')).toBeUndefined()
    const custom = unitPlugin({ include: id => id.endsWith('x.css') }).transform as typeof transform
    expect(custom(code, '/x.css')!.code).toBe(`.a{width:${u(20)}}`)
  })

  it('inlines relative @import so the imported files are rewritten too', () => {
    const transform = unitPlugin().transform as (code: string, id: string) => { code: string } | undefined
    const entry = resolve(process.cwd(), 'packages/antdv-mobile/src/style/index.css')
    const { code } = transform('@import \'./tokens.css\';\n@import \'./base.css\';', entry)!
    expect(code).not.toContain('@import')
    expect(code).toContain(`--am-control-height: ${u(40)};`)
    expect(code).toContain('--am-unit: 1px;')
    expect(code).toContain('.am-unit-probe')
  })
})
