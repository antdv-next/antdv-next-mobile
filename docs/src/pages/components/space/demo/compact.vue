<docs lang="zh-CN">
用 `Space.Compact` 把多个带边框的组件拼成一个整体：相邻的边框合并，只有最外侧保留圆角。配合 `Space.Addon` 可以加上前后缀文本。
</docs>

<docs lang="en-US">
Use `Space.Compact` to join multiple bordered components into a whole: adjacent borders are merged and only the outermost edges keep rounded corners. Use `Space.Addon` to add prefix / suffix text.
</docs>

<script setup lang="ts">
import { SearchOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const keyword = ref('')
const site = ref('antdv-next')
const phone = ref('')
</script>

<template>
  <am-flex vertical gap="middle">
    <am-space-compact block>
      <am-input v-model:value="keyword" placeholder="Search products" allow-clear />
      <am-button type="primary">
        <template #icon>
          <SearchOutlined />
        </template>
        Search
      </am-button>
    </am-space-compact>

    <am-space-compact block>
      <am-space-addon>https://</am-space-addon>
      <am-input v-model:value="site" />
      <am-space-addon>.com</am-space-addon>
    </am-space-compact>

    <am-space-compact block>
      <am-space-addon>+86</am-space-addon>
      <am-input v-model:value="phone" placeholder="Phone number" inputmode="tel" />
      <am-button>Get code</am-button>
    </am-space-compact>
  </am-flex>
</template>
