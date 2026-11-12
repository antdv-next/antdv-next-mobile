<docs lang="zh-CN">
页面顶部通告形式，通栏展示，默认有图标且 `type` 为 `warning`。
</docs>

<template>
  <am-flex vertical gap="small">
    <am-alert banner title="系统将于今晚 23:00 进行升级维护" />
    <am-alert banner closable title="当前处于弱网环境，部分内容可能加载缓慢" type="info" />
    <am-alert banner type="error" :show-icon="false" title="不带图标的错误公告" />
  </am-flex>
</template>
