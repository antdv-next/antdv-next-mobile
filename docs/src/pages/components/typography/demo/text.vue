<docs lang="zh-CN">
内置不同样式的文本：语义类型、禁用、标记、代码、键盘、下划线、删除线、加粗与斜体。
</docs>

<template>
  <am-flex vertical gap="small">
    <am-typography-text>Antdv Next (default)</am-typography-text>
    <am-typography-text type="secondary">
      Antdv Next (secondary)
    </am-typography-text>
    <am-typography-text type="success">
      Antdv Next (success)
    </am-typography-text>
    <am-typography-text type="warning">
      Antdv Next (warning)
    </am-typography-text>
    <am-typography-text type="danger">
      Antdv Next (danger)
    </am-typography-text>
    <am-typography-text disabled>
      Antdv Next (disabled)
    </am-typography-text>
    <am-typography-text mark>
      Antdv Next (mark)
    </am-typography-text>
    <am-typography-text code>
      Antdv Next (code)
    </am-typography-text>
    <am-typography-text keyboard>
      Antdv Next (keyboard)
    </am-typography-text>
    <am-typography-text underline>
      Antdv Next (underline)
    </am-typography-text>
    <am-typography-text delete>
      Antdv Next (delete)
    </am-typography-text>
    <am-typography-text strong>
      Antdv Next (strong)
    </am-typography-text>
    <am-typography-text italic>
      Antdv Next (italic)
    </am-typography-text>
    <am-typography-text strong underline type="danger">
      组合使用 (strong + underline + danger)
    </am-typography-text>
  </am-flex>
</template>
