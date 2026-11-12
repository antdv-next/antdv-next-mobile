<docs lang="zh-CN">
也可以使用声明式的 `<am-collapse-panel>`，通过 `key` 标识面板，内容写在默认插槽里，适合内容较复杂的场景。
</docs>

<docs lang="en-US">
The declarative `<am-collapse-panel>` can be used as well: a panel is identified by its `key` and its content goes into the default slot, which suits more complex content.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const activeKey = ref<(string | number)[]>(['notice'])
const push = ref(true)
</script>

<template>
  <am-collapse v-model:active-key="activeKey">
    <am-collapse-panel key="notice" header="Notifications">
      <am-flex justify="space-between" align="center">
        <span>Push notifications</span>
        <am-switch v-model:checked="push" />
      </am-flex>
    </am-collapse-panel>
    <am-collapse-panel key="privacy">
      <template #header>
        <b>Privacy</b>
      </template>
      Only friends can see my posts.
    </am-collapse-panel>
    <am-collapse-panel key="about" header="About" extra="v1.0.0">
      @antdv-next/mobile is the mobile component library of the antdv-next family.
    </am-collapse-panel>
  </am-collapse>
</template>
