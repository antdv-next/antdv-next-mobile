<docs lang="zh-CN">
选项的 `description` 会显示在文字下方。`option` 插槽可以完全自定义选项内容，`labelRender` 插槽自定义触发器中的显示内容。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const plans = [
  { label: '标准快递', value: 'standard', description: '预计 3 天送达 · 免运费' },
  { label: '次日达', value: 'next', description: '预计明天送达 · ¥8' },
  { label: '当日达', value: 'same', description: '今天 22:00 前送达 · ¥18' },
  { label: '到店自提', value: 'self', description: '营业时间 9:00 - 21:00', disabled: true },
]
const plan = ref('standard')

const colors = [
  { label: '极光蓝', value: '#1677ff' },
  { label: '薄荷绿', value: '#52c41a' },
  { label: '日落橙', value: '#fa8c16' },
  { label: '樱花粉', value: '#eb2f96' },
]
const color = ref('#1677ff')
</script>

<template>
  <am-flex vertical gap="small">
    <am-select v-model:value="plan" :options="plans" title="配送方式" />
    <am-select v-model:value="color" :options="colors" title="主题色">
      <template #option="{ option }">
        <am-flex align="center" gap="small">
          <span class="demo-dot" :style="{ background: String(option.value) }" />
          {{ option.label }}
        </am-flex>
      </template>
      <template #labelRender="{ label, value }">
        <span class="demo-dot" :style="{ background: String(value) }" />
        {{ label }}
      </template>
    </am-select>
  </am-flex>
</template>

<style>
.demo-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-inline-end: 4px;
  border-radius: 50%;
}
</style>
