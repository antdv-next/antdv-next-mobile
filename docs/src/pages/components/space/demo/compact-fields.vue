<docs lang="zh-CN">
选择类字段（Select、Picker、DatePicker、Cascader 等）同样可以参与组合，输入框与选择字段会平分剩余宽度，按钮和 Addon 保持自身宽度。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const currency = ref('CNY')
const amount = ref<number | null>(100)
const unit = ref(['kg'])
const weight = ref('')
const date = ref()

const currencies = [
  { label: '人民币', value: 'CNY' },
  { label: '美元', value: 'USD' },
  { label: '欧元', value: 'EUR' },
]
const units = [[{ label: '千克', value: 'kg' }, { label: '克', value: 'g' }, { label: '吨', value: 't' }]]
</script>

<template>
  <am-flex vertical gap="middle">
    <am-space-compact block>
      <am-select v-model:value="currency" :options="currencies" title="选择币种" style="flex: 0 0 110px" />
      <am-input-number v-model:value="amount" mode="input" :min="0" placeholder="金额" />
      <am-button type="primary">
        转账
      </am-button>
    </am-space-compact>

    <am-space-compact block>
      <am-input v-model:value="weight" placeholder="重量" inputmode="decimal" />
      <am-picker v-model:value="unit" :columns="units" title="选择单位" style="flex: 0 0 96px" />
    </am-space-compact>

    <am-space-compact block>
      <am-space-addon>出发</am-space-addon>
      <am-date-picker v-model:value="date" placeholder="选择日期" />
      <am-button color="primary" variant="filled">
        查询
      </am-button>
    </am-space-compact>
  </am-flex>
</template>
