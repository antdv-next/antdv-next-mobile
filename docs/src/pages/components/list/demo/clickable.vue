<docs lang="zh-CN">
监听 `click` 事件或设置 `href` 后，列表项自动带有按压反馈与右侧箭头；`arrow` 与 `clickable` 可以单独控制，`disabled` 禁用点击。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <am-list header="可点击列表" :footer="`已点击 ${count} 次`">
    <am-list-item @click="count++">
      点击触发事件
    </am-list-item>
    <am-list-item href="https://antdv-next.com" target="_blank" extra="antdv-next.com">
      链接跳转
    </am-list-item>
    <am-list-item :arrow="false" @click="count++">
      可点击但不显示箭头
    </am-list-item>
    <am-list-item arrow extra="仅展示箭头">
      不可点击
    </am-list-item>
    <am-list-item disabled @click="count++">
      禁用状态
    </am-list-item>
  </am-list>
</template>
