<docs lang="zh-CN">
不包裹任何内容时，徽标作为独立元素展示，常用于列表项的右侧。
</docs>

<template>
  <am-space size="middle" align="center">
    <am-badge :count="11" />
    <am-badge :count="25" color="var(--am-color-fill)" :styles="{ indicator: { color: 'var(--am-color-text-secondary)', boxShadow: 'none' } }" />
    <am-badge :count="109" color="green" />
    <am-badge count="热" color="volcano" />
    <am-badge dot />
  </am-space>
</template>
