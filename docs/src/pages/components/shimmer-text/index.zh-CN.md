---
title: ShimmerText
subtitle: 流光文字
description: 带有高光扫过效果的文字，用于表示正在生成、加载或处理中。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- AI 生成、搜索、同步等耗时操作中，用一句文案说明当前正在做什么。
- 比 [Spin](/components/spin) 更轻、信息量更大；内容结构未知时用 [Skeleton](/components/skeleton)。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/custom.vue">颜色与速度</demo>
<demo src="./demo/active.vue">停止动画</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 文字内容，默认插槽优先 | `VueNode` | - |
| active | 是否播放流光动画，`false` 时显示为普通文字 | `boolean` | `true` |
| duration | 扫过一次的时间，数字单位为秒 | `number \| string` | `2` |
| color | 文字底色 | `string` | - |
| shimmerColor | 高光颜色 | `string` | - |
| tag | 根节点标签 | `string` | `'span'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root', string>` | - |
| styles | 语义化结构样式 | `Record<'root', CSSProperties>` | - |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 文字内容 | - |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.ShimmerText` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-shimmer-text-color` | 文字底色 | `var(--am-color-text-tertiary)` |
| `--am-shimmer-text-shimmer-color` | 高光颜色 | `var(--am-color-text)` |
| `--am-shimmer-text-duration` | 扫过一次的时间 | `2s` |
| `--am-shimmer-text-spread` | 高光的宽度 | `20%` |

## 与 PC 端的差异 {#diff}

- 移动端特有组件，Antdv Next 没有对应组件。
- 系统开启「减弱动态效果」时不播放动画，显示为普通文字。
