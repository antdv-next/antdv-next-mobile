<script setup lang="ts">
import type { TourButtonInfo, TourButtonProps, TourType } from './interface'
import { computed } from 'vue'
import { isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import Button from '../button/Button.vue'
import { useLocale } from '../locale'

defineOptions({ name: 'AmTourActions', inheritAttrs: false })

const props = defineProps<{
  current: number
  total: number
  type?: TourType
  prevButtonProps?: TourButtonProps
  nextButtonProps?: TourButtonProps
}>()
const emit = defineEmits<{
  prev: [event: MouseEvent]
  next: [event: MouseEvent]
}>()
defineSlots<{
  prevButton?: (props: TourButtonInfo) => any
  nextButton?: (props: TourButtonInfo) => any
}>()

const locale = useLocale('Tour')

const info = computed<TourButtonInfo>(() => ({
  current: props.current,
  isFirst: props.current === 0,
  isLast: props.current === props.total - 1,
}))

const prevText = computed(() => (isRenderable(props.prevButtonProps?.children) ? props.prevButtonProps!.children : locale.value.prev))
const nextText = computed(() => {
  if (isRenderable(props.nextButtonProps?.children))
    return props.nextButtonProps!.children
  return info.value.isLast ? locale.value.finish : locale.value.next
})
</script>

<template>
  <Button
    v-if="!info.isFirst"
    size="small"
    type="default"
    :ghost="type === 'primary'"
    class="am-tour-prev-btn"
    :class="prevButtonProps?.class"
    :style="prevButtonProps?.style"
    @click="emit('prev', $event)"
  >
    <slot name="prevButton" v-bind="info">
      <RenderNode :node="prevText" />
    </slot>
  </Button>
  <Button
    size="small"
    type="primary"
    class="am-tour-next-btn"
    :class="nextButtonProps?.class"
    :style="nextButtonProps?.style"
    @click="emit('next', $event)"
  >
    <slot name="nextButton" v-bind="info">
      <RenderNode :node="nextText" />
    </slot>
  </Button>
</template>
