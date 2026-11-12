<script setup lang="ts">
import type { RadioButtonProps, RadioButtonSlots, RadioEmits } from './interface'
import { ref } from 'vue'
import Radio from './Radio.vue'

defineOptions({ name: 'AmRadioButton', inheritAttrs: false })

const props = withDefaults(defineProps<RadioButtonProps>(), {
  checked: undefined,
  defaultChecked: undefined,
  disabled: undefined,
})
const emit = defineEmits<RadioEmits>()
defineSlots<RadioButtonSlots>()

const radioRef = ref<InstanceType<typeof Radio> | null>(null)

defineExpose({
  focus: () => radioRef.value?.focus(),
  blur: () => radioRef.value?.blur(),
  get input() {
    return radioRef.value?.input ?? null
  },
  get nativeElement() {
    return radioRef.value?.nativeElement ?? null
  },
})
</script>

<template>
  <Radio
    v-bind="{ ...$attrs, ...props }"
    ref="radioRef"
    option-type="button"
    @change="emit('change', $event)"
    @update:checked="emit('update:checked', $event)"
    @click="emit('click', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <slot />
  </Radio>
</template>
