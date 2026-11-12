<docs lang="zh-CN">
默认插槽替换内置触发器；在 `Form` 中直接使用内置触发器即可。
</docs>

<docs lang="en-US">
The default slot replaces the built-in trigger; inside `Form`, just use the built-in trigger directly.
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const remind = ref('09:00')
const model = reactive({ start: '09:00', end: '18:00' })
</script>

<template>
  <am-list header="With List">
    <am-time-picker v-model:value="remind" format="HH:mm" value-format="HH:mm" title="Reminder time">
      <template #default="{ label, toggle }">
        <am-list-item title="Daily reminder" :extra="label" clickable @click="toggle()" />
      </template>
    </am-time-picker>
  </am-list>
  <am-form :model="model" header="With Form">
    <am-form-item name="start" label="Opens at">
      <am-time-picker v-model:value="model.start" format="HH:mm" value-format="HH:mm" :minute-step="30" />
    </am-form-item>
    <am-form-item name="end" label="Closes at">
      <am-time-picker v-model:value="model.end" format="HH:mm" value-format="HH:mm" :minute-step="30" />
    </am-form-item>
  </am-form>
</template>
