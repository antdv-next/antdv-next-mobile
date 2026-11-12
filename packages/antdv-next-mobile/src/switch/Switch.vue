<script setup lang="ts">
import type { SwitchCheckedValue, SwitchEmits, SwitchProps, SwitchSlots } from './interface'
import { LoadingOutlined } from '@antdv-next/icons'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { isPromise } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import { useFormItemInputContext } from '../form/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSwitch', inheritAttrs: false })

const props = withDefaults(defineProps<SwitchProps>(), {
  checked: undefined,
  defaultChecked: undefined,
  value: undefined,
  defaultValue: undefined,
  checkedValue: undefined,
  unCheckedValue: undefined,
  checkedChildren: undefined,
  unCheckedChildren: undefined,
  disabled: undefined,
  loading: false,
})
const emit = defineEmits<SwitchEmits>()
const slots = defineSlots<SwitchSlots>()

const formItem = useFormItemInputContext()
const contextSize = useSize(() => undefined)
const disabled = useDisabled(() => props.disabled)

const rootRef = ref<HTMLButtonElement | null>(null)

const mergedCheckedValue = computed(() => props.checkedValue ?? true)
const mergedUnCheckedValue = computed(() => props.unCheckedValue ?? false)

// `value` is an alias of `checked` (same as antdv-next)
const controlledValue = computed(() => props.checked ?? props.value)
const innerValue = ref<SwitchCheckedValue>(
  controlledValue.value ?? props.defaultChecked ?? props.defaultValue ?? mergedUnCheckedValue.value,
)
watch(controlledValue, (val) => {
  if (val !== undefined)
    innerValue.value = val
})
const mergedValue = computed(() => controlledValue.value ?? innerValue.value)
const checked = computed(() => mergedValue.value === mergedCheckedValue.value)

// ---------- beforeChange ----------
const pending = ref(false)
let unmounted = false
onBeforeUnmount(() => {
  unmounted = true
})

const mergedLoading = computed(() => props.loading || pending.value)
const mergedDisabled = computed(() => disabled.value || mergedLoading.value)
const isSmall = computed(() => (props.size ?? contextSize.value) === 'small')

function commit(next: SwitchCheckedValue, event: MouseEvent | KeyboardEvent) {
  innerValue.value = next
  emit('update:checked', next)
  emit('update:value', next)
  emit('change', next, event)
  formItem.onFieldChange()
}

function handleClick(event: MouseEvent | KeyboardEvent) {
  if (mergedDisabled.value)
    return
  const next = checked.value ? mergedUnCheckedValue.value : mergedCheckedValue.value
  emit('click', next, event)

  if (!props.beforeChange) {
    commit(next, event)
    return
  }
  let result: ReturnType<NonNullable<SwitchProps['beforeChange']>>
  try {
    result = props.beforeChange(next)
  }
  catch {
    return
  }
  if (isPromise<boolean | void>(result)) {
    pending.value = true
    result
      .then((ok) => {
        if (!unmounted && ok !== false)
          commit(next, event)
      })
      .catch(() => {})
      .finally(() => {
        pending.value = false
      })
  }
  else if (result !== false) {
    commit(next, event)
  }
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
  formItem.onFieldBlur()
}

onMounted(() => {
  if (props.autoFocus)
    rootRef.value?.focus()
})

const hasChildren = computed(
  () =>
    !!slots.checkedChildren
    || !!slots.unCheckedChildren
    || (props.checkedChildren !== undefined && props.checkedChildren !== null && props.checkedChildren !== false)
    || (props.unCheckedChildren !== undefined && props.unCheckedChildren !== null && props.unCheckedChildren !== false),
)

const classNames = computed(() => [
  'am-switch',
  {
    'am-switch-checked': checked.value,
    'am-switch-small': isSmall.value,
    'am-switch-loading': mergedLoading.value,
    'am-switch-disabled': mergedDisabled.value,
  },
  props.rootClass,
  props.classes?.root,
])

defineExpose({
  focus: () => rootRef.value?.focus(),
  blur: () => rootRef.value?.blur(),
  get nativeElement() {
    return rootRef.value
  },
})
</script>

<template>
  <button
    v-bind="$attrs"
    :id="id ?? formItem.id.value"
    ref="rootRef"
    type="button"
    role="switch"
    :class="classNames"
    :style="styles?.root"
    :title="title"
    :tabindex="tabIndex"
    :aria-checked="checked"
    :aria-busy="mergedLoading || undefined"
    :disabled="mergedDisabled"
    @click="handleClick"
    @focus="emit('focus', $event)"
    @blur="handleBlur"
  >
    <span class="am-switch-handle" :class="classes?.indicator" :style="styles?.indicator">
      <LoadingOutlined v-if="mergedLoading" class="am-switch-loading-icon am-spin-icon" />
    </span>
    <span v-if="hasChildren" class="am-switch-inner" :class="classes?.content" :style="styles?.content">
      <span class="am-switch-inner-checked">
        <slot name="checkedChildren"><RenderNode :node="checkedChildren" /></slot>
      </span>
      <span class="am-switch-inner-unchecked">
        <slot name="unCheckedChildren"><RenderNode :node="unCheckedChildren" /></slot>
      </span>
    </span>
  </button>
</template>
