<docs lang="zh-CN">
设置 `trigger` 后会渲染与其他选择类组件一致的触发器并显示格式化后的值，可以直接放进 `Form`；默认插槽则可以完全自定义触发器。
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive<{ date: string | null, stay: string[] }>({ date: null, stay: [] })
</script>

<template>
  <am-form :model="model">
    <am-form-item name="date" label="出发日期" :rules="[{ required: true, message: '请选择出发日期' }]">
      <am-calendar v-model:value="model.date" trigger value-format="YYYY-MM-DD" placeholder="请选择出发日期" :show-confirm="false" />
    </am-form-item>
    <am-form-item name="stay" label="入住离店">
      <am-calendar
        v-model:value="model.stay"
        trigger
        allow-clear
        selection-mode="range"
        value-format="YYYY-MM-DD"
        format="M月D日"
        placeholder="入住 - 离店"
      />
    </am-form-item>
  </am-form>
  <div style="padding: 12px 16px">
    <am-calendar v-model:value="model.date" value-format="YYYY-MM-DD">
      <template #default="{ label, toggle }">
        <am-button block @click="toggle()">
          {{ label || '自定义触发器' }}
        </am-button>
      </template>
    </am-calendar>
  </div>
</template>
