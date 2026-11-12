<script setup lang="ts">
import type { InputFocusOptions, InputInstance, InputPasswordEmits, InputPasswordProps, InputPasswordSlots } from './interface'
import { EyeInvisibleOutlined, EyeOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'
import { isRenderable } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled } from '../config-provider/context'
import Input from './Input.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmInputPassword', inheritAttrs: false })

const props = withDefaults(defineProps<InputPasswordProps>(), {
  value: undefined,
  disabled: undefined,
  showCount: false,
  allowClear: false,
  clearTrigger: 'focus',
  prefix: undefined,
  suffix: undefined,
  visibilityToggle: true,
  iconVisible: undefined,
})
const emit = defineEmits<InputPasswordEmits>()
const slots = defineSlots<InputPasswordSlots>()

const disabled = useDisabled(() => props.disabled)
const rootRef = ref<InputInstance>()

const [visible, setVisible] = useControlled(props, 'iconVisible', {
  defaultValue: false,
  onChange: next => emit('update:iconVisible', next),
})

function toggle() {
  if (disabled.value)
    return
  setVisible(!visible.value)
}

const hasSuffix = computed(() => props.visibilityToggle || !!slots.suffix || isRenderable(props.suffix))

defineExpose({
  focus: (options?: InputFocusOptions) => rootRef.value?.focus(options),
  blur: () => rootRef.value?.blur(),
  select: () => rootRef.value?.select(),
  get input() {
    return rootRef.value?.input
  },
  get nativeElement() {
    return rootRef.value?.nativeElement
  },
})
</script>

<template>
  <Input
    v-bind="$attrs"
    :id="id"
    ref="rootRef"
    class="am-input-password"
    :root-class="rootClass"
    :classes="classes"
    :styles="styles"
    :type="visible ? 'text' : 'password'"
    :value="value"
    :default-value="defaultValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :read-only="readOnly || readonly"
    :maxlength="maxlength"
    :show-count="showCount"
    :allow-clear="allowClear"
    :clear-trigger="clearTrigger"
    :prefix="prefix"
    :size="size"
    :status="status"
    :variant="variant"
    :inputmode="inputmode"
    :enterkeyhint="enterkeyhint"
    :autofocus="autofocus"
    :autocomplete="autocomplete"
    :name="name"
    :align="align"
    @update:value="emit('update:value', $event)"
    @change="emit('change', $event)"
    @input="emit('input', $event)"
    @press-enter="emit('pressEnter', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @clear="emit('clear')"
  >
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.clearIcon" #clearIcon>
      <slot name="clearIcon" />
    </template>
    <template v-if="hasSuffix" #suffix>
      <span
        v-if="visibilityToggle"
        class="am-input-password-icon"
        role="button"
        :tabindex="disabled ? -1 : 0"
        :aria-pressed="visible"
        :aria-disabled="disabled || undefined"
        @mousedown.prevent
        @click.stop="toggle"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent="toggle"
      >
        <slot name="iconRender" :visible="visible">
          <RenderNode v-if="iconRender" :node="iconRender" :params="{ visible }" />
          <EyeOutlined v-else-if="visible" />
          <EyeInvisibleOutlined v-else />
        </slot>
      </span>
      <slot name="suffix">
        <RenderNode :node="suffix" />
      </slot>
    </template>
  </Input>
</template>
