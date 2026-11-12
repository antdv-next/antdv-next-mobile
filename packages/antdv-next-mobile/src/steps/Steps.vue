<script setup lang="ts">
import type { StepsEmits, StepsItem, StepsProps, StepsSlots, StepsStatus } from './interface'
import { CheckOutlined, CloseOutlined } from '@antdv-next/icons'
import { computed, getCurrentInstance } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useSize } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSteps', inheritAttrs: false })

const props = withDefaults(defineProps<StepsProps>(), {
  items: () => [],
  initial: 0,
  status: 'process',
  type: 'default',
  progressDot: false,
})
const emit = defineEmits<StepsEmits>()
defineSlots<StepsSlots>()

const instance = getCurrentInstance()
const contextSize = useSize(() => undefined)

const [current, setCurrent] = useControlled<StepsProps, 'current', number>(props, 'current', {
  defaultValue: 0,
  onChange: (value) => {
    emit('update:current', value)
    emit('change', value)
  },
})

const orientation = computed(() => props.orientation ?? props.direction ?? 'horizontal')
const isDot = computed(() => props.type === 'dot' || props.progressDot)
const titlePlacement = computed(() => {
  if (orientation.value === 'vertical')
    return 'horizontal'
  // dots always put the title below, like antdv-next
  return isDot.value ? 'vertical' : props.titlePlacement ?? props.labelPlacement ?? 'vertical'
})
const isSmall = computed(() => (props.size ? props.size === 'small' : contextSize.value === 'small'))

/** Steps are clickable only when someone listens to `change` (same as antdv-next). */
function isClickable() {
  const vnodeProps = instance?.vnode.props
  return !!(vnodeProps?.onChange || vnodeProps?.['onUpdate:current'])
}

const hasNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''

function getStatus(item: StepsItem, index: number): StepsStatus {
  if (item.status)
    return item.status
  const stepNumber = props.initial + index
  if (stepNumber === current.value)
    return props.status
  return stepNumber < current.value ? 'finish' : 'wait'
}

function handleClick(item: StepsItem, index: number) {
  const stepNumber = props.initial + index
  if (!isClickable() || item.disabled || stepNumber === current.value)
    return
  setCurrent(stepNumber)
}

const classNames = computed(() => [
  'am-steps',
  `am-steps-${orientation.value}`,
  `am-steps-title-${titlePlacement.value}`,
  {
    'am-steps-dot': isDot.value,
    'am-steps-sm': isSmall.value,
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <div
      v-for="(item, index) in items"
      :key="item.key ?? index"
      class="am-steps-item"
      :class="[
        `am-steps-item-${getStatus(item, index)}`,
        {
          'am-steps-item-active': initial + index === current,
          'am-steps-item-disabled': item.disabled,
          'am-steps-item-clickable': isClickable() && !item.disabled && initial + index !== current,
          'am-steps-item-custom': !isDot && (hasNode(item.icon) || !!$slots.iconRender),
        },
        classes?.item,
        item.class,
      ]"
      :style="[styles?.item, item.style]"
      :aria-current="initial + index === current ? 'step' : undefined"
      @click="handleClick(item, index)"
    >
      <div class="am-steps-item-icon" :class="classes?.itemIcon" :style="styles?.itemIcon">
        <slot
          name="iconRender"
          :item="item"
          :index="index"
          :status="getStatus(item, index)"
          :active="initial + index === current"
        >
          <span v-if="isDot" class="am-steps-item-dot" />
          <RenderNode v-else-if="hasNode(item.icon)" :node="item.icon" />
          <CheckOutlined v-else-if="getStatus(item, index) === 'finish'" />
          <CloseOutlined v-else-if="getStatus(item, index) === 'error'" />
          <template v-else>
            {{ initial + index + 1 }}
          </template>
        </slot>
      </div>
      <div class="am-steps-item-section" :class="classes?.itemSection" :style="styles?.itemSection">
        <div class="am-steps-item-header" :class="classes?.itemHeader" :style="styles?.itemHeader">
          <div v-if="hasNode(item.title)" class="am-steps-item-title" :class="classes?.itemTitle" :style="styles?.itemTitle">
            <RenderNode :node="item.title" />
          </div>
          <div v-if="hasNode(item.subTitle)" class="am-steps-item-subtitle" :class="classes?.itemSubtitle" :style="styles?.itemSubtitle">
            <RenderNode :node="item.subTitle" />
          </div>
        </div>
        <div
          v-if="hasNode(item.content ?? item.description)"
          class="am-steps-item-content"
          :class="classes?.itemContent"
          :style="styles?.itemContent"
        >
          <RenderNode :node="item.content ?? item.description" />
        </div>
      </div>
      <div v-if="index < items.length - 1" class="am-steps-item-rail" :class="classes?.itemRail" :style="styles?.itemRail" />
    </div>
  </div>
</template>
