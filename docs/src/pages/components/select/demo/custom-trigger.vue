<docs lang="zh-CN">
默认插槽替换内置触发器，常与 `List` 搭配；在 `Form` 中直接使用内置触发器，自动呈现为无边框的单元格内容，并在提交值后触发校验。
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const languages = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
  { label: '日本語', value: 'ja-JP' },
]
const language = ref('zh-CN')

const model = reactive<{ type: string | null, tags: string[] }>({ type: null, tags: [] })
const types = ['功能建议', '体验问题', '程序错误', '其他'].map(label => ({ label, value: label }))
const tags = ['首页', '订单', '支付', '个人中心', '客服'].map(label => ({ label, value: label }))
</script>

<template>
  <am-list header="搭配 List">
    <am-select v-model:value="language" :options="languages" title="语言">
      <template #default="{ label, toggle }">
        <am-list-item title="语言" :extra="label" clickable @click="toggle()" />
      </template>
    </am-select>
  </am-list>
  <am-form :model="model" header="搭配 Form">
    <am-form-item name="type" label="反馈类型" :rules="[{ required: true, message: '请选择反馈类型' }]">
      <am-select v-model:value="model.type" :options="types" title="反馈类型" placeholder="请选择反馈类型" />
    </am-form-item>
    <am-form-item name="tags" label="相关模块">
      <am-select v-model:value="model.tags" :options="tags" mode="multiple" :max-tag-count="2" title="相关模块" placeholder="可多选" />
    </am-form-item>
  </am-form>
</template>
