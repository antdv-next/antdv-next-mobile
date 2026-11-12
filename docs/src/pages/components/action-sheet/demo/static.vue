<docs lang="zh-CN">
使用 `ActionSheet.show()` 指令式地打开动作面板，无需在模板中声明组件。返回的 `close` 方法可以手动关闭。
</docs>

<script setup lang="ts">
import { ActionSheet, message } from 'antdv-next-mobile'

function show() {
  ActionSheet.show({
    title: '确定要删除这张照片吗？',
    actions: [
      { key: 'delete', text: '删除', danger: true, bold: true },
    ],
    onAction: () => message.success('已删除'),
    onCancel: () => message.info('已取消'),
  })
}

function showAndClose() {
  const handler = ActionSheet.show({
    extra: '3 秒后自动关闭',
    actions: [
      { key: 'a', text: '选项一' },
      { key: 'b', text: '选项二' },
    ],
  })
  setTimeout(handler.close, 3000)
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="show">
      ActionSheet.show()
    </am-button>
    <am-button block @click="showAndClose">
      手动关闭
    </am-button>
  </am-flex>
</template>
