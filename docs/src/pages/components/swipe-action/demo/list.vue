<docs lang="zh-CN">
包裹列表中的每一项。展开一项后触摸其他位置会自动收起，纵向滚动不受影响。
</docs>

<script setup lang="ts">
import type { SwipeActionItem } from 'antdv-next-mobile'
import { ref } from 'vue'

const list = ref([
  { id: 1, title: '周报已提交', time: '09:30' },
  { id: 2, title: '设计评审会议', time: '10:00' },
  { id: 3, title: '发布 1.0 版本', time: '14:00' },
  { id: 4, title: '团队聚餐', time: '18:30' },
])

const rightActions: SwipeActionItem[] = [
  { key: 'top', text: '置顶', color: 'primary' },
  { key: 'delete', text: '删除', color: 'danger' },
]

function onAction(action: SwipeActionItem, id: number) {
  const index = list.value.findIndex(item => item.id === id)
  if (index < 0)
    return
  if (action.key === 'delete')
    list.value.splice(index, 1)
  else
    list.value.unshift(...list.value.splice(index, 1))
}
</script>

<template>
  <am-list>
    <am-swipe-action
      v-for="item in list"
      :key="item.id"
      :right-actions="rightActions"
      @action="(action: SwipeActionItem) => onAction(action, item.id)"
    >
      <am-list-item :title="item.title" :extra="item.time" />
    </am-swipe-action>
  </am-list>
</template>
