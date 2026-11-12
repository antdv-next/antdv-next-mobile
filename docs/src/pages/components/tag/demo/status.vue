<docs lang="zh-CN">
预设五种状态颜色：`success`、`processing`、`warning`、`error`、`default`，用于表示订单、任务等的状态。
</docs>

<script setup lang="ts">
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@antdv-next/icons'
</script>

<template>
  <am-space vertical size="middle">
    <am-space wrap>
      <am-tag color="success">
        已完成
      </am-tag>
      <am-tag color="processing">
        进行中
      </am-tag>
      <am-tag color="warning">
        待确认
      </am-tag>
      <am-tag color="error">
        已失败
      </am-tag>
      <am-tag color="default">
        未开始
      </am-tag>
    </am-space>
    <am-space wrap>
      <am-tag color="success">
        <template #icon>
          <CheckCircleOutlined />
        </template>
        已完成
      </am-tag>
      <am-tag color="processing">
        <template #icon>
          <SyncOutlined spin />
        </template>
        进行中
      </am-tag>
      <am-tag color="warning">
        <template #icon>
          <ExclamationCircleOutlined />
        </template>
        待确认
      </am-tag>
      <am-tag color="error">
        <template #icon>
          <CloseCircleOutlined />
        </template>
        已失败
      </am-tag>
      <am-tag color="default">
        <template #icon>
          <ClockCircleOutlined />
        </template>
        未开始
      </am-tag>
    </am-space>
  </am-space>
</template>
