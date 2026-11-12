<docs lang="zh-CN">
通过 `expandIcon` 插槽（或同名属性）自定义展开图标，插槽参数包含面板的展开状态；`labelRender` 插槽自定义标题。
</docs>

<docs lang="en-US">
Customize the expand icon through the `expandIcon` slot (or the same-named prop), the slot params contain the expanded state of the panel; the `labelRender` slot customizes the title.
</docs>

<script setup lang="ts">
import type { CollapseItemType } from '@antdv-next/mobile'
import { MinusCircleOutlined, PlusCircleOutlined } from '@antdv-next/icons'

const items: CollapseItemType[] = [
  { key: '1', label: 'Basic info', content: 'Name, phone number and city.' },
  { key: '2', label: 'Education', content: 'School, major and degree.' },
  { key: '3', label: 'Experience', content: 'Company, position and period.' },
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
