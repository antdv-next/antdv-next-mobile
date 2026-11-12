<docs lang="zh-CN">
`label` / `content` 可以是渲染函数，也可以用 `labelRender` / `contentRender` 插槽统一自定义。
</docs>

<script setup lang="ts">
import { CheckCircleFilled } from '@antdv-next/icons'
import { h } from 'vue'

const items = [
  { key: 'name', label: '用户名', content: '周毛毛' },
  {
    key: 'status',
    label: '认证状态',
    content: () => h('span', { style: 'color: var(--am-color-success)' }, [h(CheckCircleFilled), ' 已实名']),
  },
  { key: 'phone', label: '手机号', content: '18100000000' },
]

function mask(value: unknown) {
  return String(value).replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}
</script>

<template>
  <am-descriptions title="自定义渲染" :items="items">
    <template #contentRender="{ item, value }">
      <template v-if="item.key === 'phone'">
        {{ mask(value) }}
      </template>
    </template>
  </am-descriptions>
</template>
