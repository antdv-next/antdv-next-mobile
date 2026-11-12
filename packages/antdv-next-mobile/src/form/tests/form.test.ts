import type { FormInstance } from '..'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import Form, { FormItem } from '..'
import Button from '../../button'
import ConfigProvider from '../../config-provider'
import Input from '../../input'
import enUS from '../../locale/en_US'
import Switch from '../../switch'

interface SetupOptions {
  formProps?: Record<string, any>
  nameProps?: Record<string, any>
  model?: Record<string, any>
  extra?: () => any
}

function setup(options: SetupOptions = {}) {
  const model = reactive<Record<string, any>>(options.model ?? { name: '', agree: false })
  const formRef = ref<FormInstance>()
  const wrapper = mount(defineComponent({
    setup() {
      return () => h(Form, { ref: formRef, model, ...options.formProps }, {
        default: () => [
          h(FormItem, { name: 'name', label: 'Name', rules: [{ required: true }], ...options.nameProps }, () => h(Input, {
            'value': model.name,
            'onUpdate:value': (v: string) => {
              model.name = v
            },
          })),
          h(FormItem, { name: 'agree', label: 'Agree' }, () => h(Switch, {
            'checked': model.agree,
            'onUpdate:checked': (v: any) => {
              model.agree = v
            },
          })),
          options.extra?.(),
        ],
        footer: () => h(Button, { htmlType: 'submit', type: 'primary' }, () => 'Submit'),
      })
    },
  }), { attachTo: document.body })
  return { wrapper, model, form: () => formRef.value! }
}

async function type(wrapper: ReturnType<typeof mount>, value: string) {
  const input = wrapper.find('input.am-input-input')
  await input.setValue(value)
  await flushPromises()
}

describe('Form', () => {
  it('renders a form with mobile cells', () => {
    const { wrapper } = setup()
    const form = wrapper.find('form')
    expect(form.classes()).toEqual(expect.arrayContaining(['am-form', 'am-form-horizontal']))
    expect(form.attributes('novalidate')).toBeDefined()
    const items = wrapper.findAll('.am-form-item')
    expect(items).toHaveLength(2)
    expect(items[0].classes()).toEqual(expect.arrayContaining(['am-form-item-horizontal', 'am-form-item-required']))
    expect(items[0].find('.am-form-item-label').text()).toContain('Name')
    expect(items[0].find('.am-form-item-required-mark').exists()).toBe(true)
    expect(items[1].find('.am-form-item-required-mark').exists()).toBe(false)
    expect(wrapper.find('.am-form-footer .am-button').exists()).toBe(true)
    expect(Form.Item).toBe(FormItem)
    expect(Form.name).toBe('AmForm')
    expect(FormItem.name).toBe('AmFormItem')
  })

  it('gives the control the id of the field and links the label', () => {
    const { wrapper } = setup({ formProps: { name: 'login' } })
    expect(wrapper.find('input.am-input-input').attributes('id')).toBe('login_name')
    expect(wrapper.find('.am-form-item-label label').attributes('for')).toBe('login_name')
    expect(wrapper.find('form').attributes('name')).toBe('login')
  })

  it('provides the borderless variant, disabled and size to fields', async () => {
    const { wrapper } = setup()
    expect(wrapper.find('.am-input').classes()).toContain('am-input-borderless')
    expect(wrapper.find('.am-input').classes()).not.toContain('am-input-disabled')

    const outlined = setup({ formProps: { variant: 'outlined', disabled: true, size: 'large' } })
    const input = outlined.wrapper.find('.am-input')
    expect(input.classes()).toEqual(expect.arrayContaining(['am-input-outlined', 'am-input-disabled', 'am-input-lg']))
    expect(outlined.wrapper.find('input.am-input-input').attributes('disabled')).toBeDefined()
    expect(outlined.wrapper.find('.am-switch').classes()).toContain('am-switch-disabled')
    expect(outlined.wrapper.find('.am-button').classes()).toContain('am-button-disabled')
  })

  it('validates on change with the locale message and clears the error once valid', async () => {
    const onValidate = vi.fn()
    const { wrapper } = setup({ formProps: { onValidate } })
    await type(wrapper, 'a')
    expect(wrapper.find('.am-form-item-explain').exists()).toBe(false)
    await type(wrapper, '')
    const item = wrapper.find('.am-form-item')
    expect(item.classes()).toContain('am-form-item-has-error')
    expect(item.find('.am-form-item-explain-error').text()).toBe('请输入Name')
    expect(wrapper.find('.am-input').classes()).toContain('am-input-status-error')
    expect(onValidate).toHaveBeenLastCalledWith(['name'], false, ['请输入Name'])
    await type(wrapper, 'ok')
    expect(item.classes()).not.toContain('am-form-item-has-error')
    expect(item.find('.am-form-item-explain').exists()).toBe(false)
    expect(onValidate).toHaveBeenLastCalledWith(['name'], true, null)
  })

  it('respects the blur trigger of FormItem and of a single rule', async () => {
    const { wrapper } = setup({ nameProps: { validateTrigger: 'blur' } })
    await type(wrapper, 'a')
    await type(wrapper, '')
    expect(wrapper.find('.am-form-item-explain-error').exists()).toBe(false)
    await wrapper.find('input.am-input-input').trigger('blur')
    await flushPromises()
    expect(wrapper.find('.am-form-item-explain-error').exists()).toBe(true)

    const byRule = setup({
      nameProps: { rules: [{ required: true, message: 'required' }, { min: 3, message: 'too short', trigger: 'blur' }] },
    })
    await type(byRule.wrapper, 'ab')
    expect(byRule.wrapper.find('.am-form-item-explain-error').exists()).toBe(false)
    await byRule.wrapper.find('input.am-input-input').trigger('blur')
    await flushPromises()
    expect(byRule.wrapper.find('.am-form-item-explain-error').text()).toBe('too short')
  })

  it('does not validate automatically when validateTrigger is false', async () => {
    const { wrapper, form } = setup({ formProps: { validateTrigger: false } })
    await type(wrapper, 'a')
    await type(wrapper, '')
    await wrapper.find('input.am-input-input').trigger('blur')
    await flushPromises()
    expect(wrapper.find('.am-form-item-explain-error').exists()).toBe(false)
    await expect(form().validate()).rejects.toMatchObject({ errorFields: [{ name: ['name'] }] })
    await nextTick()
    expect(wrapper.find('.am-form-item-explain-error').exists()).toBe(true)
  })

  it('uses form level rules, validateMessages and async validators', async () => {
    const validator = vi.fn(async (_rule: any, value: string) => {
      if (value === 'taken')
        throw new Error('already taken')
    })
    const { wrapper, form, model } = setup({
      nameProps: { rules: undefined },
      formProps: {
        rules: { name: [{ required: true }, { validator }] },
        validateMessages: { required: '${label} is missing' },
      },
    })
    await expect(form().validateFields()).rejects.toMatchObject({ message: 'Name is missing' })
    await nextTick()
    expect(wrapper.find('.am-form-item-explain-error').text()).toBe('Name is missing')
    model.name = 'taken'
    await flushPromises()
    expect(wrapper.find('.am-form-item-explain-error').text()).toBe('already taken')
    model.name = 'free'
    await flushPromises()
    await expect(form().validateFields()).resolves.toEqual({ name: 'free', agree: false })
  })

  it('submits through a htmlType="submit" button: finish / finishFailed', async () => {
    const onFinish = vi.fn()
    const onFinishFailed = vi.fn()
    const onSubmit = vi.fn()
    const { wrapper } = setup({ formProps: { onFinish, onFinishFailed, onSubmit, scrollToFirstError: true } })
    const scrollIntoView = vi.fn()
    ;(wrapper.find('.am-form-item').element as HTMLElement).scrollIntoView = scrollIntoView

    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onFinish).not.toHaveBeenCalled()
    expect(onFinishFailed).toHaveBeenCalledTimes(1)
    const info = onFinishFailed.mock.calls[0][0]
    expect(info.values).toEqual({ name: '', agree: false })
    expect(info.errorFields).toEqual([{ name: ['name'], errors: ['请输入Name'], warnings: [] }])
    expect(scrollIntoView).toHaveBeenCalled()
    expect(wrapper.find('.am-form-item-explain-error').exists()).toBe(true)

    await type(wrapper, 'Tom')
    await wrapper.find('.am-switch').trigger('click')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onFinish).toHaveBeenCalledWith({ name: 'Tom', agree: true })
    expect(onFinishFailed).toHaveBeenCalledTimes(1)
  })

  it('resetFields restores the initial values and clears the validation', async () => {
    const { wrapper, form, model } = setup({ model: { name: 'init', agree: true } })
    await type(wrapper, '')
    expect(wrapper.find('.am-form-item-explain-error').exists()).toBe(true)
    await wrapper.find('.am-switch').trigger('click')
    expect(model.agree).toBe(false)
    expect(form().isFieldTouched('name')).toBe(true)

    form().resetFields()
    await flushPromises()
    expect(model).toEqual({ name: 'init', agree: true })
    expect(wrapper.find('.am-form-item-explain-error').exists()).toBe(false)
    expect((wrapper.find('input.am-input-input').element as HTMLInputElement).value).toBe('init')
    expect(form().isFieldTouched('name')).toBe(false)

    // native reset button behaves the same
    await type(wrapper, '')
    await wrapper.find('form').trigger('reset')
    await flushPromises()
    expect(model.name).toBe('init')
    expect(wrapper.find('.am-form-item-explain-error').exists()).toBe(false)
  })

  it('clearValidate, setFieldsValue, getFieldsValue, getFieldError and setFields', async () => {
    const { wrapper, form, model } = setup()
    await form().validate().catch(() => {})
    await nextTick()
    expect(form().getFieldError('name')).toEqual(['请输入Name'])
    expect(form().getFieldsError()).toEqual([
      { name: ['name'], errors: ['请输入Name'], warnings: [] },
      { name: ['agree'], errors: [], warnings: [] },
    ])
    form().clearValidate(['name'])
    await nextTick()
    expect(wrapper.find('.am-form-item-explain-error').exists()).toBe(false)

    form().setFieldsValue({ name: 'Jerry', agree: true })
    await flushPromises()
    expect(model).toEqual({ name: 'Jerry', agree: true })
    expect(form().getFieldsValue()).toEqual({ name: 'Jerry', agree: true })
    expect(form().getFieldsValue(['name'])).toEqual({ name: 'Jerry' })
    expect(form().getFieldValue('name')).toBe('Jerry')

    form().setFields([{ name: 'name', errors: ['server error'] }])
    await nextTick()
    expect(wrapper.find('.am-form-item-explain-error').text()).toBe('server error')
  })

  it('validateFields with a name list only validates those fields', async () => {
    const { form } = setup({
      extra: () => h(FormItem, { name: 'age', label: 'Age', rules: [{ required: true }] }, () => h('span')),
      model: { name: '', agree: false, age: undefined },
    })
    await expect(form().validateFields(['agree'])).resolves.toEqual({ agree: false })
    await expect(form().validateFields(['age'])).rejects.toMatchObject({ errorFields: [{ name: ['age'] }] })
    expect(form().getFieldError('name')).toEqual([])
  })

  it('emits valuesChange when a field changes', async () => {
    const onValuesChange = vi.fn()
    const { wrapper } = setup({ formProps: { onValuesChange } })
    await type(wrapper, 'x')
    expect(onValuesChange).toHaveBeenCalledWith({ name: 'x' }, { name: 'x', agree: false })
    await wrapper.find('.am-switch').trigger('click')
    await flushPromises()
    expect(onValuesChange).toHaveBeenLastCalledWith({ agree: true }, { name: 'x', agree: true })
  })

  it('supports nested name paths', async () => {
    const model = reactive({ user: { email: 'x' } })
    const formRef = ref<FormInstance>()
    const wrapper = mount(defineComponent({
      setup: () => () => h(Form, { ref: formRef, model }, () =>
        h(FormItem, { name: ['user', 'email'], label: 'Email', rules: [{ type: 'email' }] }, () => h(Input, {
          'value': model.user.email,
          'onUpdate:value': (v: string) => {
            model.user.email = v
          },
        }))),
    }))
    expect(wrapper.find('input').attributes('id')).toBe('user_email')
    await expect(formRef.value!.validate()).rejects.toMatchObject({ errorFields: [{ name: ['user', 'email'] }] })
    model.user.email = 'a@b.com'
    await flushPromises()
    await expect(formRef.value!.validate()).resolves.toEqual({ user: { email: 'a@b.com' } })
  })

  it('layout, labelWidth, labelAlign, colon, mode and requiredMark', () => {
    const { wrapper } = setup({
      formProps: { layout: 'vertical', mode: 'card', labelAlign: 'end', colon: true, requiredMark: 'optional' },
      nameProps: { layout: 'horizontal', labelWidth: 80 },
    })
    expect(wrapper.find('form').classes()).toEqual(expect.arrayContaining(['am-form-vertical', 'am-form-card']))
    const [name, agree] = wrapper.findAll('.am-form-item')
    expect(name.classes()).toContain('am-form-item-horizontal')
    expect(name.find('.am-form-item-label').attributes('style')).toContain('width: 80px')
    expect(name.find('.am-form-item-label').classes()).toContain('am-form-item-label-end')
    expect(name.find('label').classes()).toContain('am-form-item-colon')
    expect(name.find('.am-form-item-required-mark').exists()).toBe(false)
    expect(name.find('.am-form-item-optional').exists()).toBe(false)
    expect(agree.classes()).toContain('am-form-item-vertical')
    expect(agree.find('label').classes()).not.toContain('am-form-item-colon')
    expect(agree.find('.am-form-item-optional').text()).toBe('（可选）')
  })

  it('header / footer slots win over props, attrs and semantic classes pass through', () => {
    const wrapper = mount(Form, {
      props: { header: 'Prop header', footer: 'Prop footer', rootClass: 'root-cls', classes: { body: 'body-cls', item: 'item-cls' } },
      attrs: { 'class': 'custom', 'data-id': 'f' },
      slots: {
        header: () => 'Slot header',
        default: () => h(FormItem, { label: 'A', rootClass: 'item-root', classes: { label: 'label-cls' } }, () => 'content'),
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('f')
    expect(wrapper.find('.am-form-header').text()).toBe('Slot header')
    expect(wrapper.find('.am-form-footer').text()).toBe('Prop footer')
    expect(wrapper.find('.am-form-body').classes()).toContain('body-cls')
    expect(wrapper.find('.am-form-item').classes()).toEqual(expect.arrayContaining(['item-cls', 'item-root']))
    expect(wrapper.find('.am-form-item-label').classes()).toContain('label-cls')
  })

  it('uses the locale of ConfigProvider for messages', async () => {
    const model = reactive({ name: '' })
    const formRef = ref<FormInstance>()
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: {
        default: () => h(Form, { ref: formRef, model }, () =>
          h(FormItem, { name: 'name', label: 'Name', rules: [{ required: true }] }, () => h(Input, { value: model.name }))),
      },
    })
    await formRef.value!.validate().catch(() => {})
    await nextTick()
    expect(wrapper.find('.am-form-item-explain-error').text()).toBe(enUS.Form.defaultValidateMessages.required!.replace('${label}', 'Name'))
  })
})

describe('FormItem', () => {
  it('works standalone and renders label / help / extra with slot priority', () => {
    const wrapper = mount(FormItem, {
      props: { label: 'Prop label', help: 'Prop help', extra: 'Prop extra' },
      slots: { default: () => 'content', label: () => 'Slot label', extra: () => 'Slot extra' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-form-item', 'am-form-item-standalone']))
    expect(wrapper.find('.am-form-item-label').text()).toBe('Slot label')
    expect(wrapper.find('.am-form-item-explain').text()).toBe('Prop help')
    expect(wrapper.find('.am-form-item-extra').text()).toBe('Slot extra')
    expect(wrapper.find('.am-form-item-content').text()).toBe('content')
  })

  it('validateStatus is passed to the field and required can be forced', () => {
    const wrapper = mount(FormItem, {
      props: { label: 'A', validateStatus: 'warning', required: true, hasFeedback: true },
      slots: { default: () => h(Input) },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-form-item-has-warning', 'am-form-item-required']))
    expect(wrapper.find('.am-input').classes()).toContain('am-input-status-warning')
    expect(wrapper.find('.am-form-item-feedback-icon').exists()).toBe(true)
  })

  it('clickable cell emits click and shows an arrow; contentAlign / hidden classes', async () => {
    const onClick = vi.fn()
    const wrapper = mount(FormItem, {
      props: { label: 'City', clickable: true, contentAlign: 'end', onClick },
      slots: { default: () => 'Hangzhou' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-form-item-clickable', 'am-form-item-content-end']))
    expect(wrapper.find('.am-form-item-arrow').exists()).toBe(true)
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    await wrapper.setProps({ arrow: false, hidden: true })
    expect(wrapper.find('.am-form-item-arrow').exists()).toBe(false)
    expect(wrapper.classes()).toContain('am-form-item-hidden')
  })

  it('custom arrow: slot wins over prop', () => {
    const byProp = mount(FormItem, { props: { arrow: () => h('i', { class: 'prop-arrow' }) }, slots: { default: () => 'x' } })
    expect(byProp.find('.prop-arrow').exists()).toBe(true)
    const bySlot = mount(FormItem, {
      props: { arrow: () => h('i', { class: 'prop-arrow' }) },
      slots: { default: () => 'x', arrow: () => h('i', { class: 'slot-arrow' }) },
    })
    expect(bySlot.find('.slot-arrow').exists()).toBe(true)
    expect(bySlot.find('.prop-arrow').exists()).toBe(false)
  })

  it('noStyle renders the control only and reports errors to the parent item', async () => {
    const model = reactive({ first: '' })
    const formRef = ref<FormInstance>()
    const wrapper = mount(defineComponent({
      setup: () => () => h(Form, { ref: formRef, model }, () =>
        h(FormItem, { label: 'Name' }, () =>
          h(FormItem, { name: 'first', noStyle: true, rules: [{ required: true, message: 'first required' }] }, () => h(Input, { value: model.first })))),
    }))
    expect(wrapper.findAll('.am-form-item')).toHaveLength(1)
    await formRef.value!.validate().catch(() => {})
    await nextTick()
    expect(wrapper.find('.am-form-item').classes()).toContain('am-form-item-has-error')
    expect(wrapper.find('.am-form-item-explain-error').text()).toBe('first required')
    expect(wrapper.find('.am-input').classes()).toContain('am-input-status-error')
  })

  it('validateFirst stops at the first failed rule and warningOnly does not block', async () => {
    const model = reactive({ a: '', b: 'x' })
    const formRef = ref<FormInstance>()
    const wrapper = mount(defineComponent({
      setup: () => () => h(Form, { ref: formRef, model }, () => [
        h(FormItem, { name: 'a', validateFirst: true, rules: [{ required: true, message: 'r1' }, { min: 2, message: 'r2' }] }, () => h('i')),
        h(FormItem, { name: 'b', rules: [{ min: 3, message: 'short', warningOnly: true }] }, () => h('i')),
      ]),
    }))
    await expect(formRef.value!.validate(['a'])).rejects.toMatchObject({ errorFields: [{ errors: ['r1'] }] })
    await expect(formRef.value!.validate(['b'])).resolves.toEqual({ b: 'x' })
    await nextTick()
    const items = wrapper.findAll('.am-form-item')
    expect(items[1].classes()).toContain('am-form-item-has-warning')
    expect(items[1].find('.am-form-item-explain-warning').text()).toBe('short')
  })

  it('unregisters from the form when unmounted', async () => {
    const model = reactive({ a: '' })
    const show = ref(true)
    const formRef = ref<FormInstance>()
    mount(defineComponent({
      setup: () => () => h(Form, { ref: formRef, model }, () =>
        show.value ? h(FormItem, { name: 'a', rules: [{ required: true }] }, () => h('i')) : null),
    }))
    await expect(formRef.value!.validate()).rejects.toBeTruthy()
    show.value = false
    await nextTick()
    await expect(formRef.value!.validate()).resolves.toEqual({})
  })
})
