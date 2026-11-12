<script setup lang="ts">
import type { Key } from '../_util/type'
import type { BarrageEmits, BarrageExpose, BarrageItem, BarrageProps, BarrageSlots } from './interface'
import { computed, reactive, ref, watch } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { usePageVisibility } from '../hooks/dom'
import '../style'
import './style/index.css'

interface BarrageTrack {
  row: number
  delay: number
  /** flew out already; kept until the id leaves the list so a controlled list never replays it */
  done: boolean
}

defineOptions({ name: 'AmBarrage', inheritAttrs: false })

const props = withDefaults(defineProps<BarrageProps>(), {
  rows: 4,
  top: 10,
  duration: 4000,
  delay: 300,
  autoPlay: true,
})
const emit = defineEmits<BarrageEmits>()
defineSlots<BarrageSlots>()

const [list, setList] = useControlled(props, 'value', {
  defaultValue: () => props.defaultValue ?? [],
  onChange: (value: BarrageItem[]) => {
    emit('update:value', value)
    emit('change', value)
  },
})

const playing = ref(props.autoPlay)
const visibility = usePageVisibility()
const paused = computed(() => !playing.value || visibility.value === 'hidden')

// Per-id flight data. It is assigned once, so appending items never restarts the ones in flight.
const tracks = reactive(new Map<Key, BarrageTrack>())
let count = 0

function sync(initial: boolean) {
  const ids = new Set<Key>(list.value.map(item => item.id))
  for (const id of [...tracks.keys()]) {
    if (!ids.has(id))
      tracks.delete(id)
  }
  const rows = Math.max(1, Math.floor(props.rows) || 1)
  const delay = Math.max(0, props.delay)
  let index = initial ? 1 : 0
  for (const id of ids) {
    if (!tracks.has(id))
      tracks.set(id, { row: count++ % rows, delay: index++ * delay, done: false })
  }
}

sync(true)
// tracks `length` and every id, so in-place `push` / `splice` on a reactive list is picked up too
watch(() => list.value.map(item => item.id), () => sync(false))

const bullets = computed(() => {
  const result: { item: BarrageItem, track: BarrageTrack }[] = []
  const seen = new Set<Key>()
  for (const item of list.value) {
    const track = tracks.get(item.id)
    if (track && !track.done && !seen.has(item.id)) {
      seen.add(item.id)
      result.push({ item, track })
    }
  }
  return result
})

function handleFinish(item: BarrageItem) {
  const track = tracks.get(item.id)
  if (!track || track.done)
    return
  track.done = true
  emit('finish', item)
  setList(list.value.filter(it => it.id !== item.id))
}

function play() {
  playing.value = true
}

function pause() {
  playing.value = false
}

defineExpose<BarrageExpose>({ play, pause })
</script>

<template>
  <div
    v-bind="$attrs"
    class="am-barrage"
    :class="[{ 'am-barrage-paused': paused }, rootClass, classes?.root]"
    :style="styles?.root"
  >
    <slot />
    <div class="am-barrage-wrapper" :style="{ '--am-barrage-offset': `${top}px` }">
      <div
        v-for="{ item, track } in bullets"
        :key="item.id"
        class="am-barrage-track"
        :style="{
          '--am-barrage-row': track.row,
          '--am-barrage-duration': `${duration}ms`,
          '--am-barrage-delay': `${track.delay}ms`,
        }"
      >
        <span
          class="am-barrage-item"
          :class="[classes?.item, item.class]"
          :style="[styles?.item, item.style]"
          @animationend.self="handleFinish(item)"
        >
          <slot name="item" :item="item">
            <RenderNode :node="item.text" />
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>
