<docs lang="zh-CN">
通过 `expandIcon` 插槽（或同名属性）自定义展开图标，插槽参数包含面板的展开状态；`labelRender` 插槽自定义标题。
</docs>

<script setup lang="ts">
import type { CollapseItemType } from 'antdv-next-mobile'
import { MinusCircleOutlined, PlusCircleOutlined } from '@antdv-next/icons'

const items: CollapseItemType[] = [
  { key: '1', label: '基础信息', content: '姓名、手机号、所在城市。' },
  { key: '2', label: '教育经历', content: '学校、专业、学历。' },
  { key: '3', label: '工作经历', content: '公司、职位、在职时间。' },
]
</script>

<template>
  <am-collapse :items="items" :default-active-key="['1']">
    <template #expandIcon="{ isActive }">
      <MinusCircleOutlined v-if="isActive" style="color: var(--am-color-primary); font-size: 18px" />
      <PlusCircleOutlined v-else style="font-size: 18px" />
    </template>
    <template #labelRender="{ item, index }">
      <span style="color: var(--am-color-text-tertiary)">0{{ index + 1 }}</span>
      {{ item.label }}
    </template>
  </am-collapse>
</template>
