---
title: Result
subtitle: 结果
description: 用于反馈一系列操作任务的处理结果。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 当有重要操作需告知用户处理结果，且反馈内容较为复杂时使用，例如支付成功页、提交失败页。
- 页面不存在、无权限或服务出错时的整页提示。

## 代码演示 {#examples}

<demo src="./demo/success.vue">成功</demo>
<demo src="./demo/info.vue">信息</demo>
<demo src="./demo/warning.vue">警告</demo>
<demo src="./demo/error.vue">失败与详情</demo>
<demo src="./demo/exception.vue">403 / 404 / 500</demo>
<demo src="./demo/custom-icon.vue">自定义图标</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| status | 结果的状态，决定图标和颜色 | `'success' \| 'error' \| 'info' \| 'warning' \| '403' \| '404' \| '500'`（异常状态也接受数字） | `'info'` |
| icon | 自定义图标，同名插槽优先；设为 `false` 或 `null` 不显示图标 | `VueNode` | - |
| title | 标题文字，同名插槽优先 | `VueNode` | - |
| subTitle | 副标题文字，同名插槽优先 | `VueNode` | - |
| extra | 操作区，同名插槽优先 | `VueNode` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'icon' \| 'title' \| 'subTitle' \| 'extra' \| 'body', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'icon' \| 'title' \| 'subTitle' \| 'extra' \| 'body', CSSProperties>` | - |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 补充内容，例如失败原因的详细说明，显示在带底色的内容区中 |
| icon | 自定义图标 |
| title | 标题 |
| subTitle | 副标题 |
| extra | 操作区 |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-result-padding` | 内边距 | `var(--am-padding-xl) var(--am-padding)` |
| `--am-result-icon-size` | 图标大小 | `64px` |
| `--am-result-icon-color` | 图标颜色，随 `status` 变化 | `var(--am-color-info)` |
| `--am-result-image-height` | 403 / 404 / 500 插图的高度 | `140px` |
| `--am-result-title-font-size` | 标题字号 | `20px` |
| `--am-result-subtitle-font-size` | 副标题字号 | `var(--am-font-size)` |
| `--am-result-body-bg` | 补充内容区的背景色 | `var(--am-color-fill-alter)` |

## 与 PC 端的差异 {#diff}

- 操作区 `extra` 位于补充内容之后（PC 端在补充内容之前），符合移动端主操作置于页面下方的习惯。
- 403 / 404 / 500 使用移动端重新绘制的轻量插图，颜色来自设计变量，暗色模式下自动适配。
- `icon` 额外支持 `false` / `null`，用于隐藏图标。
- 尺寸更紧凑：图标 64px、标题 20px。
