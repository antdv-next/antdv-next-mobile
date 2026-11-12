import { watch } from 'vue'
import { useControlled } from '../_util/hooks'
import { useDisabled } from '../config-provider/context'
import { useFormItemInputContext } from '../form/context'

export interface PickerFieldStateProps {
  open?: boolean
  defaultOpen?: boolean
  disabled?: boolean
}

/**
 * Open state + form-item wiring shared by every picker field.
 *
 * - `open` / `defaultOpen` controlled & uncontrolled, `onOpenChange` emits `update:open` + `openChange`.
 * - `commit()` notifies the wrapping FormItem that the value changed.
 * - closing the popup counts as the field's blur.
 */
export function usePickerField(props: PickerFieldStateProps, onOpenChange: (open: boolean) => void) {
  const disabled = useDisabled(() => props.disabled)
  const formItem = useFormItemInputContext()

  const [open, setOpenState] = useControlled<PickerFieldStateProps, 'open', boolean>(props, 'open', {
    defaultValue: () => !!props.defaultOpen,
    onChange: onOpenChange,
  })

  function setOpen(next: boolean) {
    if (next === open.value || (next && disabled.value))
      return
    setOpenState(next)
  }

  function toggle(next?: boolean) {
    setOpen(typeof next === 'boolean' ? next : !open.value)
  }

  watch(open, (value, prev) => {
    if (!value && prev)
      formItem.onFieldBlur()
  })

  return {
    open,
    setOpen,
    toggle,
    disabled,
    /** call after the committed value changed */
    commit: () => formItem.onFieldChange(),
  }
}
