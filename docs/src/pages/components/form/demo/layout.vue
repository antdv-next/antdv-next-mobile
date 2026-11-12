<docs lang="zh-CN">
`layout="vertical"` 时标签在控件上方，适合标签较长或控件需要更多宽度的场景；`FormItem` 可以用 `layout` 单独覆盖。水平布局下可通过 `labelWidth`、`labelAlign`、`colon`、`contentAlign` 调整对齐。
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const layout = ref<'horizontal' | 'vertical'>('vertical')
const model = reactive({ title: '', content: '', type: ['bug'], anonymous: false })
const layoutOptions = [
  { label: '垂直 vertical', value: 'vertical' },
  { label: '水平 horizontal', value: 'horizontal' },
]
const typeOptions = [
  { label: '功能异常', value: 'bug' },
  { label: '产品建议', value: 'feature' },
  { label: '其他', value: 'other' },
]
</script>

<template>
  <div style="padding: 12px 16px">
    <am-radio-group v-model:value="layout" :options="layoutOptions" option-type="button" button-style="solid" size="small" />
  </div>
  <am-form :model="model" :layout="layout" :label-width="72" header="意见反馈">
    <am-form-item name="title" label="标题" :rules="[{ required: true }]">
      <am-input v-model:value="model.title" placeholder="一句话描述问题" />
    </am-form-item>
    <am-form-item name="type" label="反馈类型">
      <am-selector v-model:value="model.type" :options="typeOptions" :columns="3" />
    </am-form-item>
    <am-form-item name="content" label="详细描述" :rules="[{ required: true }]">
      <am-textarea v-model:value="model.content" :auto-size="{ minRows: 3, maxRows: 6 }" :maxlength="200" show-count placeholder="请描述你遇到的问题" />
    </am-form-item>
    <am-form-item name="anonymous" label="匿名提交" layout="horizontal" content-align="end">
      <am-switch v-model:checked="model.anonymous" />
    </am-form-item>
    <template #footer>
      <am-button type="primary" html-type="submit" block>
        提交
      </am-button>
    </template>
  </am-form>
</template>
