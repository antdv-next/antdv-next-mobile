<script setup lang="ts">
import type { CheckboxGroupEmits, CheckboxGroupProps, CheckboxGroupSlots, CheckboxOptionType } from './interface'
import { computed, provide } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled } from '../config-provider/context'
import { useFormItemInputContext } from '../form/context'
import Checkbox from './Checkbox.vue'
import { checkboxGroupContextKey } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCheckboxGroup', inheritAttrs: false })

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  disabled: undefined,
  block: undefined,
  role: 'group',
})
const emit = defineEmits<CheckboxGroupEmits>()
const slots = defineSlots<CheckboxGroupSlots>()

const formItem = useFormItemInputContext()
const disabled = useDisabled(() => props.disabled)

const [value, setValue] = useControlled<CheckboxGroupProps, 'value', any[]>(props, 'value', {
  defaultValue: () => props.defaultValue ?? [],
  onChange: (val) => {
    emit('update:value', val)
    emit('change', val)
  },
})

const mergedOptions = computed<CheckboxOptionType[]>(() =>
  (props.options ?? []).map(option =>
    typeof option === 'string' || typeof option === 'number' ? { label: option, value: option } : option,
  ),
)

// values of the mounted checkboxes, in mount order (used to keep the emitted array stable)
const registered: any[] = []

function toggle(optionValue: any) {
  const current = value.value ?? []
  const index = current.indexOf(optionValue)
  const next = [...current]
  if (index === -1)
    next.push(optionValue)
  else
    next.splice(index, 1)

  const order = mergedOptions.value.length ? mergedOptions.value.map(o => o.value) : registered
  const sorted = next
    .filter(v => order.includes(v))
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
  // values that do not belong to any rendered item are kept in front, like antdv-next
  setValue([...next.filter(v => !order.includes(v)), ...sorted])
  formItem.onFieldChange()
}

provide(checkboxGroupContextKey, {
  value: computed(() => value.value ?? []),
  disabled,
  name: computed(() => props.name),
  block: computed(() => props.block),
  shape: computed(() => props.shape),
  isFull: computed(() => props.max !== undefined && (value.value ?? []).length >= props.max),
  classes: computed(() => props.classes),
  styles: computed(() => props.styles),
  iconSlot: () => slots.icon,
  toggle,
  register: (val) => {
    if (!registered.includes(val))
      registered.push(val)
  },
  unregister: (val) => {
    const index = registered.indexOf(val)
    if (index !== -1)
      registered.splice(index, 1)
  },
})

const classNames = computed(() => [
  'am-checkbox-group',
  {
    'am-checkbox-group-block': props.block,
    'am-checkbox-group-disabled': disabled.value,
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div
    v-bind="$attrs"
    :id="formItem.id.value"
    :class="classNames"
    :style="styles?.root"
    :role="role"
    :aria-disabled="disabled || undefined"
  >
    <template v-if="mergedOptions.length">
      <Checkbox
        v-for="(option, index) in mergedOptions"
        :id="option.id"
        :key="`${typeof option.value}-${option.value}`"
        :value="option.value"
        :disabled="option.disabled"
        :title="option.title"
        :required="option.required"
        :class="option.class"
        :style="option.style"
      >
        <slot name="labelRender" :item="option" :index="index">
          <RenderNode v-if="labelRender" :node="labelRender" :params="{ item: option, index }" />
          <RenderNode v-else :node="option.label" />
        </slot>
      </Checkbox>
    </template>
    <slot v-else />
  </div>
</template>
