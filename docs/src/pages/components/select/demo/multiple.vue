<docs lang="zh-CN">
`mode="multiple"` 开启多选：在弹层中勾选，点击「确定」提交。`maxCount` 限制可选个数，`maxTagCount` 限制触发器中显示的个数，`maxTagPlaceholder` 自定义省略文案。
</docs>

<script setup lang="ts">
import type { SelectLabeledValue } from 'antdv-next-mobile'
import { ref } from 'vue'

const options = ['阅读', '音乐', '电影', '旅行', '摄影', '健身', '美食', '游戏'].map(label => ({ label, value: label }))
const hobbies = ref(['阅读', '旅行'])
const limited = ref(['音乐', '电影', '摄影'])

const maxTagPlaceholder = (omitted: SelectLabeledValue[]) => `等 ${omitted.length + 2} 项`
</script>

<template>
  <am-flex vertical gap="small">
    <am-select v-model:value="hobbies" :options="options" mode="multiple" title="兴趣爱好" placeholder="请选择兴趣爱好" allow-clear />
    <am-select
      v-model:value="limited"
      :options="options"
      mode="multiple"
      :max-count="3"
      :max-tag-count="2"
      :max-tag-placeholder="maxTagPlaceholder"
      title="最多选择 3 项"
    />
  </am-flex>
</template>
