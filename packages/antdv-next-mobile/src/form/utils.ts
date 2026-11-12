import type { ValidateMessages } from '../locale/interface'
import type { FormInternalNamePath, FormNamePath, FormRuleObject } from './interface'
import RawAsyncValidator from '@v-c/async-validator'
import { toArray } from '../_util'

// The original type definitions are stricter than what the library accepts.
const AsyncValidator: any = RawAsyncValidator

export interface FormRuleError {
  errors: string[]
  rule: FormRuleObject
}

export function getNamePath(name?: FormNamePath | null): FormInternalNamePath {
  return toArray(name)
}

export function isSameNamePath(a: FormInternalNamePath, b: FormInternalNamePath) {
  return a.length === b.length && a.every((seg, i) => String(seg) === String(b[i]))
}

export function getValue(store: any, namePath: FormInternalNamePath): any {
  let current = store
  for (let i = 0; i < namePath.length; i += 1) {
    if (current === null || current === undefined)
      return undefined
    current = current[namePath[i]]
  }
  return current
}

/** Sets a value in place (the model is a reactive object owned by the user). */
export function setValue(store: any, namePath: FormInternalNamePath, value: any) {
  if (!store || !namePath.length)
    return
  let current = store
  for (let i = 0; i < namePath.length - 1; i += 1) {
    const key = namePath[i]
    if (current[key] === null || typeof current[key] !== 'object')
      current[key] = typeof namePath[i + 1] === 'number' ? [] : {}
    current = current[key]
  }
  current[namePath[namePath.length - 1]] = value
}

function isPlainObject(value: any): value is Record<string, any> {
  if (value === null || typeof value !== 'object')
    return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/** Deep clone of plain objects / arrays; class instances (Date, dayjs, File ...) are kept by reference. */
export function cloneValue<T>(value: T): T {
  if (Array.isArray(value))
    return value.map(cloneValue) as unknown as T
  if (isPlainObject(value)) {
    const ret: Record<string, any> = {}
    Object.keys(value).forEach((key) => {
      ret[key] = cloneValue(value[key])
    })
    return ret as T
  }
  return value
}

export function isEqualValue(a: any, b: any): boolean {
  if (Object.is(a, b))
    return true
  if (Array.isArray(a) && Array.isArray(b))
    return a.length === b.length && a.every((item, i) => isEqualValue(item, b[i]))
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = Object.keys(a)
    return keys.length === Object.keys(b).length && keys.every(key => isEqualValue(a[key], b[key]))
  }
  return false
}

const illegalIds = ['parentNode', 'tagName', 'nextSibling']

export function getFieldId(namePath: FormInternalNamePath, formName?: string): string | undefined {
  if (!namePath.length)
    return undefined
  const mergedId = namePath.join('_')
  if (formName)
    return `${formName}_${mergedId}`
  return illegalIds.includes(mergedId) ? `form_item_${mergedId}` : mergedId
}

export function mergeMessages(...sources: (ValidateMessages | undefined)[]): ValidateMessages {
  const target: Record<string, any> = {}
  sources.forEach((source) => {
    if (!source)
      return
    Object.keys(source).forEach((key) => {
      const value = (source as Record<string, any>)[key]
      if (value === undefined)
        return
      target[key] = isPlainObject(value) ? { ...target[key], ...value } : value
    })
  })
  return target
}

/** `'${label} is required'` + `{ label: 'Name' }` -> `'Name is required'` */
function replaceMessage(template: string, kv: Record<string, any>): string {
  return template.replace(/\\?\$\{\w+\}/g, (str) => {
    if (str.startsWith('\\'))
      return str.slice(1)
    const key = str.slice(2, -1)
    return kv[key] === undefined || kv[key] === null ? '' : String(kv[key])
  })
}

const CODE_LOGIC_ERROR = 'CODE_LOGIC_ERROR'

async function validateRule(
  name: string,
  value: any,
  rule: FormRuleObject,
  messages: ValidateMessages,
  messageVariables?: Record<string, string>,
): Promise<string[]> {
  const cloneRule: Record<string, any> = { ...rule }
  delete cloneRule.ruleIndex
  delete cloneRule.trigger
  delete cloneRule.validateTrigger

  AsyncValidator.warning = () => {}

  if (cloneRule.validator) {
    const originValidator = cloneRule.validator
    cloneRule.validator = (...args: any[]) => {
      try {
        return originValidator(...args)
      }
      catch (error) {
        console.error(error)
        return Promise.reject(CODE_LOGIC_ERROR)
      }
    }
  }

  let subRuleField: FormRuleObject | null = null
  if (cloneRule.type === 'array' && cloneRule.defaultField) {
    subRuleField = cloneRule.defaultField
    delete cloneRule.defaultField
  }

  const validator = new AsyncValidator({ [name]: [cloneRule] })
  validator.messages(messages)

  let result: string[] = []
  try {
    await Promise.resolve(validator.validate({ [name]: value }, {}))
  }
  catch (errObj: any) {
    if (errObj?.errors) {
      result = errObj.errors.map(({ message }: { message: any }) => {
        const merged = message === CODE_LOGIC_ERROR ? messages.default : message
        return typeof merged === 'string' ? merged : String(merged?.message ?? merged ?? '')
      })
    }
  }

  if (!result.length && subRuleField && Array.isArray(value) && value.length > 0) {
    const subResults = await Promise.all(
      value.map((subValue, i) => validateRule(`${name}.${i}`, subValue, subRuleField!, messages, messageVariables)),
    )
    return subResults.reduce((prev, errors) => [...prev, ...errors], [])
  }

  const kv = {
    ...rule,
    name,
    label: messageVariables?.label || name,
    enum: (rule.enum || []).join(', '),
    ...messageVariables,
  }
  return result.map(error => replaceMessage(error, kv))
}

/**
 * Validates one value against its rules with `@v-c/async-validator` (one rule at a time,
 * so every rule reports its own message). Resolves with `[]`, rejects with the rule errors.
 */
export function validateRules(
  namePath: FormInternalNamePath,
  value: any,
  rules: FormRuleObject[],
  messages: ValidateMessages,
  validateFirst: boolean | 'parallel',
  messageVariables?: Record<string, string>,
): Promise<FormRuleError[]> {
  const name = namePath.join('.')

  const filledRules = rules
    .map((currentRule, ruleIndex) => {
      const originValidator = currentRule.validator
      const cloneRule: FormRuleObject & { ruleIndex: number } = { ...currentRule, ruleIndex }
      if (originValidator) {
        cloneRule.validator = (rule, val, callback) => {
          let hasPromise = false
          // The callback style is only honoured when no promise is returned.
          const wrappedCallback = (...args: any[]) => {
            Promise.resolve().then(() => {
              if (!hasPromise)
                (callback as any)(...args)
            })
          }
          const promise = originValidator(rule, val, wrappedCallback)
          hasPromise = !!promise && typeof promise.then === 'function' && typeof promise.catch === 'function'
          if (hasPromise) {
            (promise as Promise<void>)
              .then(() => callback())
              .catch((err: any) => callback(typeof err === 'string' ? err || ' ' : err?.message || ' '))
          }
        }
      }
      return cloneRule
    })
    .sort((a, b) => {
      if (!!a.warningOnly === !!b.warningOnly)
        return a.ruleIndex - b.ruleIndex
      return a.warningOnly ? 1 : -1
    })

  let summaryPromise: Promise<FormRuleError[]>

  if (validateFirst === true) {
    summaryPromise = (async () => {
      for (let i = 0; i < filledRules.length; i += 1) {
        const rule = filledRules[i]
        const errors = await validateRule(name, value, rule, messages, messageVariables)
        if (errors.length)
          // eslint-disable-next-line no-throw-literal
          throw [{ errors, rule }]
      }
      return []
    })()
  }
  else {
    const rulePromises = filledRules.map(rule =>
      validateRule(name, value, rule, messages, messageVariables).then(errors => ({ errors, rule })),
    )
    summaryPromise = (validateFirst ? finishOnFirstFailed(rulePromises) : Promise.all(rulePromises))
      .then((errors): Promise<FormRuleError[]> => Promise.reject(errors))
  }

  // Avoid unhandled rejection logs, callers attach their own handlers.
  summaryPromise.catch(e => e)
  return summaryPromise
}

function finishOnFirstFailed(rulePromises: Promise<FormRuleError>[]): Promise<FormRuleError[]> {
  let count = 0
  return new Promise((resolve) => {
    if (!rulePromises.length)
      resolve([])
    rulePromises.forEach((promise) => {
      promise.then((ruleError) => {
        if (ruleError.errors.length)
          resolve([ruleError])
        count += 1
        if (count === rulePromises.length)
          resolve([])
      })
    })
  })
}

/** Resolves when every promise resolved, rejects (after all settled) with every result otherwise. */
export function allPromiseFinish<T>(promiseList: Promise<T>[]): Promise<T[]> {
  let hasError = false
  let count = promiseList.length
  const results: T[] = []
  if (!promiseList.length)
    return Promise.resolve([])
  return new Promise((resolve, reject) => {
    promiseList.forEach((promise, index) => {
      promise
        .catch((e) => {
          hasError = true
          return e
        })
        .then((result) => {
          count -= 1
          results[index] = result
          if (count > 0)
            return
          if (hasError)
            reject(results)
          resolve(results)
        })
    })
  })
}
