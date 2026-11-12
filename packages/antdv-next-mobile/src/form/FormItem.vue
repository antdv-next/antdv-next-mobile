<script setup lang="ts">
import type { ValidateStatus } from '../_util/type'
import type { FormItemInputContext } from './context'
import type { FormItemEmits, FormItemInstance, FormItemProps, FormItemSlots, FormRuleObject, FormTriggerType, FormValidateOptions } from './interface'
import type { FormFieldEntity, FormFieldMeta, FormItemChildState } from './internal'
import type { FormRuleError } from './utils'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, LoadingOutlined, RightOutlined } from '@antdv-next/icons'
import { computed, inject, nextTick, onBeforeUnmount, provide, reactive, ref, shallowRef, watch } from 'vue'
import { addUnit, toArray } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useDisabled } from '../config-provider/context'
import { useLocale } from '../locale'
import { formItemInputContextKey } from './context'
import { formInternalContextKey, formItemParentContextKey } from './internal'
import { cloneValue, getFieldId, getNamePath, getValue, isEqualValue, setValue, validateRules } from './utils'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmFormItem', inheritAttrs: false })

const props = withDefaults(defineProps<FormItemProps>(), {
  label: undefined,
  required: undefined,
  help: undefined,
  extra: undefined,
  validateTrigger: undefined,
  validateFirst: false,
  colon: undefined,
  arrow: undefined,
})
const emit = defineEmits<FormItemEmits>()
const slots = defineSlots<FormItemSlots>()

const form = inject(formInternalContextKey, undefined)
const parentItem = inject(formItemParentContextKey, undefined)
const locale = useLocale('Form')
const formDisabled = useDisabled(() => undefined)
const rootRef = ref<HTMLElement>()

const namePath = computed(() => getNamePath(props.name))
const hasName = computed(() => namePath.value.length > 0)
const fieldId = computed(() => props.id ?? getFieldId(namePath.value, form?.props.name))
const fieldValue = computed(() => (hasName.value && form?.props.model ? getValue(form.props.model, namePath.value) : undefined))

// ---------- rules ----------
function getMergedRules(): FormRuleObject[] {
  const rules: FormRuleObject[] = []
  const formRules = form?.props.rules && hasName.value ? getValue(form.props.rules, namePath.value) : undefined
  if (Array.isArray(formRules))
    rules.push(...formRules)
  if (props.rules)
    rules.push(...props.rules)
  return rules
}

const isRequired = computed(() => props.required ?? getMergedRules().some(rule => rule?.required && !rule.warningOnly))

const mergedValidateTrigger = computed(() => (props.validateTrigger !== undefined ? props.validateTrigger : form?.props.validateTrigger))

function getRuleTriggerList(rule: FormRuleObject): FormTriggerType[] {
  const trigger = rule.validateTrigger ?? rule.trigger ?? mergedValidateTrigger.value ?? 'change'
  return trigger === false ? [] : toArray(trigger)
}

const messageVariables = computed(() => {
  const variables: Record<string, string> = {}
  if (typeof props.label === 'string')
    variables.label = props.label
  else if (hasName.value)
    variables.label = namePath.value.join('.')
  return { ...variables, ...props.messageVariables }
})

// ---------- validation state ----------
const errors = shallowRef<string[]>([])
const warnings = shallowRef<string[]>([])
const meta = reactive({ touched: false, validating: false, validated: false })
// Bumped on every validate / clear / reset: a pending async validation that is not the latest must not write its result.
let validateId = 0
let cancelDebounce: (() => void) | undefined
let unmounted = false
const initialValue = cloneValue(fieldValue.value)

function validateRulesInner(options: FormValidateOptions & { triggerName?: FormTriggerType } = {}): Promise<FormRuleError[]> {
  if (!hasName.value)
    return Promise.resolve([])
  const { triggerName, validateOnly = false } = options
  let rules = getMergedRules()
  if (triggerName)
    rules = mergedValidateTrigger.value === false ? [] : rules.filter(rule => getRuleTriggerList(rule).includes(triggerName))

  if (!rules.length) {
    if (!validateOnly) {
      validateId += 1
      errors.value = []
      warnings.value = []
      meta.validating = false
      meta.validated = true
      form?.onValidate(namePath.value, true, null)
    }
    return Promise.resolve([])
  }

  if (!validateOnly) {
    meta.validating = true
    meta.validated = true
  }
  const currentId = validateOnly ? validateId : ++validateId
  const name = namePath.value

  const runRules = () => validateRules(name, fieldValue.value, rules, form?.validateMessages.value ?? {}, props.validateFirst, messageVariables.value)

  const debounce = triggerName && !validateOnly ? props.validateDebounce : undefined
  const promise: Promise<FormRuleError[]> = debounce
    ? new Promise<void>((resolve) => {
        cancelDebounce?.()
        const timer = setTimeout(resolve, debounce)
        cancelDebounce = () => {
          clearTimeout(timer)
          resolve()
        }
      }).then(() => (currentId === validateId ? runRules() : []))
    : runRules()

  return promise
    .catch((e: FormRuleError[]) => e)
    .then((results = []) => {
      const mergedErrors: string[] = []
      const mergedWarnings: string[] = []
      results.forEach(({ rule, errors: ruleErrors }) => {
        if (rule.warningOnly)
          mergedWarnings.push(...ruleErrors)
        else
          mergedErrors.push(...ruleErrors)
      })

      if (!validateOnly && currentId === validateId && !unmounted) {
        errors.value = mergedErrors
        warnings.value = mergedWarnings
        meta.validating = false
        meta.validated = true
        form?.onValidate(name, mergedErrors.length === 0, mergedErrors.length ? mergedErrors : null)
      }

      if (mergedErrors.length)
        return Promise.reject<FormRuleError[]>(results)
      return results
    })
}

function triggerValidate(triggerName: FormTriggerType) {
  if (mergedValidateTrigger.value === false)
    return
  if (!getMergedRules().some(rule => getRuleTriggerList(rule).includes(triggerName)))
    return
  validateRulesInner({ triggerName }).catch(e => e)
}

function clearValidate() {
  validateId += 1
  cancelDebounce?.()
  errors.value = []
  warnings.value = []
  meta.validating = false
}

let skipNextChange = false

function resetField() {
  clearValidate()
  meta.touched = false
  meta.validated = false
  if (hasName.value && form?.props.model) {
    const next = cloneValue(initialValue)
    if (!isEqualValue(fieldValue.value, next)) {
      // The value change below must not validate the freshly reset field.
      skipNextChange = true
      setValue(form.props.model, namePath.value, next)
    }
  }
}

// ---------- change / blur coming from the control ----------
let changeScheduled = false
let notifyValuesChange = false

function scheduleChange(fromControl: boolean) {
  if (fromControl)
    notifyValuesChange = true
  if (changeScheduled)
    return
  changeScheduled = true
  // Wait until the `v-model` update of this tick has been flushed, so the latest value is validated once.
  Promise.resolve().then(() => nextTick(() => {
    changeScheduled = false
    if (unmounted)
      return
    if (notifyValuesChange) {
      notifyValuesChange = false
      if (hasName.value)
        form?.triggerValuesChange(namePath.value, fieldValue.value)
    }
    if (skipNextChange) {
      skipNextChange = false
      return
    }
    triggerValidate('change')
  }))
}

function onFieldChange() {
  meta.touched = true
  scheduleChange(true)
}

function onFieldBlur() {
  meta.touched = true
  triggerValidate('blur')
}

// Also covers controls that do not know about the form (native inputs, custom components) and programmatic changes.
watch(fieldValue, () => scheduleChange(false), { deep: true })

// ---------- messages of `noStyle` children ----------
const childStates = reactive(new Map<symbol, FormItemChildState>())
const itemKey = Symbol('AmFormItem')

if (!props.noStyle) {
  provide(formItemParentContextKey, {
    report: (key, state) => childStates.set(key, state),
    remove: key => childStates.delete(key),
  })
}

watch(
  [errors, warnings, () => meta.validating, () => props.noStyle],
  () => {
    if (!parentItem)
      return
    if (props.noStyle)
      parentItem.report(itemKey, { errors: errors.value, warnings: warnings.value, validating: meta.validating })
    else
      parentItem.remove(itemKey)
  },
)

const mergedErrors = computed(() => {
  const list = [...errors.value]
  childStates.forEach(state => list.push(...state.errors))
  return list
})
const mergedWarnings = computed(() => {
  const list = [...warnings.value]
  childStates.forEach(state => list.push(...state.warnings))
  return list
})
const mergedValidating = computed(() => meta.validating || [...childStates.values()].some(state => state.validating))

const mergedStatus = computed<ValidateStatus>(() => {
  if (props.validateStatus !== undefined)
    return props.validateStatus
  if (mergedValidating.value)
    return 'validating'
  if (mergedErrors.value.length)
    return 'error'
  if (mergedWarnings.value.length)
    return 'warning'
  if (props.hasFeedback && meta.validated)
    return 'success'
  return ''
})

const inputContext: FormItemInputContext = {
  status: mergedStatus,
  id: fieldId,
  onFieldChange,
  onFieldBlur,
  isFormItemInput: true,
}
provide(formItemInputContextKey, inputContext)

// ---------- registration ----------
const entity: FormFieldEntity = {
  namePath: () => namePath.value,
  rules: getMergedRules,
  validateRules: validateRulesInner,
  clearValidate,
  resetField,
  getMeta: (): FormFieldMeta => ({ ...meta, errors: errors.value, warnings: warnings.value }),
  setFieldState: (state) => {
    validateId += 1
    if (state.errors)
      errors.value = state.errors
    if (state.warnings)
      warnings.value = state.warnings
    if (state.touched !== undefined)
      meta.touched = state.touched
    if (state.validating !== undefined)
      meta.validating = state.validating
    if (state.validated !== undefined)
      meta.validated = state.validated
  },
  getElement: () => rootRef.value ?? (fieldId.value && typeof document !== 'undefined' ? document.getElementById(fieldId.value) ?? undefined : undefined),
  getId: () => fieldId.value,
}
form?.addField(entity)

onBeforeUnmount(() => {
  unmounted = true
  validateId += 1
  cancelDebounce?.()
  form?.removeField(entity)
  parentItem?.remove(itemKey)
})

// ---------- render ----------
const mergedLayout = computed(() => props.layout ?? form?.props.layout ?? 'horizontal')
const mergedLabelAlign = computed(() => {
  const align = props.labelAlign ?? form?.props.labelAlign ?? 'start'
  return align === 'right' || align === 'end' ? 'end' : 'start'
})
const mergedContentAlign = computed(() => props.contentAlign ?? form?.props.contentAlign ?? 'start')
const mergedColon = computed(() => (props.colon ?? form?.props.colon ?? false) && mergedLayout.value === 'horizontal')
const mergedLabelWidth = computed(() => addUnit(props.labelWidth ?? form?.props.labelWidth))
const requiredMark = computed(() => form?.props.requiredMark ?? true)

const isRenderable = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''
const hasLabel = computed(() => !!slots.label || isRenderable(props.label))
const hasHelp = computed(() => !!slots.help || isRenderable(props.help))
const hasExtra = computed(() => !!slots.extra || isRenderable(props.extra))
// `<am-form-item arrow>` may be cast to `''` or `true` depending on the declared type order
const showArrow = computed(() => !!slots.arrow || (props.arrow === '' ? true : !!(props.arrow ?? props.clickable)))
const customArrow = computed(() => (props.arrow === true || props.arrow === '' || props.arrow === undefined ? undefined : props.arrow))
const showExplain = computed(() => hasHelp.value || mergedErrors.value.length > 0 || mergedWarnings.value.length > 0)

const feedbackIcon = computed(() => {
  if (!props.hasFeedback)
    return undefined
  switch (mergedStatus.value) {
    case 'success': return CheckCircleFilled
    case 'error': return CloseCircleFilled
    case 'warning': return ExclamationCircleFilled
    case 'validating': return LoadingOutlined
    default: return undefined
  }
})

const classNames = computed(() => [
  'am-form-item',
  `am-form-item-${mergedLayout.value}`,
  {
    'am-form-item-standalone': !form,
    'am-form-item-hidden': props.hidden,
    'am-form-item-required': isRequired.value,
    'am-form-item-clickable': props.clickable && !formDisabled.value,
    'am-form-item-label-wrap': form?.props.labelWrap,
    'am-form-item-content-end': mergedContentAlign.value === 'end',
    'am-form-item-has-feedback': props.hasFeedback,
    [`am-form-item-has-${mergedStatus.value}`]: !!mergedStatus.value,
  },
  form?.props.classes?.item,
  props.rootClass,
  props.classes?.root,
])

function handleClick(event: MouseEvent) {
  if (props.clickable && formDisabled.value)
    return
  emit('click', event)
}

const instance: FormItemInstance = {
  validate: options => validateRulesInner(options).then(() => {}),
  clearValidate,
  resetField,
  get nativeElement() {
    return rootRef.value
  },
}
defineExpose(instance)
</script>

<template>
  <slot v-if="noStyle" />
  <div
    v-else
    ref="rootRef"
    v-bind="$attrs"
    :class="classNames"
    :style="[form?.props.styles?.item, styles?.root]"
    @click="handleClick"
  >
    <div
      v-if="hasLabel"
      class="am-form-item-label"
      :class="[{ 'am-form-item-label-end': mergedLabelAlign === 'end' }, form?.props.classes?.label, classes?.label]"
      :style="[mergedLayout === 'horizontal' && mergedLabelWidth ? { width: mergedLabelWidth } : undefined, form?.props.styles?.label, styles?.label]"
    >
      <label :for="fieldId" :class="{ 'am-form-item-colon': mergedColon }">
        <span v-if="isRequired && requiredMark === true" class="am-form-item-required-mark" aria-hidden="true">*</span>
        <span class="am-form-item-label-text">
          <slot name="label">
            <RenderNode :node="label" />
          </slot>
        </span>
        <span v-if="!isRequired && requiredMark === 'optional'" class="am-form-item-optional">{{ locale.optional }}</span>
      </label>
    </div>
    <div class="am-form-item-control">
      <div class="am-form-item-control-input">
        <div class="am-form-item-content" :class="[form?.props.classes?.content, classes?.content]" :style="[form?.props.styles?.content, styles?.content]">
          <slot />
        </div>
        <span v-if="feedbackIcon" class="am-form-item-feedback-icon">
          <component :is="feedbackIcon" :class="{ 'am-spin-icon': mergedStatus === 'validating' }" />
        </span>
        <span v-if="showArrow" class="am-form-item-arrow">
          <slot name="arrow">
            <RenderNode v-if="customArrow !== undefined" :node="customArrow" />
            <RightOutlined v-else />
          </slot>
        </span>
      </div>
      <div
        v-if="showExplain"
        class="am-form-item-explain"
        :class="[form?.props.classes?.help, classes?.help]"
        :style="[form?.props.styles?.help, styles?.help]"
        role="alert"
      >
        <slot v-if="hasHelp" name="help">
          <RenderNode :node="help" />
        </slot>
        <template v-else>
          <div v-for="(error, index) in mergedErrors" :key="`error-${index}`" class="am-form-item-explain-error">
            {{ error }}
          </div>
          <div v-for="(warning, index) in mergedWarnings" :key="`warning-${index}`" class="am-form-item-explain-warning">
            {{ warning }}
          </div>
        </template>
      </div>
      <div
        v-if="hasExtra"
        class="am-form-item-extra"
        :class="[form?.props.classes?.extra, classes?.extra]"
        :style="[form?.props.styles?.extra, styles?.extra]"
      >
        <slot name="extra">
          <RenderNode :node="extra" />
        </slot>
      </div>
    </div>
  </div>
</template>
