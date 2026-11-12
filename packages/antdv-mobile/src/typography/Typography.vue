<script setup lang="ts">
import type { TypographyProps, TypographySlots } from './interface'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmTypography', inheritAttrs: false })

withDefaults(defineProps<TypographyProps>(), { component: 'article' })
defineSlots<TypographySlots>()
</script>

<template>
  <component :is="component" v-bind="$attrs" class="am-typography" :class="rootClass">
    <slot />
  </component>
</template>
