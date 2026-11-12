<docs lang="zh-CN">
使用 `ActionSheet.show()` 指令式地打开动作面板，无需在模板中声明组件。返回的 `close` 方法可以手动关闭。
</docs>

<docs lang="en-US">
Use `ActionSheet.show()` to open an action sheet imperatively, without declaring the component in the template. The returned `close` method closes it manually.
</docs>

<script setup lang="ts">
import { ActionSheet, message } from '@antdv-next/mobile'

function show() {
  ActionSheet.show({
    title: 'Delete this photo?',
    actions: [
      { key: 'delete', text: 'Delete', danger: true, bold: true },
    ],
    onAction: () => message.success('Deleted'),
    onCancel: () => message.info('Cancelled'),
  })
}

function showAndClose() {
  const handler = ActionSheet.show({
    extra: 'Closes automatically in 3s',
    actions: [
      { key: 'a', text: 'Option 1' },
      { key: 'b', text: 'Option 2' },
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
      Close manually
    </am-button>
  </am-flex>
</template>
