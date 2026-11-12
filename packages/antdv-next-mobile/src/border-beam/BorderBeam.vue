<script setup lang="ts">
import type { BorderBeamProps, BorderBeamSlots } from './interface'
import { computed, shallowRef } from 'vue'
import Portal from '../_base/Portal.vue'
import { addUnit } from '../_util'
import BeamHost from './BeamHost'
import useBorderSize from './useBorderSize'
import { DEFAULT_BORDER_BEAM_DURATION, getBorderBeamGradient, getInset } from './util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmBorderBeam', inheritAttrs: false })

const props = defineProps<BorderBeamProps>()
defineSlots<BorderBeamSlots>()

/** the element the beams are rendered into: the single root element of the slot */
const host = shallowRef<HTMLElement | null>(null)
const borderWidth = useBorderSize(host)

function setHost(el: unknown) {
  const node = (el as any)?.$el ?? el
  host.value = node && node.nodeType === 1 ? node : null
}

const isValid = (value: unknown): value is number | string => value !== undefined && value !== null

const mergedCount = computed(() => {
  const { count, items } = props
  if (items)
    return items.length
  return typeof count === 'number' && Number.isFinite(count) && count >= 1 ? Math.floor(count) : 1
})

const hasDuration = computed(() => typeof props.duration === 'number' && props.duration > 0)
const mergedDuration = computed(() => (hasDuration.value ? props.duration! : DEFAULT_BORDER_BEAM_DURATION))

const beamGradient = computed(() => getBorderBeamGradient(props.color))
const insetOffset = computed(() => (isValid(props.outset) ? getInset(props.outset) : borderWidth.value.map(getInset).join(' ')))

const beams = computed(() => {
  const count = mergedCount.value
  return Array.from({ length: count }, (_, index) => {
    const item = props.items?.[index] ?? {}
    const phase = index / count
    const lineWidth = item.lineWidth ?? props.lineWidth
    const size = item.size ?? props.size
    return {
      key: `${count}-${index}`,
      style: {
        '--am-border-beam-beam-gradient': item.color ? getBorderBeamGradient(item.color) : beamGradient.value,
        '--am-border-beam-duration': hasDuration.value ? `${props.duration}s` : undefined,
        '--am-border-beam-line-width': isValid(lineWidth) ? addUnit(lineWidth) : undefined,
        '--am-border-beam-size': isValid(size) ? addUnit(size) : undefined,
        // a negative delay starts the beam part-way through its loop: beams are spread evenly
        '--am-border-beam-delay': phase > 0 ? `${-mergedDuration.value * phase}s` : undefined,
        '--am-border-beam-inset-offset': isValid(item.outset) ? getInset(item.outset) : insetOffset.value,
      },
    }
  })
})
</script>

<template>
  <BeamHost :set-host="setHost">
    <slot />
  </BeamHost>
  <template v-if="host">
    <!-- one Portal per beam: every beam is a direct child of the host, without fragment anchors -->
    <Portal v-for="beam in beams" :key="beam.key" :get-container="host">
      <div
        v-bind="$attrs"
        aria-hidden="true"
        class="am-border-beam"
        :class="[rootClass, classes?.root]"
        :style="[beam.style, styles?.root]"
      />
    </Portal>
  </template>
</template>
