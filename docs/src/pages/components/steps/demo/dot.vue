<docs lang="zh-CN">
`type="dot"` 使用圆点代替图标，横向与竖向均可使用。
</docs>

<script setup lang="ts">
import type { StepsItem } from 'antdv-next-mobile'

const items: StepsItem[] = [
  { title: '填写信息' },
  { title: '身份验证' },
  { title: '设置密码' },
  { title: '完成' },
]

const timeline: StepsItem[] = [
  { title: '发起审批', content: '张三 · 09:00' },
  { title: '部门主管审批', content: '李四 · 审批中' },
  { title: '财务审批' },
]
</script>

<template>
  <am-flex vertical gap="large">
    <am-steps type="dot" :current="2" :items="items" />
    <am-steps type="dot" orientation="vertical" :current="1" :items="timeline" />
  </am-flex>
</template>
