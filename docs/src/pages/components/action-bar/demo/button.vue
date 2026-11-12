<docs lang="zh-CN">
`ActionBarButton` 就是组件库的 [Button](/components/button)，支持 `type`、`color`、`variant`、`danger`、`icon`、`loading`、`disabled` 等属性。
</docs>

<docs lang="en-US">
`ActionBarButton` is the library [Button](/components/button), so `type`, `color`, `variant`, `danger`, `icon`, `loading`, `disabled` and friends all work.
</docs>

<script setup lang="ts">
import { HeartOutlined, ShoppingCartOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const loading = ref(false)

function submit() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1500)
}
</script>

<template>
  <am-action-bar :fixed="false" :safe-area="false">
    <am-action-bar-button variant="filled" :icon="() => h(HeartOutlined)">
      Save
    </am-action-bar-button>
    <am-action-bar-button :icon="() => h(ShoppingCartOutlined)" :loading="loading" @click="submit">
      Checkout
    </am-action-bar-button>
  </am-action-bar>

  <am-action-bar :fixed="false" :safe-area="false" class="gap">
    <am-action-bar-button type="default">
      Cancel
    </am-action-bar-button>
    <am-action-bar-button danger>
      Delete
    </am-action-bar-button>
    <am-action-bar-button disabled>
      Sold out
    </am-action-bar-button>
  </am-action-bar>
</template>

<style scoped>
.gap {
  margin-top: 12px;
}
</style>
