<script setup lang="ts">
import type { StatisticTimerEmits, StatisticTimerProps, StatisticTimerSlots } from './interface'
import { computed, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, watch } from 'vue'
import Statistic from './Statistic.vue'
import { formatTimeStr, parseTime } from './utils'

defineOptions({ name: 'AmStatisticTimer' })

const props = withDefaults(defineProps<StatisticTimerProps>(), {
  type: 'countdown',
  value: 0,
  format: 'HH:mm:ss',
  loading: false,
})
const emit = defineEmits<StatisticTimerEmits>()
defineSlots<StatisticTimerSlots>()

/** Same refresh rate as Ant Design's countdown. */
const REFRESH_INTERVAL = 1000 / 30

const down = computed(() => props.type === 'countdown')
const target = computed(() => new Date(props.value).getTime())

function getDiff() {
  const timestamp = Number.isNaN(target.value) ? 0 : target.value
  const now = Date.now()
  return Math.max(down.value ? timestamp - now : now - timestamp, 0)
}

// A fixed initial value keeps SSR output and hydration identical; the real value is set on mount.
const diff = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

function stop() {
  if (timer !== undefined) {
    clearInterval(timer)
    timer = undefined
  }
}

function tick() {
  diff.value = getDiff()
  emit('change', diff.value)
  if (down.value && target.value <= Date.now()) {
    stop()
    emit('finish')
    return false
  }
  return true
}

function start() {
  stop()
  diff.value = getDiff()
  // An already expired countdown just shows zero, like antdv-next.
  if (down.value && target.value <= Date.now())
    return
  timer = setInterval(tick, REFRESH_INTERVAL)
}

onMounted(start)
onActivated(start)
onDeactivated(stop)
onBeforeUnmount(stop)
watch(() => [props.value, props.type], start)

const formatted = computed(() => formatTimeStr(diff.value, props.format))
const time = computed(() => parseTime(diff.value))
</script>

<template>
  <Statistic
    class="am-statistic-timer"
    :title="title"
    :prefix="prefix"
    :suffix="suffix"
    :loading="loading"
    :value-style="valueStyle"
    :root-class="rootClass"
    :classes="classes"
    :styles="styles"
    :value="diff"
  >
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
    <template #formatter>
      <slot name="formatter" :value="diff" :formatted="formatted" :time="time">
        {{ formatted }}
      </slot>
    </template>
  </Statistic>
</template>
