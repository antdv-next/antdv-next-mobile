<docs lang="zh-CN">
所有数据录入组件都遵循同一套表单约定：跟随 `Form` 的 `disabled`、`size`、`variant`，值变化后触发 `change` 校验。`contentAlign="end"` 让开关、步进器等小控件靠右对齐。
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const disabled = ref(false)
const model = reactive({
  count: 1,
  express: 'sf',
  tags: [] as string[],
  score: 3,
  budget: 30,
  size: ['m'],
  agree: false,
})

const expressOptions = [
  { label: '顺丰', value: 'sf' },
  { label: '京东', value: 'jd' },
  { label: '自提', value: 'self' },
]
const tagOptions = ['加急', '易碎', '保价']
const sizeOptions = [
  { label: 'S', value: 's' },
  { label: 'M', value: 'm' },
  { label: 'L', value: 'l' },
  { label: 'XL', value: 'xl', disabled: true },
]
const mustAgree = [{
  validator: async (_rule: unknown, value: boolean) => {
    if (!value)
      throw new Error('请先阅读并同意协议')
  },
}]
</script>

<template>
  <am-form :model="model" :disabled="disabled" :label-width="64">
    <am-form-item name="count" label="数量" content-align="end">
      <am-input-number v-model:value="model.count" :min="1" :max="10" />
    </am-form-item>
    <am-form-item name="size" label="尺码" :rules="[{ required: true, type: 'array', message: '请选择尺码' }]">
      <am-selector v-model:value="model.size" :options="sizeOptions" :columns="4" />
    </am-form-item>
    <am-form-item name="express" label="配送">
      <am-radio-group v-model:value="model.express" :options="expressOptions" />
    </am-form-item>
    <am-form-item name="tags" label="备注">
      <am-checkbox-group v-model:value="model.tags" :options="tagOptions" />
    </am-form-item>
    <am-form-item name="score" label="评分">
      <am-rate v-model:value="model.score" />
    </am-form-item>
    <am-form-item name="budget" label="预算">
      <am-slider v-model:value="model.budget" />
    </am-form-item>
    <am-form-item name="agree" :rules="mustAgree">
      <am-checkbox v-model:checked="model.agree">
        我已阅读并同意《用户协议》
      </am-checkbox>
    </am-form-item>
    <template #footer>
      <am-flex vertical gap="small">
        <am-button type="primary" html-type="submit" block>
          提交
        </am-button>
        <am-button block :disabled="false" @click="disabled = !disabled">
          {{ disabled ? '启用表单' : '禁用表单' }}
        </am-button>
      </am-flex>
    </template>
  </am-form>
</template>
