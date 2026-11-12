<docs lang="zh-CN">
`size` 提供三种列表密度；`bordered` 控制列表上下的细线；内容较高时可以用 `align="start"` 让两侧内容顶部对齐。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref<'small' | 'middle' | 'large'>('small')
function noop() {}
</script>

<template>
  <div style="padding: 12px 16px 0">
    <am-segmented v-model:value="size" block :options="['small', 'middle', 'large']" />
  </div>
  <am-list :size="size" :header="`size = ${size}`" :bordered="false">
    <am-list-item extra="内容" @click="noop">
      列表项一
    </am-list-item>
    <am-list-item extra="内容" @click="noop">
      列表项二
    </am-list-item>
    <am-list-item
      align="start"
      extra="顶部对齐"
      description="align 为 start 时，左右两侧的内容与第一行文字对齐，而不是垂直居中。适合描述文字较多的列表项。"
      @click="noop"
    >
      <template #prefix>
        <span class="dot" />
      </template>
      列表项三
    </am-list-item>
  </am-list>
</template>

<style scoped>
.dot {
  width: 8px;
  height: 8px;
  margin-top: 8px;
  background: var(--am-color-primary);
  border-radius: 50%;
}
</style>
