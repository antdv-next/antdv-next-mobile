<script setup lang="ts">
import type {
  FormEmits,
  FormFieldData,
  FormFieldError,
  FormInstance,
  FormInternalNamePath,
  FormNamePath,
  FormProps,
  FormScrollOptions,
  FormSlots,
  FormValidateErrorEntity,
  FormValidateOptions,
} from './interface'
import type { FormFieldEntity } from './internal'
import { computed, inject, provide, ref } from 'vue'
import { inBrowser } from '../_util'
import RenderNode from '../_util/RenderNode'
import { configContextKey, disabledContextKey, useConfig } from '../config-provider/context'
import { useLocale } from '../locale'
import { variantContextKey } from './context'
import { defaultScrollOptions, formInternalContextKey } from './internal'
import { allPromiseFinish, cloneValue, getNamePath, getValue, isSameNamePath, mergeMessages, setValue } from './utils'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmForm', inheritAttrs: false })

const props = withDefaults(defineProps<FormProps>(), {
  layout: 'horizontal',
  colon: false,
  disabled: undefined,
  requiredMark: true,
  validateTrigger: undefined,
  scrollToFirstError: false,
  mode: 'default',
  header: undefined,
  footer: undefined,
})
const emit = defineEmits<FormEmits>()
defineSlots<FormSlots>()

const config = useConfig()
const locale = useLocale('Form')
const formRef = ref<HTMLFormElement>()

// ---------- contexts for the fields ----------
const parentDisabled = inject(disabledContextKey, undefined)
provide(disabledContextKey, computed(() => props.disabled ?? parentDisabled?.value))
provide(variantContextKey, computed(() => props.variant ?? 'borderless'))
// `useSize` reads the config context, so the Form size is provided through it.
provide(configContextKey, {
  ...config,
  componentSize: computed(() => props.size ?? config.componentSize.value),
})

const validateMessages = computed(() => mergeMessages(locale.value.defaultValidateMessages, props.validateMessages))

// ---------- fields ----------
// Plain bookkeeping, never rendered.
const fields: FormFieldEntity[] = []
let lastValidatePromise: Promise<any> | undefined

function addField(field: FormFieldEntity) {
  if (!fields.includes(field))
    fields.push(field)
}

function removeField(field: FormFieldEntity) {
  const index = fields.indexOf(field)
  if (index > -1)
    fields.splice(index, 1)
}

function getFieldEntities(nameList?: FormInternalNamePath[]) {
  const named = fields.filter(field => field.namePath().length)
  if (!nameList)
    return named
  return named.filter(field => nameList.some(name => isSameNamePath(name, field.namePath())))
}

function toNameList(nameList?: FormNamePath[]) {
  return nameList?.length ? nameList.map(getNamePath) : undefined
}

function getFieldValue(name: FormNamePath) {
  return getValue(props.model, getNamePath(name))
}

function pickValues(nameList: FormInternalNamePath[]) {
  const values: Record<string, any> = {}
  nameList.forEach((namePath) => {
    setValue(values, namePath, cloneValue(getValue(props.model, namePath)))
  })
  return values
}

function getFieldsValue(nameList?: FormNamePath[] | true) {
  if (nameList === true)
    return cloneValue(props.model ?? {})
  if (Array.isArray(nameList))
    return pickValues(nameList.map(getNamePath))
  return pickValues(getFieldEntities().map(field => field.namePath()))
}

function getFieldsError(nameList?: FormNamePath[]): FormFieldError[] {
  return getFieldEntities(toNameList(nameList)).map((field) => {
    const meta = field.getMeta()
    return { name: field.namePath(), errors: meta.errors, warnings: meta.warnings }
  })
}

function getFieldMeta(name: FormNamePath) {
  return getFieldEntities([getNamePath(name)])[0]?.getMeta()
}

function isFieldsTouched(nameList?: FormNamePath[] | boolean, allFieldsTouched?: boolean) {
  if (nameList === false)
    return false
  const all = typeof nameList === 'boolean' ? nameList : allFieldsTouched
  const entities = getFieldEntities(Array.isArray(nameList) ? nameList.map(getNamePath) : undefined)
  if (!entities.length)
    return false
  return all ? entities.every(field => field.getMeta().touched) : entities.some(field => field.getMeta().touched)
}

function resetFields(nameList?: FormNamePath[]) {
  getFieldEntities(toNameList(nameList)).forEach(field => field.resetField())
}

function clearValidate(nameList?: FormNamePath[]) {
  getFieldEntities(toNameList(nameList)).forEach(field => field.clearValidate())
}

function triggerValuesChange(namePath: FormInternalNamePath, value: any) {
  if (!props.model)
    return
  const changedValues: Record<string, any> = {}
  setValue(changedValues, namePath, value)
  emit('valuesChange', changedValues, props.model)
}

function setFieldValue(name: FormNamePath, value: any) {
  if (!props.model)
    return
  const namePath = getNamePath(name)
  setValue(props.model, namePath, value)
  triggerValuesChange(namePath, value)
}

function setFieldsValue(values: Record<string, any>) {
  if (!props.model)
    return
  Object.keys(values || {}).forEach((key) => {
    setValue(props.model, [key], values[key])
  })
}

function setFields(data: FormFieldData[]) {
  data.forEach((item) => {
    const namePath = getNamePath(item.name)
    const target = getFieldEntities([namePath])[0]
    if (target) {
      const meta = target.getMeta()
      target.setFieldState({
        errors: item.errors ?? [],
        warnings: item.warnings ?? [],
        touched: item.touched ?? meta.touched,
        validating: item.validating ?? meta.validating,
      })
    }
    if (Object.prototype.hasOwnProperty.call(item, 'value') && props.model)
      setValue(props.model, namePath, item.value)
  })
}

function validateFields(arg1?: FormNamePath[] | FormValidateOptions, arg2?: FormValidateOptions): Promise<Record<string, any>> {
  const nameList = Array.isArray(arg1) ? arg1 : undefined
  const options = (Array.isArray(arg1) ? arg2 : arg1) ?? {}
  const provideNameList = !!nameList?.length
  const namePathList: FormInternalNamePath[] = provideNameList ? nameList!.map(getNamePath) : []
  const promiseList: Promise<FormFieldError>[] = []

  getFieldEntities(provideNameList ? namePathList : undefined).forEach((field) => {
    if (!provideNameList)
      namePathList.push(field.namePath())
    if (!field.rules().length)
      return
    if (options.dirty) {
      const meta = field.getMeta()
      if (!meta.touched && !meta.validated)
        return
    }
    const name = field.namePath()
    promiseList.push(
      field
        .validateRules(options)
        .then((): FormFieldError => ({ name, errors: [], warnings: [] }))
        .catch((ruleErrors: any[]) => {
          const errors: string[] = []
          const warnings: string[] = []
          ruleErrors?.forEach?.(({ rule, errors: ruleErrorList }: any) => {
            if (rule?.warningOnly)
              warnings.push(...ruleErrorList)
            else
              errors.push(...ruleErrorList)
          })
          if (errors.length)
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject<FormFieldError>({ name, errors, warnings })
          return { name, errors, warnings }
        }),
    )
  })

  const summaryPromise = allPromiseFinish(promiseList)
  lastValidatePromise = summaryPromise

  const returnPromise = summaryPromise
    .then(() => {
      if (lastValidatePromise === summaryPromise)
        return getFieldsValue(namePathList)
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject<Record<string, any>>([])
    })
    .catch((results: FormFieldError[]) => {
      const errorFields = results.filter(result => result && result.errors.length)
      const errorInfo: FormValidateErrorEntity = {
        message: errorFields[0]?.errors?.[0],
        values: getFieldsValue(namePathList),
        errorFields,
        outOfDate: lastValidatePromise !== summaryPromise,
      }

      return Promise.reject<Record<string, any>>(errorInfo)
    })

  // Avoid unhandled rejection logs, callers attach their own handlers.
  returnPromise.catch(e => e)
  return returnPromise
}

function focusField(name: FormNamePath) {
  if (!inBrowser)
    return
  const field = getFieldEntities([getNamePath(name)])[0]
  const id = field?.getId()
  const node = id ? document.getElementById(id) : null
  try {
    node?.focus({ preventScroll: true })
  }
  catch {
    // not focusable
  }
}

function scrollToField(name: FormNamePath, options: FormScrollOptions | boolean = {}) {
  const field = getFieldEntities([getNamePath(name)])[0]
  const el = field?.getElement()
  if (!el)
    return
  const merged = { ...defaultScrollOptions, ...(typeof options === 'object' ? options : undefined) }
  el.scrollIntoView?.({ behavior: merged.behavior, block: merged.block })
  if (merged.focus)
    focusField(name)
}

function handleFinishFailed(errorInfo: FormValidateErrorEntity) {
  emit('finishFailed', errorInfo)
  const first = errorInfo.errorFields?.[0]?.name
  if (first && props.scrollToFirstError)
    scrollToField(first, props.scrollToFirstError)
}

function handleSubmit(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  emit('submit', event)
  if (!props.model)
    return
  validateFields()
    .then(values => emit('finish', values))
    .catch((errorInfo: FormValidateErrorEntity) => handleFinishFailed(errorInfo))
}

function handleReset(event: Event) {
  event.preventDefault()
  emit('reset', event)
  resetFields()
}

function submit() {
  handleSubmit(new Event('submit', { cancelable: true }))
}

provide(formInternalContextKey, {
  props,
  validateMessages,
  addField,
  removeField,
  onValidate: (name, status, errors) => emit('validate', name, status, errors),
  triggerValuesChange,
})

const classNames = computed(() => [
  'am-form',
  `am-form-${props.layout}`,
  {
    'am-form-card': props.mode === 'card',
    'am-form-disabled': props.disabled,
    'am-form-rtl': config.direction.value === 'rtl',
  },
  props.rootClass,
  props.classes?.root,
])

const instance: FormInstance = {
  getFieldValue,
  getFieldsValue,
  getFieldError: name => getFieldMeta(name)?.errors ?? [],
  getFieldsError,
  getFieldWarning: name => getFieldMeta(name)?.warnings ?? [],
  isFieldTouched: name => !!getFieldMeta(name)?.touched,
  isFieldsTouched,
  isFieldValidating: name => !!getFieldMeta(name)?.validating,
  isFieldsValidating: nameList => getFieldEntities(toNameList(nameList)).some(field => field.getMeta().validating),
  resetFields,
  clearValidate,
  setFields,
  setFieldValue,
  setFieldsValue,
  validateFields,
  validate: validateFields,
  submit,
  scrollToField,
  focusField,
  get nativeElement() {
    return formRef.value
  },
}

defineExpose(instance)
</script>

<template>
  <form
    ref="formRef"
    v-bind="$attrs"
    :class="classNames"
    :style="styles?.root"
    :name="name"
    :autocomplete="autocomplete"
    novalidate
    @submit="handleSubmit"
    @reset="handleReset"
  >
    <div
      v-if="$slots.header || (header !== undefined && header !== null && header !== false)"
      class="am-form-header"
      :class="classes?.header"
      :style="styles?.header"
    >
      <slot name="header">
        <RenderNode :node="header" />
      </slot>
    </div>
    <div class="am-form-body" :class="classes?.body" :style="styles?.body">
      <slot />
    </div>
    <div
      v-if="$slots.footer || (footer !== undefined && footer !== null && footer !== false)"
      class="am-form-footer"
      :class="classes?.footer"
      :style="styles?.footer"
    >
      <slot name="footer">
        <RenderNode :node="footer" />
      </slot>
    </div>
  </form>
</template>
