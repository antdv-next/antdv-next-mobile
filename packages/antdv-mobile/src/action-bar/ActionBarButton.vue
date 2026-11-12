<script setup lang="ts">
import type { ActionBarButtonEmits, ActionBarButtonProps, ActionBarButtonSlots } from './interface'
import Button from '../button/Button.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmActionBarButton', inheritAttrs: false })

withDefaults(defineProps<ActionBarButtonProps>(), {
  type: 'primary',
  icon: undefined,
  disabled: undefined,
  loading: false,
})
const emit = defineEmits<ActionBarButtonEmits>()
defineSlots<ActionBarButtonSlots>()
</script>

<template>
  <Button
    v-bind="$attrs"
    :type="type"
    :color="color"
    :variant="variant"
    :danger="danger"
    :ghost="ghost"
    :icon="icon"
    :icon-placement="iconPlacement"
    :disabled="disabled"
    :loading="loading"
    :href="href"
    :target="target"
    :html-type="htmlType"
    :root-class="rootClass"
    :classes="classes"
    :styles="styles"
    class="am-action-bar-button"
    @click="emit('click', $event)"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </Button>
</template>
