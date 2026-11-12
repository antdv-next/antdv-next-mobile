<docs lang="zh-CN">
`closable` 显示关闭按钮，`extra` 用于放置「查看详情」等额外操作。
</docs>

<script setup lang="ts">
import { RightOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const visible = ref(true)
const count = ref(0)
</script>

<template>
  <am-flex vertical gap="small">
    <am-notice-bar v-if="visible" closable content="点击右侧按钮关闭通告" @close="visible = false" />
    <am-notice-bar color="info" :content="`点击整条通告查看详情（已点击 ${count} 次）`" @click="count++">
      <template #extra>
        <RightOutlined />
      </template>
    </am-notice-bar>
    <am-notice-bar color="error" closable content="同时展示额外操作与关闭按钮">
      <template #extra>
        <span @click.stop>查看详情</span>
      </template>
    </am-notice-bar>
    <div v-if="!visible" style="padding: 0 16px">
      <am-button size="small" @click="visible = true">
        重新显示
      </am-button>
    </div>
  </am-flex>
</template>
