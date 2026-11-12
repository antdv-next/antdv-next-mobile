<docs lang="zh-CN">
默认插槽可以替换内置的触发器，插槽参数提供 `label`、`value`、`open` 与 `toggle`。也可以设置 `:trigger="false"`，完全通过 `v-model:open` 控制弹层。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const genders = [[{ label: '男', value: 'male' }, { label: '女', value: 'female' }, { label: '保密', value: 'secret' }]]
const gender = ref(['secret'])

const sizes = [['S', 'M', 'L', 'XL', 'XXL'].map(label => ({ label, value: label }))]
const size = ref<string[]>([])
const open = ref(false)
</script>

<template>
  <am-list>
    <am-picker v-model:value="gender" :columns="genders" title="性别">
      <template #default="{ label, toggle }">
        <am-list-item title="性别" :extra="label || '请选择'" clickable @click="toggle()" />
      </template>
    </am-picker>
    <am-list-item title="尺码" :extra="size[0] || '请选择'" clickable @click="open = true" />
  </am-list>
  <am-picker v-model:value="size" v-model:open="open" :columns="sizes" :trigger="false" title="尺码" />
</template>
