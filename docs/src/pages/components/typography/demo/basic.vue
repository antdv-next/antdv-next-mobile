<docs lang="zh-CN">
展示文档样例：`Typography` 作为容器，内部组合标题、段落与文本。
</docs>

<template>
  <am-typography>
    <am-typography-title :level="3">
      介绍
    </am-typography-title>
    <am-typography-paragraph>
      蚂蚁的企业级产品是一个庞大且复杂的体系。这类产品不仅量级巨大且功能复杂，而且变动和并发频繁，常常需要设计与开发能够快速的做出响应。
    </am-typography-paragraph>
    <am-typography-paragraph>
      随着商业化的趋势，越来越多的企业级产品对更好的用户体验有了进一步的要求。我们希望
      <am-typography-text strong>
        提炼出一套统一的设计语言
      </am-typography-text>
      ，帮助设计者和开发者
      <am-typography-text mark>
        快速搭建
      </am-typography-text>
      移动端界面。
    </am-typography-paragraph>
    <am-typography-title :level="4">
      设计资源
    </am-typography-title>
    <am-typography-paragraph type="secondary">
      按 <am-typography-text keyboard>
        Esc
      </am-typography-text> 键退出阅读，使用 <am-typography-text code>
        pnpm add antdv-next-mobile
      </am-typography-text> 安装。
    </am-typography-paragraph>
  </am-typography>
</template>
