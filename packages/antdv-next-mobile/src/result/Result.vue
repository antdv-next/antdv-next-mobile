<script setup lang="ts">
import type { ResultProps, ResultSlots } from './interface'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, WarningFilled } from '@antdv-next/icons'
import { computed } from 'vue'
import RenderNode from '../_util/RenderNode'
import ExceptionImage from './ExceptionImage.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmResult', inheritAttrs: false })

const props = withDefaults(defineProps<ResultProps>(), { status: 'info', icon: undefined })
const slots = defineSlots<ResultSlots>()

const iconMap = {
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  info: ExclamationCircleFilled,
  warning: WarningFilled,
}
const exceptionStatus = ['403', '404', '500']

const isNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''
const status = computed(() => String(props.status))
const isException = computed(() => exceptionStatus.includes(status.value))
const hasCustomIcon = computed(() => !!slots.icon || isNode(props.icon))
const showIcon = computed(() => !!slots.icon || (props.icon !== null && props.icon !== false))
const statusIcon = computed(() => iconMap[status.value as keyof typeof iconMap] ?? iconMap.info)

const hasTitle = computed(() => !!slots.title || isNode(props.title))
const hasSubTitle = computed(() => !!slots.subTitle || isNode(props.subTitle))
const hasExtra = computed(() => !!slots.extra || isNode(props.extra))

const classNames = computed(() => [
  'am-result',
  `am-result-${status.value}`,
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <div
      v-if="showIcon"
      class="am-result-icon"
      :class="[{ 'am-result-image': isException && !hasCustomIcon }, classes?.icon]"
      :style="styles?.icon"
    >
      <slot name="icon">
        <RenderNode v-if="hasCustomIcon" :node="icon" />
        <ExceptionImage v-else-if="isException" :status="status" />
        <component :is="statusIcon" v-else />
      </slot>
    </div>
    <div v-if="hasTitle" class="am-result-title" :class="classes?.title" :style="styles?.title">
      <slot name="title">
        <RenderNode :node="title" />
      </slot>
    </div>
    <div v-if="hasSubTitle" class="am-result-subtitle" :class="classes?.subTitle" :style="styles?.subTitle">
      <slot name="subTitle">
        <RenderNode :node="subTitle" />
      </slot>
    </div>
    <div v-if="$slots.default" class="am-result-body" :class="classes?.body" :style="styles?.body">
      <slot />
    </div>
    <div v-if="hasExtra" class="am-result-extra" :class="classes?.extra" :style="styles?.extra">
      <slot name="extra">
        <RenderNode :node="extra" />
      </slot>
    </div>
  </div>
</template>
