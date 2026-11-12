<docs lang="zh-CN">
设置 `autoPlay` 为 `false` 后弹幕不会自动播放，通过组件实例的 `play()` / `pause()` 方法控制播放与暂停。`finish` 事件中把飞完的弹幕重新加入列表即可循环播放。
</docs>

<docs lang="en-US">
With `autoPlay` set to `false` the bullets wait until `play()` is called; use the `play()` / `pause()` methods of the component instance to control them. Re-append a bullet in the `finish` event to loop.
</docs>

<script setup lang="ts">
import type { BarrageExpose, BarrageItem } from '@antdv-next/mobile'
import { ref, shallowRef } from 'vue'

const barrageRef = ref<BarrageExpose>()
const playing = ref(false)
let seed = 0

function create(text: string): BarrageItem {
  seed += 1
  return { id: seed, text }
}

const list = shallowRef<BarrageItem[]>(['Play', 'Pause', 'Replay', 'Loop', 'Again'].map(create))

function toggle() {
  playing.value = !playing.value
  if (playing.value)
    barrageRef.value?.play()
  else
    barrageRef.value?.pause()
}

function handleFinish(item: BarrageItem) {
  // the finished bullet is removed first, append it with a new id to loop
  list.value = [...list.value, create(String(item.text))]
}
</script>

<template>
  <am-flex vertical gap="middle">
    <am-barrage ref="barrageRef" v-model:value="list" :auto-play="false" :rows="3" @finish="handleFinish">
      <div class="stage" />
    </am-barrage>
    <am-button block @click="toggle">
      {{ playing ? 'Pause' : 'Play' }}
    </am-button>
  </am-flex>
</template>

<style scoped>
.stage {
  height: 160px;
  background: linear-gradient(135deg, #434343, #1f1f1f);
  border-radius: var(--am-border-radius);
}
</style>
