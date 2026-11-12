<docs lang="zh-CN">
默认插槽可以替换内置触发器，常与 `List` 搭配；在 `Form` 中则直接使用内置触发器，自动呈现为无边框的单元格内容。
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { reactive, ref } from 'vue'

const birthday = ref<Dayjs | null>(dayjs('1995-06-15'))
const model = reactive<{ expire: string | null }>({ expire: null })
</script>

<template>
  <am-list header="搭配 List">
    <am-date-picker v-model:value="birthday" :max-date="dayjs()" :min-date="dayjs('1950-01-01')" title="出生日期">
      <template #default="{ label, toggle }">
        <am-list-item title="出生日期" :extra="label || '请选择'" clickable @click="toggle()" />
      </template>
    </am-date-picker>
  </am-list>
  <am-form :model="model" header="搭配 Form">
    <am-form-item name="expire" label="有效期至" :rules="[{ required: true, message: '请选择有效期' }]">
      <am-date-picker v-model:value="model.expire" value-format="YYYY-MM-DD" title="证件有效期" placeholder="请选择有效期" />
    </am-form-item>
  </am-form>
</template>
