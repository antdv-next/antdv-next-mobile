<script setup lang="ts">
import type { TypographyBaseEmits, TypographyBaseSlots, TypographyTitleLevel, TypographyTitleProps } from './interface'
import { computed } from 'vue'
import TypographyBase from './TypographyBase.vue'

defineOptions({ name: 'AmTypographyTitle' })

const props = withDefaults(defineProps<TypographyTitleProps>(), { level: 1, ellipsis: false, copyable: false })
const emit = defineEmits<TypographyBaseEmits>()
defineSlots<TypographyBaseSlots>()

const mergedLevel = computed<TypographyTitleLevel>(() => ([1, 2, 3, 4, 5].includes(props.level) ? props.level : 1))
</script>

<template>
  <TypographyBase
    v-bind="props"
    kind="title"
    :component="`h${mergedLevel}`" :level="mergedLevel"
    @expand="(expanded, event) => emit('expand', expanded, event)"
    @update:expanded="expanded => emit('update:expanded', expanded)"
    @copy="event => emit('copy', event)"
  >
    <slot />
    <template v-if="$slots.ellipsisSymbol" #ellipsisSymbol="ctx">
      <slot name="ellipsisSymbol" v-bind="ctx" />
    </template>
    <template v-if="$slots.copyIcon" #copyIcon="ctx">
      <slot name="copyIcon" v-bind="ctx" />
    </template>
  </TypographyBase>
</template>
