<docs lang="zh-CN">
通过 `icon` 插槽自定义图标，`Radio.Group` 的 `icon` 插槽会应用到组内所有选项。
</docs>

<script setup lang="ts">
import { CheckCircleFilled, SmileFilled, SmileOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const mood = ref('good')
const plan = ref('pro')
</script>

<template>
  <am-flex vertical gap="middle">
    <am-radio-group v-model:value="mood" :options="[{ label: '开心', value: 'good' }, { label: '一般', value: 'normal' }]">
      <template #icon="{ checked }">
        <SmileFilled v-if="checked" style="color: var(--am-color-warning)" />
        <SmileOutlined v-else style="color: var(--am-color-text-tertiary)" />
      </template>
    </am-radio-group>
    <am-radio-group v-model:value="plan" vertical>
      <am-radio value="free">
        <template #icon="{ checked }">
          <CheckCircleFilled :style="{ color: checked ? 'var(--am-color-success)' : 'var(--am-color-fill)' }" />
        </template>
        免费版
      </am-radio>
      <am-radio value="pro">
        <template #icon="{ checked }">
          <CheckCircleFilled :style="{ color: checked ? 'var(--am-color-success)' : 'var(--am-color-fill)' }" />
        </template>
        专业版
      </am-radio>
    </am-radio-group>
  </am-flex>
</template>
