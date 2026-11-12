<docs lang="zh-CN">
通过默认插槽自定义面板内容。开启 `showFooter` 后面板底部显示「重置 / 确定」按钮（文字取自语言包），点击确定后自动收起。插槽参数中的 `close` 也可以用来收起面板。
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const tags = ['包邮', '七天退换', '当日发货', '有货', '新品', '折扣']
const draft = ref<string[]>([])
const applied = ref<string[]>([])
const sort = ref('default')
const state = reactive({ onlyStock: false })

const sortOptions = [
  { label: '综合排序', value: 'default' },
  { label: '最新发布', value: 'new' },
]

function toggle(tag: string) {
  draft.value = draft.value.includes(tag) ? draft.value.filter(t => t !== tag) : [...draft.value, tag]
}

function confirm() {
  applied.value = [...draft.value]
}
</script>

<template>
  <am-dropdown>
    <am-dropdown-item key="sort" v-model:value="sort" :options="sortOptions" />
    <am-dropdown-item
      key="filter"
      title="筛选"
      :highlight="applied.length > 0"
      show-footer
      @confirm="confirm"
      @reset="draft = []"
    >
      <div class="tags">
        <span
          v-for="tag in tags"
          :key="tag"
          class="tag"
          :class="{ active: draft.includes(tag) }"
          @click="toggle(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </am-dropdown-item>
    <am-dropdown-item key="more" title="更多">
      <template #default="{ close }">
        <div class="more">
          <p>这里可以放任意内容。</p>
          <am-button
            type="primary"
            size="small"
            @click="() => { state.onlyStock = !state.onlyStock; close() }"
          >
            {{ state.onlyStock ? '显示全部' : '仅看有货' }}并收起
          </am-button>
        </div>
      </template>
    </am-dropdown-item>
  </am-dropdown>
  <div class="page">
    已选标签：{{ applied.length ? applied.join('、') : '无' }}
  </div>
</template>

<style scoped>
.tags {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
}

.tag {
  padding: 8px 0;
  text-align: center;
  background: var(--am-color-fill-tertiary);
  border-radius: var(--am-border-radius);
}

.tag.active {
  color: var(--am-color-primary);
  background: var(--am-color-primary-bg);
}

.more {
  padding: 16px;
}

.more p {
  margin: 0 0 12px;
}

.page {
  padding: 48px 16px;
  color: var(--am-color-text-secondary);
  text-align: center;
}
</style>
