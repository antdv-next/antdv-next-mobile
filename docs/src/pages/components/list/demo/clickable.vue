<docs lang="zh-CN">
监听 `click` 事件或设置 `href` 后，列表项自动带有按压反馈与右侧箭头；`arrow` 与 `clickable` 可以单独控制，`disabled` 禁用点击。
</docs>

<docs lang="en-US">
After listening to the `click` event or setting `href`, an item gets press feedback and an arrow on the right automatically; `arrow` and `clickable` can be controlled separately, and `disabled` disables tapping.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <am-list header="Clickable list" :footer="`Clicked ${count} times`">
    <am-list-item @click="count++">
      Tap to trigger an event
    </am-list-item>
    <am-list-item href="https://antdv-next.com" target="_blank" extra="antdv-next.com">
      Link
    </am-list-item>
    <am-list-item :arrow="false" @click="count++">
      Clickable without arrow
    </am-list-item>
    <am-list-item arrow extra="Arrow only">
      Not clickable
    </am-list-item>
    <am-list-item disabled @click="count++">
      Disabled
    </am-list-item>
  </am-list>
</template>
