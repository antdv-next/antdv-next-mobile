<docs lang="zh-CN">
通过 `checkedChildren` 与 `unCheckedChildren` 属性或同名插槽，在开关内展示文字或图标。
</docs>

<docs lang="en-US">
Show text or icons inside the switch with the `checkedChildren` and `unCheckedChildren` props or the same-named slots.
</docs>

<script setup lang="ts">
import { CheckOutlined, CloseOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-flex vertical gap="middle" align="flex-start">
    <am-switch checked-children="On" un-checked-children="Off" default-checked />
    <am-switch checked-children="1" un-checked-children="0" />
    <am-switch default-checked>
      <template #checkedChildren>
        <CheckOutlined />
      </template>
      <template #unCheckedChildren>
        <CloseOutlined />
      </template>
    </am-switch>
  </am-flex>
</template>
