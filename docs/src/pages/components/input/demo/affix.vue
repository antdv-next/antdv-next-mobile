<docs lang="zh-CN">
通过 `prefix` / `suffix` 属性或同名插槽添加前后缀；`showCount` 配合 `maxlength` 显示字数统计；`align` 控制文字对齐。
</docs>

<script setup lang="ts">
import { MobileOutlined, UserOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const amount = ref('99.00')
const sending = ref(false)

function send() {
  sending.value = true
  setTimeout(() => {
    sending.value = false
  }, 2000)
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-input placeholder="用户名" :maxlength="12" show-count>
      <template #prefix>
        <UserOutlined />
      </template>
    </am-input>
    <am-input v-model:value="amount" prefix="¥" suffix="元" inputmode="decimal" align="end" />
    <am-input placeholder="短信验证码" inputmode="numeric" :maxlength="6">
      <template #prefix>
        <MobileOutlined />
      </template>
      <template #suffix>
        <am-button type="link" size="small" :loading="sending" @click="send">
          获取验证码
        </am-button>
      </template>
    </am-input>
  </am-flex>
</template>
