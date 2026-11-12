<docs lang="zh-CN">
默认插槽替换内置触发器；在 `Form` 中直接使用内置触发器即可。
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const remind = ref('09:00')
const model = reactive({ start: '09:00', end: '18:00' })
</script>

<template>
  <am-list header="搭配 List">
    <am-time-picker v-model:value="remind" format="HH:mm" value-format="HH:mm" title="提醒时间">
      <template #default="{ label, toggle }">
        <am-list-item title="每日提醒" :extra="label" clickable @click="toggle()" />
      </template>
    </am-time-picker>
  </am-list>
  <am-form :model="model" header="搭配 Form">
    <am-form-item name="start" label="开始营业">
      <am-time-picker v-model:value="model.start" format="HH:mm" value-format="HH:mm" :minute-step="30" />
    </am-form-item>
    <am-form-item name="end" label="结束营业">
      <am-time-picker v-model:value="model.end" format="HH:mm" value-format="HH:mm" :minute-step="30" />
    </am-form-item>
  </am-form>
</template>
