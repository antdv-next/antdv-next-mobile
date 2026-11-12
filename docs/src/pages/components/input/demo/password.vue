<docs lang="zh-CN">
`InputPassword` 带有显示 / 隐藏切换按钮，可通过 `v-model:icon-visible` 受控，`iconRender` 自定义图标，`visibilityToggle` 关闭切换。
</docs>

<script setup lang="ts">
import { LockOutlined, UnlockOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <am-flex vertical gap="small">
    <am-input-password placeholder="请输入密码" />
    <am-input-password v-model:icon-visible="visible" default-value="antdv-next" placeholder="受控显隐">
      <template #iconRender="{ visible: shown }">
        <UnlockOutlined v-if="shown" />
        <LockOutlined v-else />
      </template>
    </am-input-password>
    <am-input-password placeholder="无切换按钮" :visibility-toggle="false" />
    <am-button size="small" @click="visible = !visible">
      {{ visible ? '隐藏' : '显示' }}第二个密码
    </am-button>
  </am-flex>
</template>
