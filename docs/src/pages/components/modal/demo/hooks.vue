<docs lang="zh-CN">
静态方法无法读取调用处的 `ConfigProvider` 上下文。通过 `Modal.useModal()` 创建的 `ContextHolder` 渲染在组件树中，对话框会跟随其所在位置的主题与语言。
</docs>

<script setup lang="ts">
import { Modal } from 'antdv-next-mobile'
import enUS from 'antdv-next-mobile/locale/en_US'

const [modal, ContextHolder] = Modal.useModal()

function show() {
  modal.confirm({
    title: 'Dark & English',
    content: 'This dialog follows the theme and locale of its ConfigProvider.',
  })
}
</script>

<template>
  <am-config-provider :locale="enUS" :theme="{ algorithm: 'dark', token: { colorPrimary: '#00b96b' } }">
    <ContextHolder />
  </am-config-provider>
  <am-button block @click="show">
    使用 hooks 打开
  </am-button>
</template>
