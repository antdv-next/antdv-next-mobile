<docs lang="zh-CN">
也可以使用声明式的 `<am-collapse-panel>`，通过 `key` 标识面板，内容写在默认插槽里，适合内容较复杂的场景。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const activeKey = ref<(string | number)[]>(['notice'])
const push = ref(true)
</script>

<template>
  <am-collapse v-model:active-key="activeKey">
    <am-collapse-panel key="notice" header="消息通知">
      <am-flex justify="space-between" align="center">
        <span>接收推送通知</span>
        <am-switch v-model:checked="push" />
      </am-flex>
    </am-collapse-panel>
    <am-collapse-panel key="privacy">
      <template #header>
        <b>隐私设置</b>
      </template>
      仅好友可以查看我的动态。
    </am-collapse-panel>
    <am-collapse-panel key="about" header="关于" extra="v1.0.0">
      antdv-next-mobile 是 antdv-next 家族的移动端组件库。
    </am-collapse-panel>
  </am-collapse>
</template>
