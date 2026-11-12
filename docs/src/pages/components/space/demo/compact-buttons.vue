<docs lang="zh-CN">
多个按钮组合成按钮组。`size` 统一控制组内所有成员的尺寸，组内成员也可以单独指定。
</docs>

<script setup lang="ts">
import { DownOutlined, LeftOutlined, RightOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-flex vertical gap="middle" align="start">
    <am-space-compact>
      <am-button>上一步</am-button>
      <am-button>保存</am-button>
      <am-button>下一步</am-button>
    </am-space-compact>

    <am-space-compact>
      <am-button type="primary">
        提交订单
      </am-button>
      <am-button type="primary">
        <template #icon>
          <DownOutlined />
        </template>
      </am-button>
    </am-space-compact>

    <am-space-compact size="small">
      <am-button>
        <template #icon>
          <LeftOutlined />
        </template>
      </am-button>
      <am-button>1</am-button>
      <am-button color="primary" variant="filled">
        2
      </am-button>
      <am-button>3</am-button>
      <am-button>
        <template #icon>
          <RightOutlined />
        </template>
      </am-button>
    </am-space-compact>

    <am-space-compact size="large" block>
      <am-button block>
        取消
      </am-button>
      <am-button type="primary" block>
        确定
      </am-button>
    </am-space-compact>
  </am-flex>
</template>
