<docs lang="zh-CN">
通过 `classes` 和 `styles` 定制语义化结构 `root` / `item` / `groupHeader` 的样式，或直接覆盖 `--am-listy-*` 主题变量。`rowHoverable` 设为 `false` 可以关闭行的按压反馈。
</docs>

<docs lang="en-US">
Customize the semantic parts `root` / `item` / `groupHeader` with `classes` and `styles`, or override the `--am-listy-*` tokens directly. `rowHoverable: false` turns off the press feedback of rows.
</docs>

<script setup lang="ts">
import type { ListyGroup, ListyProps } from '@antdv-next/mobile'

interface User {
  id: number
  name: string
  team: string
}

const users: User[] = [
  { id: 0, name: 'Olivia', team: 'Design' },
  { id: 1, name: 'Liam', team: 'Design' },
  { id: 2, name: 'Emma', team: 'Design' },
  { id: 3, name: 'Noah', team: 'Engineering' },
  { id: 4, name: 'Ava', team: 'Engineering' },
  { id: 5, name: 'Ethan', team: 'Engineering' },
  { id: 6, name: 'Sophia', team: 'Marketing' },
  { id: 7, name: 'Lucas', team: 'Marketing' },
]

const group: ListyGroup = {
  key: (user: User) => user.team,
  title: team => team,
}

const itemRender = (user: User) => user.name

const classes: ListyProps['classes'] = {
  root: 'listy-custom-root',
  groupHeader: 'listy-custom-group-header',
}

const styles: ListyProps['styles'] = {
  item: { fontStyle: 'italic' },
}
</script>

<template>
  <am-listy
    :items="users"
    row-key="id"
    :height="240"
    sticky
    :row-hoverable="false"
    :group="group"
    :item-render="itemRender"
    :classes="classes"
    :styles="styles"
  />
</template>

<style scoped>
.listy-custom-root {
  --am-listy-item-padding-block: 8px;

  border: 1px solid var(--am-color-primary-border);
  border-radius: var(--am-border-radius);
}

:deep(.listy-custom-group-header) {
  --am-listy-group-header-color: var(--am-color-primary);
  --am-listy-group-header-bg: var(--am-color-primary-bg);
  --am-listy-group-header-fill: transparent;
}
</style>
