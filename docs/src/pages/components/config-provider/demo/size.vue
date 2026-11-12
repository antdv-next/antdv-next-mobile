<docs lang="zh-CN">
`componentSize` 与 `componentDisabled` 统一控制内部组件的尺寸和禁用状态。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref<'small' | 'middle' | 'large'>('middle')
const disabled = ref(false)
</script>

<template>
  <am-flex vertical gap="middle">
    <am-segmented
      v-model:value="size"
      block
      :options="[{ label: 'Small', value: 'small' }, { label: 'Middle', value: 'middle' }, { label: 'Large', value: 'large' }]"
    />
    <am-flex gap="small" align="center">
      禁用 <am-switch v-model:checked="disabled" />
    </am-flex>
    <am-config-provider :component-size="size" :component-disabled="disabled">
      <am-flex vertical gap="small">
        <am-input placeholder="请输入" />
        <am-flex gap="small" align="center" wrap>
          <am-button type="primary">
            按钮
          </am-button>
          <am-button>按钮</am-button>
          <am-switch />
        </am-flex>
      </am-flex>
    </am-config-provider>
  </am-flex>
</template>
