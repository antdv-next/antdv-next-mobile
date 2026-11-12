<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ProgressGradient, ProgressProps, ProgressSlots } from './interface'
import { CheckCircleFilled, CheckOutlined, CloseCircleFilled, CloseOutlined } from '@antdv-next/icons'
import { computed, useId } from 'vue'
import { addUnit, clamp } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useConfig } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmProgress', inheritAttrs: false })

const props = withDefaults(defineProps<ProgressProps>(), {
  type: 'line',
  percent: 0,
  showInfo: true,
  strokeLinecap: 'round',
})
defineSlots<ProgressSlots>()

const config = useConfig()
const gradientId = useId()

function valid(value?: number) {
  const num = Number(value)
  return Number.isNaN(num) ? 0 : clamp(num, 0, 100)
}

const isCircle = computed(() => props.type === 'circle' || props.type === 'dashboard')
const percent = computed(() => valid(props.percent))
const successPercent = computed(() => (props.success?.percent === undefined ? undefined : valid(props.success.percent)))

const status = computed(() => {
  if (props.status)
    return props.status
  return Math.max(percent.value, successPercent.value ?? 0) >= 100 ? 'success' : 'normal'
})

const mergedRailColor = computed(() => props.railColor ?? props.trailColor)

// ---------- size ----------
const sizeConfig = computed<[width: string | number | undefined, height: number | undefined]>(() => {
  const { size } = props
  if (Array.isArray(size))
    return [size[0], size[1]]
  if (typeof size === 'object' && size)
    return [size.width, size.height]
  if (typeof size === 'number')
    return isCircle.value ? [size, size] : [undefined, size]
  return [undefined, undefined]
})
const isSmall = computed(() => props.size === 'small')

// ---------- colors ----------
function isGradient(color: ProgressProps['strokeColor']): color is ProgressGradient {
  return !!color && typeof color === 'object' && !Array.isArray(color)
}

/** Gradient stops sorted by offset: `[{ offset: '0%', color }]`. */
const gradientStops = computed(() => {
  const color = props.strokeColor
  if (Array.isArray(color) && color.length > 1 && !props.steps)
    return color.map((c, index) => ({ offset: `${(index / (color.length - 1)) * 100}%`, color: c }))
  if (!isGradient(color))
    return undefined
  const { from, to, direction, ...rest } = color
  const keys = Object.keys(rest).filter(key => !Number.isNaN(Number.parseFloat(key)) && rest[key])
  if (keys.length) {
    return keys
      .map(key => ({ offset: `${Number.parseFloat(key)}%`, color: rest[key] as string }))
      .sort((a, b) => Number.parseFloat(a.offset) - Number.parseFloat(b.offset))
  }
  return [
    { offset: '0%', color: from ?? 'var(--am-progress-color)' },
    { offset: '100%', color: to ?? 'var(--am-progress-color)' },
  ]
})

const solidColor = computed(() => {
  const color = props.strokeColor
  if (typeof color === 'string')
    return color
  if (Array.isArray(color) && color.length === 1)
    return color[0]
  return undefined
})

// ---------- line ----------
const percentPosition = computed(() => ({
  align: props.percentPosition?.align ?? 'end',
  type: props.percentPosition?.type ?? 'outer',
}))

const lineBackground = computed(() => {
  if (gradientStops.value) {
    const direction = (isGradient(props.strokeColor) && props.strokeColor.direction)
      || (config.direction.value === 'rtl' ? 'to left' : 'to right')
    return `linear-gradient(${direction}, ${gradientStops.value.map(stop => `${stop.color} ${stop.offset}`).join(', ')})`
  }
  return solidColor.value
})

const lineRadius = computed(() => (props.strokeLinecap === 'round' ? undefined : '0'))
const lineHeight = computed(() => sizeConfig.value[1] ?? props.strokeWidth)

const railStyle = computed<CSSProperties>(() => ({
  height: addUnit(lineHeight.value),
  background: mergedRailColor.value,
  borderRadius: lineRadius.value,
}))

const trackStyle = computed<CSSProperties>(() => ({
  width: `${percent.value}%`,
  background: lineBackground.value,
  borderRadius: lineRadius.value,
}))

const successTrackStyle = computed<CSSProperties>(() => ({
  width: `${successPercent.value ?? 0}%`,
  background: props.success?.strokeColor,
  borderRadius: lineRadius.value,
}))

// ---------- steps ----------
const stepsConfig = computed(() => {
  if (!props.steps)
    return undefined
  const count = typeof props.steps === 'number' ? props.steps : props.steps.count
  const gap = typeof props.steps === 'number' ? undefined : props.steps.gap
  const rounding = props.rounding ?? Math.round
  const current = rounding(count * (percent.value / 100))
  const [width, height] = sizeConfig.value
  const colors = props.strokeColor
  return {
    gap,
    items: Array.from({ length: Math.max(Math.floor(count), 0) }, (_, index) => {
      const active = index < current
      let background: string | undefined
      if (active)
        background = Array.isArray(colors) ? (colors[index] ?? colors[colors.length - 1]) : solidColor.value
      else
        background = mergedRailColor.value
      return {
        active,
        style: {
          width: addUnit(width),
          height: addUnit(height ?? props.strokeWidth),
          background,
        } as CSSProperties,
      }
    }),
  }
})

// ---------- circle ----------
const circleSize = computed(() => {
  const width = sizeConfig.value[0] ?? sizeConfig.value[1]
  if (typeof width === 'number')
    return width
  if (typeof width === 'string' && !Number.isNaN(Number.parseFloat(width)))
    return Number.parseFloat(width)
  return isSmall.value ? 60 : 120
})

const circle = computed(() => {
  const strokeWidth = props.strokeWidth ?? Math.max((3 / circleSize.value) * 100, 6)
  const radius = 50 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const gapDegree = clamp(props.gapDegree ?? (props.type === 'dashboard' ? 75 : 0), 0, 295)
  const placement = props.gapPlacement ?? (props.type === 'dashboard' ? 'bottom' : 'top')
  const rtl = config.direction.value === 'rtl'
  // angle of the gap center, clockwise from 3 o'clock (where an svg circle starts)
  const center = { top: 270, bottom: 90, start: rtl ? 0 : 180, end: rtl ? 180 : 0 }[placement] ?? 270
  const arc = circumference * ((360 - gapDegree) / 360)
  const linecap = props.strokeLinecap
  const dash = (value: number) => `${(arc * value) / 100} ${circumference}`
  return {
    strokeWidth,
    radius,
    linecap,
    transform: `rotate(${center + gapDegree / 2} 50 50)`,
    rail: dash(100),
    track: dash(percent.value),
    success: dash(successPercent.value ?? 0),
  }
})

const circleStyle = computed<CSSProperties>(() => ({
  width: `${circleSize.value}px`,
  height: `${circleSize.value}px`,
  fontSize: `${circleSize.value * 0.15 + 6}px`,
}))

const trackStroke = computed(() => (gradientStops.value ? `url(#${gradientId})` : solidColor.value))

// ---------- root ----------
const classNames = computed(() => [
  'am-progress',
  `am-progress-${isCircle.value ? 'circle' : 'line'}`,
  `am-progress-status-${status.value}`,
  {
    'am-progress-dashboard': props.type === 'dashboard',
    'am-progress-steps': !!stepsConfig.value && !isCircle.value,
    'am-progress-small': isSmall.value,
    'am-progress-show-info': props.showInfo,
    [`am-progress-line-align-${percentPosition.value.align}`]: !isCircle.value,
    [`am-progress-line-position-${percentPosition.value.type}`]: !isCircle.value,
  },
  props.rootClass,
  props.classes?.root,
])

const rootStyle = computed(() => [
  !isCircle.value && !stepsConfig.value && sizeConfig.value[0] !== undefined
    ? { width: addUnit(sizeConfig.value[0]) }
    : undefined,
  props.styles?.root,
])

const innerInfo = computed(() => !isCircle.value && !stepsConfig.value && percentPosition.value.type === 'inner')
</script>

<template>
  <div
    v-bind="$attrs"
    :class="classNames"
    :style="rootStyle"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="percent"
  >
    <!-- circle / dashboard -->
    <div v-if="isCircle" class="am-progress-body" :class="classes?.body" :style="[circleStyle, styles?.body]">
      <svg class="am-progress-circle-svg" viewBox="0 0 100 100" aria-hidden="true">
        <defs v-if="gradientStops">
          <linearGradient :id="gradientId" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop v-for="stop in gradientStops" :key="stop.offset" :offset="stop.offset" :stop-color="stop.color" />
          </linearGradient>
        </defs>
        <circle
          class="am-progress-rail"
          :class="classes?.rail"
          :style="[{ stroke: mergedRailColor }, styles?.rail]"
          cx="50"
          cy="50"
          fill="none"
          :r="circle.radius"
          :stroke-width="circle.strokeWidth"
          :stroke-linecap="circle.linecap"
          :stroke-dasharray="circle.rail"
          :transform="circle.transform"
        />
        <circle
          class="am-progress-track"
          :class="[{ 'am-progress-track-empty': percent === 0 }, classes?.track]"
          :style="[{ stroke: trackStroke }, styles?.track]"
          cx="50"
          cy="50"
          fill="none"
          :r="circle.radius"
          :stroke-width="circle.strokeWidth"
          :stroke-linecap="circle.linecap"
          :stroke-dasharray="circle.track"
          :transform="circle.transform"
        />
        <circle
          v-if="successPercent !== undefined"
          class="am-progress-track am-progress-track-success"
          :class="{ 'am-progress-track-empty': successPercent === 0 }"
          :style="{ stroke: success?.strokeColor }"
          cx="50"
          cy="50"
          fill="none"
          :r="circle.radius"
          :stroke-width="circle.strokeWidth"
          :stroke-linecap="circle.linecap"
          :stroke-dasharray="circle.success"
          :transform="circle.transform"
        />
      </svg>
      <span v-if="showInfo" class="am-progress-indicator" :class="classes?.indicator" :style="styles?.indicator">
        <slot :percent="percent" :success-percent="successPercent">
          <RenderNode v-if="format" :node="format(percent, successPercent)" />
          <CloseOutlined v-else-if="status === 'exception'" />
          <CheckOutlined v-else-if="status === 'success'" />
          <template v-else>
            {{ percent }}%
          </template>
        </slot>
      </span>
    </div>

    <!-- steps -->
    <template v-else-if="stepsConfig">
      <div
        class="am-progress-body am-progress-steps-body"
        :class="classes?.body"
        :style="[{ gap: addUnit(stepsConfig.gap) }, styles?.body]"
      >
        <div
          v-for="(item, index) in stepsConfig.items"
          :key="index"
          class="am-progress-steps-item"
          :class="[
            item.active ? 'am-progress-steps-item-active' : undefined,
            item.active ? classes?.track : classes?.rail,
          ]"
          :style="[item.style, item.active ? styles?.track : styles?.rail]"
        />
      </div>
      <span v-if="showInfo" class="am-progress-indicator" :class="classes?.indicator" :style="styles?.indicator">
        <slot :percent="percent" :success-percent="successPercent">
          <RenderNode v-if="format" :node="format(percent, successPercent)" />
          <CloseCircleFilled v-else-if="status === 'exception'" />
          <CheckCircleFilled v-else-if="status === 'success'" />
          <template v-else>
            {{ percent }}%
          </template>
        </slot>
      </span>
    </template>

    <!-- line -->
    <template v-else>
      <div class="am-progress-body" :class="classes?.body" :style="styles?.body">
        <div class="am-progress-rail" :class="classes?.rail" :style="[railStyle, styles?.rail]">
          <div class="am-progress-track" :class="classes?.track" :style="[trackStyle, styles?.track]">
            <span
              v-if="showInfo && innerInfo"
              class="am-progress-indicator am-progress-indicator-inner"
              :class="classes?.indicator"
              :style="styles?.indicator"
            >
              <slot :percent="percent" :success-percent="successPercent">
                <RenderNode v-if="format" :node="format(percent, successPercent)" />
                <template v-else>
                  {{ percent }}%
                </template>
              </slot>
            </span>
          </div>
          <div
            v-if="successPercent !== undefined"
            class="am-progress-track am-progress-track-success"
            :style="successTrackStyle"
          />
        </div>
      </div>
      <span
        v-if="showInfo && !innerInfo"
        class="am-progress-indicator"
        :class="classes?.indicator"
        :style="styles?.indicator"
      >
        <slot :percent="percent" :success-percent="successPercent">
          <RenderNode v-if="format" :node="format(percent, successPercent)" />
          <CloseCircleFilled v-else-if="status === 'exception'" />
          <CheckCircleFilled v-else-if="status === 'success'" />
          <template v-else>
            {{ percent }}%
          </template>
        </slot>
      </span>
    </template>
  </div>
</template>
