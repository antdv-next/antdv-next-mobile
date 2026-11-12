<docs lang="zh-CN">
设置 `vertical`（或 `orientation="vertical"`）纵向拼接，常用于一组上下排列的操作或输入。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const account = ref('')
const password = ref('')
</script>

<template>
  <am-flex vertical gap="middle">
    <am-space-compact vertical block>
      <am-input v-model:value="account" placeholder="账号" />
      <am-input-password v-model:value="password" placeholder="密码" />
    </am-space-compact>

    <am-space-compact vertical block>
      <am-button block>
        拍照
      </am-button>
      <am-button block>
        从相册选择
      </am-button>
      <am-button block danger>
        删除头像
      </am-button>
    </am-space-compact>
  </am-flex>
</template>
