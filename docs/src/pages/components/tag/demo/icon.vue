<docs lang="zh-CN">
通过 `icon` 属性或同名插槽在标签内放置图标。
</docs>

<docs lang="en-US">
Place an icon inside the tag with the `icon` prop or the same-named slot.
</docs>

<script setup lang="ts">
import { EnvironmentOutlined, FireFilled, GithubOutlined, StarFilled } from '@antdv-next/icons'
import { h } from 'vue'
</script>

<template>
  <am-space wrap>
    <am-tag :icon="h(GithubOutlined)">
      GitHub
    </am-tag>
    <am-tag color="volcano" :icon="h(FireFilled)">
      Hot
    </am-tag>
    <am-tag color="gold">
      <template #icon>
        <StarFilled />
      </template>
      4.9
    </am-tag>
    <am-tag color="blue" round>
      <template #icon>
        <EnvironmentOutlined />
      </template>
      Hangzhou
    </am-tag>
  </am-space>
</template>
