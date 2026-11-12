<docs lang="zh-CN">
在实现全选效果时，可以使用 `indeterminate` 属性表示「部分选中」。
</docs>

<script setup lang="ts">
import type { CheckboxChangeEvent } from 'antdv-next-mobile'
import { computed, ref } from 'vue'

const options = ['苹果', '梨', '橙子']
const checkedList = ref<string[]>(['苹果'])

const checkAll = computed(() => checkedList.value.length === options.length)
const indeterminate = computed(() => checkedList.value.length > 0 && !checkAll.value)

function onCheckAllChange(e: CheckboxChangeEvent) {
  checkedList.value = e.target.checked ? [...options] : []
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-checkbox :checked="checkAll" :indeterminate="indeterminate" @change="onCheckAllChange">
      全选
    </am-checkbox>
    <am-checkbox-group v-model:value="checkedList" :options="options" />
  </am-flex>
</template>
