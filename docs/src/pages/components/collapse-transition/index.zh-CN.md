---
title: CollapseTransition
subtitle: 折叠动效
description: 为任意内容添加高度展开 / 收起的过渡动画。
group:
  title: 手势与其他
  order: 7
---

## 何时使用 {#when-to-use}

- 「展开更多」、筛选项、表单的可选区块等需要平滑展开和收起的内容。
- 需要带标题的折叠面板时，直接使用 [Collapse](/components/collapse)，它的内容区就是基于本组件实现的。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/more.vue">展开更多</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否展开 | `boolean` | `false` |
| forceRender | 首次展开前就渲染内容 | `boolean` | `false` |
| destroyOnHidden | 收起后销毁内容 | `boolean` | `false` |
| appear | 初始即展开时是否播放展开动画 | `boolean` | `false` |
| tag | 根节点标签 | `string` | `'div'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root', string>` | - |
| styles | 语义化结构样式 | `Record<'root', CSSProperties>` | - |

高度动画作用在根节点上，内边距请写在内部内容上（带内边距的根节点无法收起到 0）。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| afterOpenChange | 展开 / 收起动画结束后触发 | `(open: boolean) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 折叠的内容 | - |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.CollapseTransition` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-collapse-transition-duration` | 动画时长 | `var(--am-motion-duration-slow)` |
| `--am-collapse-transition-timing-function` | 动画曲线 | `var(--am-motion-ease-in-out)` |

## 与 PC 端的差异 {#diff}

- Antdv Next 没有对外导出折叠动效，本组件为移动端新增。
- 属性命名沿用 PC 端弹层类组件的约定：`open`、`forceRender`、`destroyOnHidden`、`afterOpenChange`。
