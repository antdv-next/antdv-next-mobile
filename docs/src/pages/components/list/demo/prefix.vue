<docs lang="zh-CN">
`prefix` 放置图标或头像，`description` 展示描述信息，`extra` 展示右侧内容。分隔线自动与标题左对齐。
</docs>

<script setup lang="ts">
import { BellOutlined, CreditCardOutlined, SafetyOutlined, SettingOutlined } from '@antdv-next/icons'

function noop() {}
</script>

<template>
  <am-list header="带图标">
    <am-list-item @click="noop">
      <template #prefix>
        <CreditCardOutlined class="icon" />
      </template>
      账单
    </am-list-item>
    <am-list-item extra="已开启" @click="noop">
      <template #prefix>
        <BellOutlined class="icon" />
      </template>
      消息通知
    </am-list-item>
    <am-list-item @click="noop">
      <template #prefix>
        <SettingOutlined class="icon" />
      </template>
      设置
    </am-list-item>
  </am-list>

  <am-list header="带描述">
    <am-list-item description="管理登录密码、支付密码与设备" @click="noop">
      <template #prefix>
        <span class="avatar"><SafetyOutlined /></span>
      </template>
      账号与安全
    </am-list-item>
    <am-list-item description="这是一段比较长的描述信息，超出一行时会自动换行显示，不会被截断" extra="详情" @click="noop">
      <template #prefix>
        <span class="avatar">A</span>
      </template>
      标题文字
    </am-list-item>
  </am-list>
</template>

<style scoped>
.icon {
  color: var(--am-color-primary);
  font-size: 20px;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--am-color-primary);
  font-size: 18px;
  background: var(--am-color-primary-bg);
  border-radius: 50%;
}
</style>
