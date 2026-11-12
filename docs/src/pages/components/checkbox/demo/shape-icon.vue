<docs lang="zh-CN">
`shape="round"` 使用圆形勾选框；通过 `icon` 插槽（或属性）可以完全自定义图标，插槽参数包含 `checked` 与 `indeterminate`。
</docs>

<script setup lang="ts">
import { HeartFilled, HeartOutlined, StarFilled, StarOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const liked = ref(true)
const tags = ref(['a'])
</script>

<template>
  <am-flex vertical gap="small">
    <am-checkbox shape="round" default-checked>
      圆形勾选框
    </am-checkbox>
    <am-checkbox v-model:checked="liked">
      <template #icon="{ checked }">
        <HeartFilled v-if="checked" style="color: var(--am-color-error)" />
        <HeartOutlined v-else style="color: var(--am-color-text-tertiary)" />
      </template>
      {{ liked ? '已喜欢' : '喜欢' }}
    </am-checkbox>
    <am-checkbox-group v-model:value="tags" :options="[{ label: '收藏 A', value: 'a' }, { label: '收藏 B', value: 'b' }]">
      <template #icon="{ checked }">
        <StarFilled v-if="checked" style="color: var(--am-color-warning)" />
        <StarOutlined v-else style="color: var(--am-color-text-tertiary)" />
      </template>
    </am-checkbox-group>
  </am-flex>
</template>
