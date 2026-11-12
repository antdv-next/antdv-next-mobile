<docs lang="zh-CN">
默认插槽替换内置触发器，常与 `List` 搭配；在 `Form` 中直接使用内置触发器，自动呈现为无边框的单元格内容。
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { regions } from './data'

const value = ref(['shanghai', 'pudong'])
const model = reactive<{ region: string[] }>({ region: [] })
</script>

<template>
  <am-list header="搭配 List">
    <am-cascader v-model:value="value" :options="regions" title="收货地区">
      <template #default="{ label, toggle }">
        <am-list-item title="收货地区" :extra="label || '请选择'" clickable @click="toggle()" />
      </template>
    </am-cascader>
  </am-list>
  <am-form :model="model" header="搭配 Form">
    <am-form-item name="region" label="所在地区" :rules="[{ required: true, type: 'array', message: '请选择所在地区' }]">
      <am-cascader v-model:value="model.region" :options="regions" title="所在地区" placeholder="请选择所在地区" />
    </am-form-item>
  </am-form>
</template>
