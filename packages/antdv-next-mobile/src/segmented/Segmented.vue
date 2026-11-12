<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { SegmentedEmits, SegmentedLabeledOption, SegmentedProps, SegmentedSlots, SegmentedValue } from './interface'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { doubleRaf } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSegmented', inheritAttrs: false })

const props = withDefaults(defineProps<SegmentedProps>(), {
  options: () => [],
  block: false,
  disabled: undefined,
  shape: 'default',
  vertical: undefined,
})
const emit = defineEmits<SegmentedEmits>()
const slots = defineSlots<SegmentedSlots>()

const size = useSize(() => props.size)
const disabled = useDisabled(() => props.disabled)

const options = computed<SegmentedLabeledOption[]>(() =>
  props.options.map(option => (typeof option === 'object' && option !== null ? option : { label: option, value: option })),
)

const [value, setValue] = useControlled<SegmentedProps, 'value', SegmentedValue | undefined>(props, 'value', {
  defaultValue: () => props.defaultValue ?? options.value[0]?.value,
  onChange: (val) => {
    emit('update:value', val as SegmentedValue)
    emit('change', val as SegmentedValue)
  },
})

const selectedIndex = computed(() => options.value.findIndex(option => option.value === value.value))
const vertical = computed(() => (props.orientation ? props.orientation === 'vertical' : !!props.vertical))

const hasNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''
const hasIcon = (option: SegmentedLabeledOption) => !!slots.iconRender || hasNode(option.icon)
const hasLabel = (option: SegmentedLabeledOption) => !!slots.labelRender || hasNode(option.label)

function handleSelect(option: SegmentedLabeledOption) {
  if (disabled.value || option.disabled || option.value === value.value)
    return
  setValue(option.value)
}

// ---------- sliding thumb ----------
const groupRef = ref<HTMLElement>()
const thumbStyle = ref<CSSProperties>()
const thumbAnimated = ref(false)

function updateThumb() {
  const item = selectedIndex.value > -1
    ? groupRef.value?.querySelectorAll<HTMLElement>(':scope > .am-segmented-item')[selectedIndex.value]
    : undefined
  // nothing measurable (SSR / hidden): the selected item paints its own background instead
  if (!item || !item.offsetWidth) {
    thumbStyle.value = undefined
    return
  }
  thumbStyle.value = {
    width: `${item.offsetWidth}px`,
    height: `${item.offsetHeight}px`,
    transform: `translate3d(${item.offsetLeft}px, ${item.offsetTop}px, 0)`,
  }
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  updateThumb()
  doubleRaf(() => {
    thumbAnimated.value = true
  })
  if (typeof ResizeObserver !== 'undefined' && groupRef.value) {
    resizeObserver = new ResizeObserver(() => updateThumb())
    resizeObserver.observe(groupRef.value)
  }
})
onBeforeUnmount(() => resizeObserver?.disconnect())

watch(
  () => [value.value, options.value, size.value, vertical.value, props.block, props.shape],
  () => nextTick(updateThumb),
  { flush: 'post' },
)

const classNames = computed(() => [
  'am-segmented',
  {
    'am-segmented-sm': size.value === 'small',
    'am-segmented-lg': size.value === 'large',
    'am-segmented-block': props.block,
    'am-segmented-round': props.shape === 'round',
    'am-segmented-vertical': vertical.value,
    'am-segmented-disabled': disabled.value,
    'am-segmented-with-thumb': !!thumbStyle.value,
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div
    v-bind="$attrs"
    :class="classNames"
    :style="styles?.root"
    role="radiogroup"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
    :aria-disabled="disabled || undefined"
  >
    <div ref="groupRef" class="am-segmented-group">
      <div
        v-if="thumbStyle"
        class="am-segmented-thumb"
        :class="{ 'am-segmented-thumb-animated': thumbAnimated }"
        :style="thumbStyle"
      />
      <div
        v-for="(option, index) in options"
        :key="option.value"
        class="am-segmented-item"
        :class="[
          {
            'am-segmented-item-selected': index === selectedIndex,
            'am-segmented-item-disabled': disabled || option.disabled,
          },
          classes?.item,
          option.className,
        ]"
        :style="styles?.item"
        role="radio"
        :tabindex="disabled || option.disabled ? -1 : 0"
        :aria-checked="index === selectedIndex"
        :aria-disabled="disabled || option.disabled || undefined"
        @click="handleSelect(option)"
        @keydown.enter="handleSelect(option)"
      >
        <span v-if="hasIcon(option)" class="am-segmented-item-icon" :class="classes?.icon" :style="styles?.icon">
          <slot name="iconRender" v-bind="option">
            <RenderNode :node="option.icon" />
          </slot>
        </span>
        <span v-if="hasLabel(option)" class="am-segmented-item-label" :class="classes?.label" :style="styles?.label">
          <slot name="labelRender" v-bind="option">
            <RenderNode :node="option.label" />
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>
