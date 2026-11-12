<docs lang="zh-CN">
列表项的 `extra` 与默认插槽可以放置任意组件，例如开关、输入框和按钮。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const wifi = ref(true)
const bluetooth = ref(false)
const name = ref('')
</script>

<template>
  <am-list header="搭配开关">
    <am-list-item>
      无线局域网
      <template #extra>
        <am-switch v-model:checked="wifi" />
      </template>
    </am-list-item>
    <am-list-item description="开启后可被附近的设备发现">
      蓝牙
      <template #extra>
        <am-switch v-model:checked="bluetooth" />
      </template>
    </am-list-item>
  </am-list>
  <am-list header="搭配输入框与按钮">
    <am-list-item>
      <template #prefix>
        设备名称
      </template>
      <am-input v-model:value="name" variant="borderless" placeholder="请输入" />
    </am-list-item>
    <am-list-item>
      固件版本 1.2.0
      <template #extra>
        <am-button size="small" type="primary">
          更新
        </am-button>
      </template>
    </am-list-item>
  </am-list>
</template>
