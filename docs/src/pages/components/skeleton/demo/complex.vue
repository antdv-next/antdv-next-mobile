<docs lang="zh-CN">
更复杂的组合：带头像，并通过配置对象调整段落行数与宽度。
</docs>

<template>
  <am-flex vertical gap="large">
    <am-skeleton avatar :paragraph="{ rows: 3 }" />
    <am-skeleton
      :avatar="{ shape: 'square', size: 56 }"
      :title="{ width: '60%' }"
      :paragraph="{ rows: 2, width: ['100%', '40%'] }"
      round
    />
  </am-flex>
</template>
