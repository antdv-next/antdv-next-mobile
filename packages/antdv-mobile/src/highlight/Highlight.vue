<script setup lang="ts">
import type { HighlightProps, HighlightSlots } from './interface'
import { computed } from 'vue'
import { getHighlightChunks } from './utils'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmHighlight', inheritAttrs: false })

const props = withDefaults(defineProps<HighlightProps>(), {
  content: '',
  caseSensitive: false,
  autoEscape: true,
  tag: 'span',
  highlightTag: 'mark',
})
defineSlots<HighlightSlots>()

const chunks = computed(() => getHighlightChunks(props.content, props.keywords, {
  caseSensitive: props.caseSensitive,
  autoEscape: props.autoEscape,
}))

const wrapPlain = computed(() => !!props.unhighlightTag || !!props.unhighlightClass)
</script>

<template>
  <component
    :is="tag"
    v-bind="$attrs"
    class="am-highlight"
    :class="[rootClass, classes?.root]"
    :style="styles?.root"
  >
    <template v-for="chunk in chunks" :key="chunk.start">
      <component
        :is="highlightTag"
        v-if="chunk.highlight"
        class="am-highlight-tag"
        :class="[highlightClass, classes?.highlight]"
        :style="styles?.highlight"
      >
        <slot name="highlight" :text="chunk.text" :index="chunk.index">
          {{ chunk.text }}
        </slot>
      </component>
      <component :is="unhighlightTag || 'span'" v-else-if="wrapPlain" class="am-highlight-text" :class="unhighlightClass">
        {{ chunk.text }}
      </component>
      <template v-else>
        {{ chunk.text }}
      </template>
    </template>
  </component>
</template>
