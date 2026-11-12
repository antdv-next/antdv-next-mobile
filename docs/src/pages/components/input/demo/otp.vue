<docs lang="zh-CN">
`InputOTP` 用于短信验证码、支付密码等场景：由一个原生输入框驱动所有格子，支持粘贴与短信验证码自动填充。`change` 在全部填满时触发；`mask` 隐藏内容；`formatter` 可过滤输入；`separator` 渲染分隔符。
</docs>

<docs lang="en-US">
`InputOTP` is used for SMS verification codes, payment passwords and similar scenarios: a single native input drives all the cells, and paste and SMS code autofill are supported. `change` fires when all cells are filled; `mask` hides the content; `formatter` can filter the input; `separator` renders separators.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const code = ref('')
const done = ref('')

const digitsOnly = (value: string) => value.replace(/\D/g, '')
const separator = (index: number) => (index === 2 ? '—' : null)
</script>

<template>
  <am-flex vertical gap="middle">
    <am-input-otp v-model:value="code" :formatter="digitsOnly" @change="done = $event" />
    <span style="font-size: 12px; color: var(--am-color-text-tertiary)">value: {{ code }}, change: {{ done || '-' }}</span>
    <am-input-otp :length="4" mask variant="filled" />
    <am-input-otp :length="6" size="small" variant="underlined" :separator="separator" />
    <am-input-otp :length="4" default-value="12" status="error" input-mode="text" />
  </am-flex>
</template>
