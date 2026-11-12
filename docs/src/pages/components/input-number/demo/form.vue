<docs lang="zh-CN">
在表单或列表中使用，典型的购物车数量选择。
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({ adult: 2, child: 0, room: 1 })
</script>

<template>
  <am-form :model="model" content-align="end">
    <am-form-item name="adult" label="成人" :rules="[{ type: 'number', min: 1, message: '至少 1 位成人' }]">
      <am-input-number v-model:value="model.adult" :min="0" :max="9" />
    </am-form-item>
    <am-form-item name="child" label="儿童" extra="2-12 周岁">
      <am-input-number v-model:value="model.child" :min="0" :max="6" />
    </am-form-item>
    <am-form-item name="room" label="房间数">
      <am-input-number v-model:value="model.room" :min="1" :max="5" />
    </am-form-item>
  </am-form>
</template>
