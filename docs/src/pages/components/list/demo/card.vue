<docs lang="zh-CN">
`mode="card"` 渲染为带圆角与左右边距的卡片分组，常用于设置页。
</docs>

<script setup lang="ts">
function noop() {}
</script>

<template>
  <am-list mode="card" header="账号">
    <am-list-item extra="张三" @click="noop">
      昵称
    </am-list-item>
    <am-list-item extra="138****8888" @click="noop">
      手机号
    </am-list-item>
  </am-list>
  <am-list mode="card" header="通用" footer="卡片模式下 header 与 footer 会与内容对齐">
    <am-list-item extra="简体中文" @click="noop">
      语言
    </am-list-item>
    <am-list-item extra="跟随系统" @click="noop">
      深色模式
    </am-list-item>
    <am-list-item extra="128 MB" @click="noop">
      清理缓存
    </am-list-item>
  </am-list>
</template>
