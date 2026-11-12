<docs lang="zh-CN">
通过 `v-model:activeKey` 受控展开某一项，设为 `null` 收起；也可以调用实例的 `close()` 方法。`closeOnMaskClick` 设为 `false` 后点击遮罩不会收起。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const activeKey = ref<string | number | null>(null)
const value = ref('a')
const options = [
  { label: '选项 A', value: 'a' },
  { label: '选项 B', value: 'b' },
]
</script>

<template>
  <am-dropdown v-model:active-key="activeKey" :close-on-mask-click="false">
    <am-dropdown-item key="first" v-model:value="value" title="第一项" :options="options" />
    <am-dropdown-item key="second" title="第二项">
      <div class="panel">
        <p>点击遮罩不会收起</p>
        <am-button type="primary" size="small" @click="activeKey = null">
          收起
        </am-button>
      </div>
    </am-dropdown-item>
  </am-dropdown>
  <div class="page">
    <p>activeKey: {{ activeKey ?? 'null' }}</p>
    <am-flex gap="small" justify="center">
      <am-button size="small" @click="activeKey = 'first'">
        展开第一项
      </am-button>
      <am-button size="small" @click="activeKey = 'second'">
        展开第二项
      </am-button>
    </am-flex>
  </div>
</template>

<style scoped>
.panel {
  padding: 16px;
}

.panel p {
  margin: 0 0 12px;
}

.page {
  padding: 24px 16px 48px;
  color: var(--am-color-text-secondary);
  text-align: center;
}
</style>
