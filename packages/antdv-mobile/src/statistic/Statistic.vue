<script setup lang="ts">
import type { StatisticEmits, StatisticProps, StatisticSlots } from './interface'
import { computed } from 'vue'
import { isNumeric, isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useCountTo } from '../hooks/timer'
import Skeleton from '../skeleton'
import { formatNumber } from './utils'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmStatistic', inheritAttrs: false })

const props = withDefaults(defineProps<StatisticProps>(), {
  value: 0,
  groupSeparator: ',',
  decimalSeparator: '.',
  loading: false,
  animation: false,
})
const emit = defineEmits<StatisticEmits>()
const slots = defineSlots<StatisticSlots>()

const hasTitle = computed(() => !!slots.title || isRenderable(props.title))
const hasPrefix = computed(() => !!slots.prefix || isRenderable(props.prefix))
const hasSuffix = computed(() => !!slots.suffix || isRenderable(props.suffix))

const formatConfig = computed(() => ({
  groupSeparator: props.groupSeparator,
  decimalSeparator: props.decimalSeparator,
  precision: props.precision,
}))

// ---------- number animation ----------
const animatable = computed(() => !!props.animation && isNumeric(props.value))
const animationConfig = computed(() => (typeof props.animation === 'object' ? props.animation : {}))
const counter = useCountTo(() => (isNumeric(props.value) ? Number(props.value) : 0), {
  duration: () => animationConfig.value.duration,
  from: animationConfig.value.from,
  easing: progress => (animationConfig.value.easing ? animationConfig.value.easing(progress) : 1 - (1 - progress) ** 3),
  disabled: () => !animatable.value,
  onFinish: () => emit('animationEnd'),
})
/** the running number keeps the decimals of the target so the width does not jump */
const decimals = computed(() => props.precision ?? (String(props.value).split('.')[1]?.length ?? 0))
const animating = computed(() => animatable.value && counter.isActive.value)
/** what is formatted: the exact `value` unless an animation is running */
const displayText = computed(() => (animating.value ? counter.current.value.toFixed(Math.max(decimals.value, 0)) : props.value))
/** what `formatter` receives: stays a number when `value` is one */
const displayValue = computed(() => (animating.value && typeof props.value === 'number' ? Number(displayText.value) : displayText.value))
const formatted = computed(() => formatNumber(displayText.value, formatConfig.value))
</script>

<template>
  <div v-bind="$attrs" class="am-statistic" :class="[rootClass, classes?.root]" :style="styles?.root">
    <div v-if="hasTitle" class="am-statistic-header" :class="classes?.header" :style="styles?.header">
      <div class="am-statistic-title" :class="classes?.title" :style="styles?.title">
        <slot name="title">
          <RenderNode :node="title" />
        </slot>
      </div>
    </div>
    <Skeleton :paragraph="false" :loading="loading" active class="am-statistic-skeleton">
      <div class="am-statistic-content" :class="classes?.content" :style="[valueStyle, styles?.content]">
        <span v-if="hasPrefix" class="am-statistic-content-prefix" :class="classes?.prefix" :style="styles?.prefix">
          <slot name="prefix">
            <RenderNode :node="prefix" />
          </slot>
        </span>
        <span class="am-statistic-content-value" :class="classes?.value" :style="styles?.value">
          <slot name="formatter" :value="displayValue">
            <RenderNode v-if="formatter" :node="formatter(displayValue, formatConfig)" />
            <template v-else>
              <span class="am-statistic-content-value-int">{{ formatted.int }}</span><span
                v-if="formatted.decimal"
                class="am-statistic-content-value-decimal"
              >{{ formatted.decimal }}</span>
            </template>
          </slot>
        </span>
        <span v-if="hasSuffix" class="am-statistic-content-suffix" :class="classes?.suffix" :style="styles?.suffix">
          <slot name="suffix">
            <RenderNode :node="suffix" />
          </slot>
        </span>
      </div>
    </Skeleton>
  </div>
</template>
