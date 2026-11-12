<script setup lang="ts">
import type { TypographyBaseEmits, TypographyBaseSlots, TypographyParagraphProps } from './interface'
import TypographyBase from './TypographyBase.vue'

defineOptions({ name: 'AmTypographyParagraph' })

const props = withDefaults(defineProps<TypographyParagraphProps>(), { ellipsis: false, copyable: false })
const emit = defineEmits<TypographyBaseEmits>()
defineSlots<TypographyBaseSlots>()
</script>

<template>
  <TypographyBase
    v-bind="props"
    kind="paragraph"
    component="div"
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
