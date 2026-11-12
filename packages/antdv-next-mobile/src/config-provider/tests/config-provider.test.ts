import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import ConfigProvider, { globalConfig, useConfig, useDisabled, useSize } from '..'
import { useLocale } from '../../locale'
import enUS from '../../locale/en_US'
import { useToken } from '../../theme'

function probe() {
  const result: Record<string, any> = {}
  const Probe = defineComponent({
    props: { size: String, disabled: { type: Boolean, default: undefined } },
    setup(props) {
      result.config = useConfig()
      result.size = useSize(() => props.size as any)
      result.disabled = useDisabled(() => props.disabled)
      result.modal = useLocale('Modal')
      result.token = useToken()
      return () => h('i')
    },
  })
  return { Probe, result }
}

describe('ConfigProvider', () => {
  afterEach(() => {
    ConfigProvider.config({ theme: undefined, locale: undefined, direction: undefined })
  })

  it('renders a display: contents theme scope and passes attrs', () => {
    const wrapper = mount(ConfigProvider, {
      props: { theme: { algorithm: 'dark', token: { colorPrimary: '#00b96b' } }, direction: 'rtl' },
      attrs: { 'class': 'app', 'data-x': '1' },
      slots: { default: 'content' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-config-provider', 'am-theme', 'am-theme-dark', 'app']))
    expect((wrapper.element as HTMLElement).style.getPropertyValue('--am-color-primary')).toBe('#00b96b')
    expect(wrapper.attributes('dir')).toBe('rtl')
    expect(wrapper.attributes('data-x')).toBe('1')
    expect(wrapper.text()).toBe('content')
  })

  it('provides defaults without a provider', () => {
    const { Probe, result } = probe()
    mount(Probe)
    expect(result.modal.value.okText).toBe('确定')
    expect(result.size.value).toBeUndefined()
    expect(result.disabled.value).toBe(false)
    expect(result.config.theme.value.className).toEqual([])
  })

  it('provides locale, size and disabled; props win over context', () => {
    const { Probe, result } = probe()
    mount(ConfigProvider, {
      props: { locale: enUS, componentSize: 'large', componentDisabled: true },
      slots: { default: () => h(Probe) },
    })
    expect(result.modal.value.okText).toBe('OK')
    expect(result.size.value).toBe('large')
    expect(result.disabled.value).toBe(true)

    const second = probe()
    mount(ConfigProvider, {
      props: { componentSize: 'large', componentDisabled: true },
      slots: { default: () => h(second.Probe, { size: 'small', disabled: false }) },
    })
    expect(second.result.size.value).toBe('small')
    expect(second.result.disabled.value).toBe(false)
  })

  it('nested providers inherit and override the theme', () => {
    const { Probe, result } = probe()
    const wrapper = mount(ConfigProvider, {
      props: { theme: { algorithm: 'dark', token: { colorPrimary: 'red', borderRadius: 4 } }, locale: enUS },
      slots: {
        default: () => h(ConfigProvider, { theme: { token: { colorPrimary: 'blue' } } }, () => h(Probe)),
      },
    })
    const inner = wrapper.findAll('.am-config-provider')[1]
    expect(inner.classes()).toContain('am-theme-dark')
    expect((inner.element as HTMLElement).style.getPropertyValue('--am-color-primary')).toBe('blue')
    expect((inner.element as HTMLElement).style.getPropertyValue('--am-border-radius')).toBe('4px')
    expect(result.token.isDark.value).toBe(true)
    expect(result.token.token.value.colorPrimary).toBe('blue')
    expect(result.modal.value.okText).toBe('OK')
  })

  it('ConfigProvider.config feeds components outside any provider', () => {
    ConfigProvider.config({ locale: enUS, theme: { algorithm: 'dark' } })
    expect(globalConfig.locale).toBe(enUS)
    const { Probe, result } = probe()
    mount(Probe)
    expect(result.modal.value.cancelText).toBe('Cancel')
    expect(result.config.theme.value.className).toContain('am-theme-dark')
  })
})
