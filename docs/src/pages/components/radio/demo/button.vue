<docs lang="zh-CN">
使用 `Radio.Button` 或 `optionType="button"` 渲染按钮样式的单选组合，`buttonStyle` 可选 `outline`（描边）与 `solid`（填底）。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const a = ref('day')
const b = ref('week')
const options = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '年', value: 'year', disabled: true },
]
</script>

<template>
  <am-flex vertical gap="middle">
    <am-radio-group v-model:value="a">
      <am-radio-button value="day">
        日
      </am-radio-button>
      <am-radio-button value="week">
        周
      </am-radio-button>
      <am-radio-button value="month">
        月
      </am-radio-button>
    </am-radio-group>
    <am-radio-group v-model:value="b" :options="options" option-type="button" button-style="solid" />
  </am-flex>
</template>
