<docs lang="zh-CN">
`itemHeight` 与 `visibleItemCount` 决定滚轮的尺寸；`option` 插槽可以自定义选项内容；`fieldNames` 用于适配已有的数据结构。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  [
    { name: '经济舱', code: 'Y', price: 680 },
    { name: '超级经济舱', code: 'W', price: 980 },
    { name: '公务舱', code: 'C', price: 2180 },
    { name: '头等舱', code: 'F', price: 3960 },
  ],
]
const value = ref(['W'])
</script>

<template>
  <am-picker-view
    v-model:value="value"
    :columns="columns"
    :field-names="{ label: 'name', value: 'code' }"
    :item-height="56"
    :visible-item-count="3"
  >
    <template #option="{ option, selected }">
      <div class="cabin" :class="{ 'cabin-selected': selected }">
        <span>{{ option.name }}</span>
        <span class="cabin-price">¥{{ option.price }}</span>
      </div>
    </template>
  </am-picker-view>
</template>

<style scoped>
.cabin {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 100%;
  padding: 0 24px;
}

.cabin-price {
  color: var(--am-color-text-tertiary);
  font-size: 14px;
}

.cabin-selected {
  font-weight: 600;
}

.cabin-selected .cabin-price {
  color: var(--am-color-error);
}
</style>
