<docs lang="zh-CN">
内置 13 种预设颜色，也可以传入任意 CSS 颜色值，背景与边框会由主色自动派生。
</docs>

<script setup lang="ts">
const presets = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']
const customs = ['#f50', '#2db7f5', '#87d068', '#108ee9']
</script>

<template>
  <am-space vertical size="middle">
    <am-space wrap>
      <am-tag v-for="color in presets" :key="color" :color="color">
        {{ color }}
      </am-tag>
    </am-space>
    <am-space wrap>
      <am-tag v-for="color in customs" :key="color" :color="color">
        {{ color }}
      </am-tag>
    </am-space>
    <am-space wrap>
      <am-tag v-for="color in customs" :key="color" :color="color" variant="solid">
        {{ color }}
      </am-tag>
    </am-space>
  </am-space>
</template>
