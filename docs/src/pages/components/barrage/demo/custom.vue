<docs lang="zh-CN">
通过 `item` 插槽自定义弹幕内容，`rows`、`top`、`duration` 控制轨道数、顶部偏移与速度；轨道高度等通过 `--am-barrage-*` 变量调整。
</docs>

<docs lang="en-US">
Customize a bullet with the `item` slot; `rows`, `top` and `duration` control the number of tracks, the top offset and the speed. Track height and more are adjusted with the `--am-barrage-*` variables.
</docs>

<script setup lang="ts">
import type { BarrageItem } from '@antdv-next/mobile'
import { LikeFilled } from '@antdv-next/icons'
import { shallowRef } from 'vue'

const texts = ['Great stream', 'Hi all', 'First!', 'Well played', 'Wow']
let seed = 0

function create(): BarrageItem {
  seed += 1
  return { id: seed, text: texts[seed % texts.length] }
}

const list = shallowRef<BarrageItem[]>(Array.from({ length: 4 }, create))

function send() {
  list.value = [...list.value, create()]
}
</script>

<template>
  <am-flex vertical gap="middle">
    <am-barrage v-model:value="list" class="barrage" :rows="2" :top="16" :duration="6000" :delay="800">
      <div class="stage" />
      <template #item="{ item }">
        <span class="bullet">
          <LikeFilled />
          {{ item.text }}
        </span>
      </template>
    </am-barrage>
    <am-button type="primary" block @click="send">
      Send
    </am-button>
  </am-flex>
</template>

<style scoped>
.barrage {
  --am-barrage-row-height: 28px;
  --am-barrage-row-gap: var(--am-margin-sm);
  --am-barrage-font-size: var(--am-font-size-sm);
  --am-barrage-shadow-color: transparent;
}

.stage {
  height: 160px;
  background: linear-gradient(135deg, #434343, #1f1f1f);
  border-radius: var(--am-border-radius);
}

.bullet {
  display: inline-flex;
  gap: var(--am-margin-xxs);
  align-items: center;
  padding: 0 var(--am-padding-sm);
  background: var(--am-color-primary);
  border-radius: 999px;
}
</style>
