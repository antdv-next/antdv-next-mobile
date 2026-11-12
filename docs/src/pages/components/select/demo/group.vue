<docs lang="zh-CN">
带 `options` 字段的项会渲染为分组标题。`fieldNames` 可以适配已有的数据结构，`labelInValue` 让绑定值同时包含 `label` 与 `value`。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const options = [
  { label: '华东', options: [{ label: '上海', value: 'sh' }, { label: '杭州', value: 'hz' }, { label: '南京', value: 'nj' }] },
  { label: '华南', options: [{ label: '广州', value: 'gz' }, { label: '深圳', value: 'sz' }] },
  { label: '华北', options: [{ label: '北京', value: 'bj' }, { label: '天津', value: 'tj' }] },
]
const city = ref('hz')

const banks = [
  { name: '招商银行', code: 'CMB' },
  { name: '工商银行', code: 'ICBC' },
  { name: '建设银行', code: 'CCB' },
]
const bank = ref<{ label: string, value: string } | null>(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-select v-model:value="city" :options="options" show-search title="选择城市" />
    <am-select
      v-model:value="bank"
      :options="banks"
      :field-names="{ label: 'name', value: 'code' }"
      label-in-value
      title="开户银行"
      placeholder="请选择开户银行"
    />
    <div class="demo-result">
      绑定值：{{ JSON.stringify(bank) }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
