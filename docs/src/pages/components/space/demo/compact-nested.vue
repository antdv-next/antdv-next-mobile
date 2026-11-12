<docs lang="zh-CN">
`Space.Compact` 可以嵌套，内层会延续外层的分组，只有整体最外侧保留圆角。在表单中，组内字段会自动使用带边框的样式。
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({ area: '+86', phone: '', code: '' })
const areas = [
  { label: '+86', value: '+86', description: '中国大陆' },
  { label: '+852', value: '+852', description: '中国香港' },
  { label: '+1', value: '+1', description: '美国' },
]
</script>

<template>
  <am-flex vertical gap="middle">
    <am-space-compact block>
      <am-space-addon>筛选</am-space-addon>
      <am-space-compact>
        <am-button>全部</am-button>
        <am-button color="primary" variant="filled">
          进行中
        </am-button>
        <am-button>已完成</am-button>
      </am-space-compact>
    </am-space-compact>

    <am-form :model="form" mode="card" layout="vertical">
      <am-form-item label="手机号" name="phone">
        <am-space-compact block>
          <am-select v-model:value="form.area" :options="areas" title="国家 / 地区" style="flex: 0 0 96px" />
          <am-input v-model:value="form.phone" placeholder="请输入手机号" inputmode="tel" />
        </am-space-compact>
      </am-form-item>
      <am-form-item label="验证码" name="code">
        <am-space-compact block>
          <am-input v-model:value="form.code" placeholder="6 位验证码" inputmode="numeric" />
          <am-button type="primary">
            获取验证码
          </am-button>
        </am-space-compact>
      </am-form-item>
    </am-form>
  </am-flex>
</template>
