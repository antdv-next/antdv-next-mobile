import type { Ref } from 'vue'
import type { SizeType } from '../_util/type'
import type { Variant } from '../form/context'
import type { InputFocusOptions, InputStatus } from './interface'
import { computed, nextTick, ref } from 'vue'
import { useControlled } from '../_util/hooks'
import { useDisabled, useSize } from '../config-provider/context'
import { useFormItemInputContext, useMergedStatus, useVariant } from '../form/context'

interface UseInputProps {
  value?: string | number | null
  defaultValue?: string | number
  disabled?: boolean
  readOnly?: boolean
  readonly?: boolean
  size?: SizeType
  status?: InputStatus
  variant?: Variant
  id?: string
}

type InputElement = HTMLInputElement | HTMLTextAreaElement

const toText = (value: unknown) => (value === undefined || value === null ? '' : String(value))

/** A synthetic event whose `target` is the native control, used when the value changes without a native event. */
export function resolveEvent<E extends Event>(event: E, target: InputElement): E {
  return Object.create(event, {
    target: { value: target },
    currentTarget: { value: target },
  })
}

/**
 * Shared logic of Input / TextArea: controlled value, IME composition, focus state,
 * clear, and the FormItem contract.
 */
export function useInput(props: UseInputProps, emit: (event: any, ...args: any[]) => void, elRef: Ref<InputElement | undefined>) {
  const formItem = useFormItemInputContext()
  const disabled = useDisabled(() => props.disabled)
  const size = useSize(() => props.size)
  const status = useMergedStatus(() => props.status)
  const variant = useVariant(() => props.variant)
  const readOnly = computed(() => !!(props.readOnly || props.readonly))
  const fieldId = computed(() => props.id ?? formItem.id.value)

  const [rawValue, setRawValue] = useControlled<UseInputProps, 'value', string | number | null>(props, 'value', {
    defaultValue: () => props.defaultValue ?? '',
    onChange: value => emit('update:value', toText(value)),
  })
  const value = computed(() => toText(rawValue.value))

  const focused = ref(false)
  let composing = false
  // Some browsers fire a trailing `input` right after `compositionend`; it must not be reported twice.
  let justComposed = false

  /** A controlled input whose parent ignored the update must show the prop value again. */
  function syncElement() {
    nextTick(() => {
      const el = elRef.value
      if (el && !composing && el.value !== value.value)
        el.value = value.value
    })
  }

  function commit(next: string, event: Event) {
    if (next !== value.value)
      setRawValue(next)
    emit('input', event)
    emit('change', event)
    formItem.onFieldChange()
    syncElement()
  }

  function handleInput(event: Event) {
    // While an IME composes, the text is not final yet; the value is committed on `compositionend`.
    if (composing || (event as InputEvent).isComposing)
      return
    if (justComposed && (event.target as InputElement).value === value.value)
      return
    commit((event.target as InputElement).value, event)
  }

  function handleCompositionStart(event: CompositionEvent) {
    composing = true
    emit('compositionstart', event)
  }

  function handleCompositionEnd(event: CompositionEvent) {
    composing = false
    emit('compositionend', event)
    commit((event.target as InputElement).value, event)
    justComposed = true
    setTimeout(() => {
      justComposed = false
    })
  }

  function handleFocus(event: FocusEvent) {
    focused.value = true
    emit('focus', event)
  }

  function handleBlur(event: FocusEvent) {
    focused.value = false
    composing = false
    emit('blur', event)
    formItem.onFieldBlur()
  }

  function handleClear(event: Event) {
    const el = elRef.value
    if (el)
      el.value = ''
    if (value.value !== '')
      setRawValue('')
    emit('clear')
    if (el) {
      const synthetic = resolveEvent(event, el)
      emit('input', synthetic)
      emit('change', synthetic)
    }
    formItem.onFieldChange()
    syncElement()
    el?.focus()
  }

  function focus(options?: InputFocusOptions) {
    const el = elRef.value
    if (!el)
      return
    el.focus({ preventScroll: options?.preventScroll })
    const cursor = options?.cursor
    if (!cursor)
      return
    const length = el.value.length
    try {
      if (cursor === 'start')
        el.setSelectionRange(0, 0)
      else if (cursor === 'end')
        el.setSelectionRange(length, length)
      else
        el.setSelectionRange(0, length)
    }
    catch {
      // input types such as `number` / `email` do not support selection ranges
    }
  }

  const blur = () => elRef.value?.blur()
  const select = () => elRef.value?.select()

  return {
    value,
    focused,
    disabled,
    size,
    status,
    variant,
    readOnly,
    fieldId,
    handleInput,
    handleCompositionStart,
    handleCompositionEnd,
    handleFocus,
    handleBlur,
    handleClear,
    focus,
    blur,
    select,
  }
}

/** Counts user-perceived characters (an emoji is one). */
export function countText(text: string) {
  return Array.from(text).length
}
