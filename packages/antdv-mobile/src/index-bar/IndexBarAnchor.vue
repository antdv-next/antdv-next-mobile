<script setup lang="ts">
import type { IndexBarAnchorRecord } from './context'
import type { IndexBarAnchorProps, IndexBarAnchorSlots } from './interface'
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { indexBarContextKey } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmIndexBarAnchor', inheritAttrs: false })

const props = defineProps<IndexBarAnchorProps>()
defineSlots<IndexBarAnchorSlots>()

const context = inject(indexBarContextKey, undefined)
const sentinelRef = ref<HTMLElement>()

const record: IndexBarAnchorRecord = {
  index: () => props.index,
  el: () => sentinelRef.value,
}

onMounted(() => context?.register(record))
onBeforeUnmount(() => context?.unregister(record))

const active = computed(() => context?.activeIndex.value !== undefined && context.activeIndex.value === props.index)
</script>

<template>
  <div ref="sentinelRef" class="am-index-bar-anchor-sentinel" aria-hidden="true" />
  <div
    v-bind="$attrs"
    class="am-index-bar-anchor"
    :class="[
      {
        'am-index-bar-anchor-sticky': context?.sticky.value,
        'am-index-bar-anchor-active': active,
      },
      rootClass,
    ]"
    :data-index="index"
  >
    <slot>{{ index }}</slot>
  </div>
</template>
