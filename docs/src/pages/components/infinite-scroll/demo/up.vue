<docs lang="zh-CN">
`direction="up"` 时滚动到顶部附近触发加载，适用于聊天记录。插入历史数据后需要自行保持滚动位置。
</docs>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

const scroller = ref<HTMLElement>()
const list = ref(Array.from({ length: 12 }, (_, i) => 30 - 11 + i))
const loading = ref(false)
const hasMore = ref(true)

onMounted(() => {
  // 初始定位到底部
  scroller.value!.scrollTop = scroller.value!.scrollHeight
})

function onLoad() {
  setTimeout(async () => {
    const el = scroller.value!
    const prevHeight = el.scrollHeight
    const first = list.value[0]
    const count = Math.min(6, first - 1)
    list.value.unshift(...Array.from({ length: count }, (_, i) => first - count + i))
    if (list.value[0] <= 1)
      hasMore.value = false
    await nextTick()
    // 保持可视内容不跳动
    el.scrollTop += el.scrollHeight - prevHeight
    loading.value = false
  }, 800)
}
</script>

<template>
  <div ref="scroller" class="scroller">
    <am-infinite-scroll
      v-model:loading="loading"
      direction="up"
      :has-more="hasMore"
      :threshold="20"
      :immediate-check="false"
      finished-text="没有更早的消息了"
      @load="onLoad"
    >
      <ul class="list">
        <li v-for="item in list" :key="item">
          消息 {{ item }}
        </li>
      </ul>
    </am-infinite-scroll>
  </div>
</template>

<style scoped>
.scroller {
  height: 320px;
  overflow-y: auto;
  border: 1px solid var(--am-color-border-secondary);
  border-radius: 8px;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.list li {
  padding: 12px 16px;
  border-bottom: 1px solid var(--am-color-split);
}
</style>
