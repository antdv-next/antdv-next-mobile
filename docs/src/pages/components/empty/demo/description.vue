<docs lang="zh-CN">
通过 `description` 属性或同名插槽自定义描述，设为 `false` 时不显示描述。
</docs>

<template>
  <am-empty description="购物车空空如也" />
  <am-divider />
  <am-empty>
    <template #description>
      没有找到 <b class="keyword">“antdv”</b> 相关的结果
    </template>
  </am-empty>
  <am-divider />
  <am-empty :description="false" />
</template>

<style scoped>
.keyword {
  color: var(--am-color-primary);
  font-weight: normal;
}
</style>
