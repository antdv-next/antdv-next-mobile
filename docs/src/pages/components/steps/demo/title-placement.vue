<docs lang="zh-CN">
`titlePlacement="horizontal"` 把标题放在图标右侧，适合步骤较少的场景；`size="small"` 使用更紧凑的尺寸。
</docs>

<docs lang="en-US">
`titlePlacement="horizontal"` puts the title to the right of the icon, which suits flows with few steps; `size="small"` uses a more compact size.
</docs>

<script setup lang="ts">
import type { StepsItem } from '@antdv-next/mobile'

const items: StepsItem[] = [{ title: 'Login' }, { title: 'Verify' }, { title: 'Done' }]
</script>

<template>
  <am-flex vertical gap="large">
    <am-steps title-placement="horizontal" :current="1" :items="items" />
    <am-steps title-placement="horizontal" size="small" :current="1" :items="items" />
    <am-steps size="small" :current="1" :items="items" />
  </am-flex>
</template>
