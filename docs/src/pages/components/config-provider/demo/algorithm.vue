<docs lang="zh-CN">
`algorithm` 支持亮色、暗色与紧凑三种算法，并可以用数组组合。
</docs>

<script setup lang="ts">
import { theme } from 'antdv-next-mobile'
import { computed, ref } from 'vue'

const dark = ref(true)
const compact = ref(false)

const algorithm = computed(() => [
  dark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  ...(compact.value ? [theme.compactAlgorithm] : []),
])
</script>

<template>
  <am-flex vertical gap="middle">
    <am-flex gap="large" align="center">
      <am-flex gap="small" align="center">
        暗色 <am-switch v-model:checked="dark" />
      </am-flex>
      <am-flex gap="small" align="center">
        紧凑 <am-switch v-model:checked="compact" />
      </am-flex>
    </am-flex>
    <am-config-provider :theme="{ algorithm }">
      <div class="panel">
        <am-flex vertical gap="small">
          <am-input placeholder="请输入内容" />
          <am-flex gap="small">
            <am-button type="primary">
              确定
            </am-button>
            <am-button>取消</am-button>
            <am-button danger>
              删除
            </am-button>
          </am-flex>
        </am-flex>
      </div>
    </am-config-provider>
  </am-flex>
</template>

<style scoped>
.panel {
  padding: var(--am-padding);
  color: var(--am-color-text);
  background: var(--am-color-bg-layout);
  border: 1px solid var(--am-color-border-secondary);
  border-radius: var(--am-border-radius-lg);
}
</style>
