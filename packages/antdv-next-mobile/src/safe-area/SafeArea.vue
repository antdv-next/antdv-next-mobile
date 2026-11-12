<script setup lang="ts">
import type { SafeAreaProps, SafeAreaSlots } from './interface'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSafeArea', inheritAttrs: false })

withDefaults(defineProps<SafeAreaProps>(), { position: 'bottom' })
defineSlots<SafeAreaSlots>()
</script>

<template>
  <div v-bind="$attrs" class="am-safe-area" :class="[`am-safe-area-position-${position}`, rootClass]">
    <slot />
  </div>
</template>
