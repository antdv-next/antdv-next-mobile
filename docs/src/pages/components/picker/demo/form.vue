<docs lang="zh-CN">
在 `Form` 中会自动使用 `borderless` 形态并与输入框对齐；提交值后触发 `change` 校验，关闭弹层时触发 `blur` 校验。
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const model = reactive<{ name: string, education: string[], city: string[] }>({ name: '', education: [], city: [] })

const educations = [['高中', '大专', '本科', '硕士', '博士'].map(label => ({ label, value: label }))]
const cities = [['北京', '上海', '广州', '深圳', '杭州'].map(label => ({ label, value: label }))]

function submit() {
  formRef.value?.validate().catch(() => {})
}
</script>

<template>
  <am-form ref="formRef" :model="model">
    <am-form-item name="name" label="姓名" :rules="[{ required: true, message: '请输入姓名' }]">
      <am-input v-model:value="model.name" placeholder="请输入姓名" />
    </am-form-item>
    <am-form-item name="education" label="学历" :rules="[{ required: true, type: 'array', message: '请选择学历' }]">
      <am-picker v-model:value="model.education" :columns="educations" title="学历" placeholder="请选择学历" />
    </am-form-item>
    <am-form-item name="city" label="城市">
      <am-picker v-model:value="model.city" :columns="cities" title="城市" placeholder="请选择城市" allow-clear />
    </am-form-item>
    <template #footer>
      <am-button type="primary" block @click="submit">
        提交
      </am-button>
    </template>
  </am-form>
</template>
