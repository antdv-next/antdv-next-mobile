<docs lang="zh-CN">
`CheckableTag` 的行为类似复选框，点击切换选中状态，支持 `v-model:checked`，常用于筛选条件。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const options = ['全部', '手机', '电脑', '平板', '耳机', '配件']
const selected = ref<string[]>(['手机'])
const single = ref(true)

function toggle(option: string, checked: boolean) {
  selected.value = checked ? [...selected.value, option] : selected.value.filter(item => item !== option)
}
</script>

<template>
  <am-space vertical size="middle">
    <am-space wrap>
      <am-checkable-tag
        v-for="option in options"
        :key="option"
        :checked="selected.includes(option)"
        @change="toggle(option, $event)"
      >
        {{ option }}
      </am-checkable-tag>
    </am-space>
    <am-space wrap align="center">
      <am-checkable-tag v-model:checked="single" round>
        v-model:checked
      </am-checkable-tag>
      <am-checkable-tag default-checked round size="small">
        非受控
      </am-checkable-tag>
      <am-checkable-tag disabled round>
        禁用
      </am-checkable-tag>
    </am-space>
    <span class="tip">已选：{{ selected.join('、') || '无' }}</span>
  </am-space>
</template>

<style scoped>
.tip {
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size-sm);
}
</style>
