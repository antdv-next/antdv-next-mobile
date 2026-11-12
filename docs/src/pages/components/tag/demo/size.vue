<docs lang="zh-CN">
移动端特有：`size` 提供三种尺寸，`round` 得到胶囊形标签。
</docs>

<docs lang="en-US">
Mobile only: `size` offers three sizes, and `round` gives a pill-shaped tag.
</docs>

<template>
  <am-space vertical size="middle">
    <am-space align="center" wrap>
      <am-tag color="blue" size="small">
        small
      </am-tag>
      <am-tag color="blue">
        middle
      </am-tag>
      <am-tag color="blue" size="large">
        large
      </am-tag>
    </am-space>
    <am-space align="center" wrap>
      <am-tag color="red" variant="solid" size="small" round>
        Hot
      </am-tag>
      <am-tag color="orange" variant="outlined" round>
        30 off 200
      </am-tag>
      <am-tag color="green" size="large" round>
        Free shipping
      </am-tag>
    </am-space>
  </am-space>
</template>
