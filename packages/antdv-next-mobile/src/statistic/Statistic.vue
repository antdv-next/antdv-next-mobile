<script setup lang="ts">
import type { StatisticProps, StatisticSlots } from './interface'
import { computed } from 'vue'
import RenderNode from '../_util/RenderNode'
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
})
const slots = defineSlots<StatisticSlots>()

function isRenderable(node: unknown) {
  return node !== undefined && node !== null && node !== false && node !== ''
}

const hasTitle = computed(() => !!slots.title || isRenderable(props.title))
const hasPrefix = computed(() => !!slots.prefix || isRenderable(props.prefix))
const hasSuffix = computed(() => !!slots.suffix || isRenderable(props.suffix))

const formatConfig = computed(() => ({
  groupSeparator: props.groupSeparator,
  decimalSeparator: props.decimalSeparator,
  precision: props.precision,
}))
const formatted = computed(() => formatNumber(props.value, formatConfig.value))
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
          <slot name="formatter" :value="value">
            <RenderNode v-if="formatter" :node="formatter(value, formatConfig)" />
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
