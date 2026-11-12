<docs lang="zh-CN">
默认插槽可以替换内置的触发器，插槽参数提供 `label`、`value`、`open` 与 `toggle`。也可以设置 `:trigger="false"`，完全通过 `v-model:open` 控制弹层。
</docs>

<docs lang="en-US">
The default slot replaces the built-in trigger; its slot params provide `label`, `value`, `open` and `toggle`. You can also set `:trigger="false"` and control the popup entirely with `v-model:open`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const genders = [[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Private', value: 'secret' }]]
const gender = ref(['secret'])

const sizes = [['S', 'M', 'L', 'XL', 'XXL'].map(label => ({ label, value: label }))]
const size = ref<string[]>([])
const open = ref(false)
</script>

<template>
  <am-list>
    <am-picker v-model:value="gender" :columns="genders" title="Gender">
      <template #default="{ label, toggle }">
        <am-list-item title="Gender" :extra="label || 'Please select'" clickable @click="toggle()" />
      </template>
    </am-picker>
    <am-list-item title="Size" :extra="size[0] || 'Please select'" clickable @click="open = true" />
  </am-list>
  <am-picker v-model:value="size" v-model:open="open" :columns="sizes" :trigger="false" title="Size" />
</template>
