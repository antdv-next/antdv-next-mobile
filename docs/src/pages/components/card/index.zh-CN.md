---
title: Card
subtitle: 卡片
description: 通用卡片容器。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 承载一组相关的信息：标题、内容与操作，例如订单卡片、商品卡片、信息流。
- 整张卡片可点击进入详情时，开启 `clickable` 获得按压反馈。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/borderless.vue">无边框</demo>
<demo src="./demo/cover.vue">封面与元信息</demo>
<demo src="./demo/actions.vue">操作栏与页脚</demo>
<demo src="./demo/clickable.vue">可点击卡片</demo>
<demo src="./demo/loading.vue">加载中</demo>
<demo src="./demo/inner.vue">内部卡片</demo>
<demo src="./demo/style-class.vue">语义化类名与组件变量</demo>

## API

### Card 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 卡片标题，同名插槽优先 | `VueNode` | - |
| extra | 标题栏右侧的内容，同名插槽优先 | `VueNode` | - |
| cover | 卡片封面，同名插槽优先 | `VueNode` | - |
| actions | 卡片底部的操作组，同名插槽优先 | `VueNode[]` | - |
| footer | 内容下方的自由页脚（移动端特有），同名插槽优先 | `VueNode` | - |
| loading | 加载中时以骨架屏占位 | `boolean` | `false` |
| variant | 形态变体 | `'outlined' \| 'borderless'` | `'outlined'` |
| bordered | 是否有边框，`false` 等价于 `variant="borderless"` | `boolean` | `true` |
| size | 卡片尺寸 | `'default' \| 'small'` | `'default'` |
| type | 卡片类型，`inner` 用于嵌套在卡片内 | `'inner'` | - |
| clickable | 整张卡片是否有按压反馈（移动端特有） | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'header' \| 'title' \| 'extra' \| 'cover' \| 'body' \| 'footer' \| 'actions', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'header' \| 'title' \| 'extra' \| 'cover' \| 'body' \| 'footer' \| 'actions', CSSProperties>` | - |

原生 `click` 等事件会透传到根节点，可直接使用 `@click`。

### Card 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 卡片内容 |
| title | 卡片标题 |
| extra | 标题栏右侧的内容 |
| cover | 卡片封面 |
| actions | 操作组，插槽中的每个根节点是一个操作 |
| footer | 页脚 |

### Card.Meta 属性 {#meta-props}

模板中使用 `<am-card-meta>`。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| avatar | 头像 / 图标，同名插槽优先 | `VueNode` | - |
| title | 标题，同名插槽优先 | `VueNode` | - |
| description | 描述，同名插槽优先 | `VueNode` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'avatar' \| 'section' \| 'title' \| 'description', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'avatar' \| 'section' \| 'title' \| 'description', CSSProperties>` | - |

### Card.Meta 插槽 {#meta-slots}

| 插槽 | 说明 |
| --- | --- |
| avatar | 头像 / 图标 |
| title | 标题 |
| description | 描述 |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-card-bg` | 卡片背景色 | `var(--am-color-bg-container)` |
| `--am-card-border-color` | 边框与分割线颜色 | `var(--am-color-border-secondary)` |
| `--am-card-border-radius` | 圆角 | `var(--am-border-radius-lg)` |
| `--am-card-padding` | 内容区内边距与标题栏水平内边距 | `var(--am-padding)`（`small` 为 `var(--am-padding-sm)`） |
| `--am-card-header-height` | 标题栏最小高度 | `48px` |
| `--am-card-header-font-size` | 标题字号 | `var(--am-font-size-lg)` |
| `--am-card-header-bg` | 标题栏背景色 | `transparent` |
| `--am-card-actions-bg` | 操作栏背景色 | `var(--am-color-bg-container)` |
| `--am-card-actions-height` | 操作栏最小高度 | `44px` |

## 与 PC 端的差异 {#diff}

- 新增 `clickable`（按压缩放 + 透明度反馈）替代 PC 的 `hoverable`。
- 新增 `footer` 属性 / 插槽与对应的语义化结构。
- 不支持页签相关能力：`tabList`、`activeTabKey`、`defaultActiveTabKey`、`tabBarExtraContent`、`tabProps` 与 `tabChange` 事件，请在卡片内容中组合 `Tabs`。
- 不提供 `Card.Grid`，宫格布局请使用 `Grid`。
- 不支持已废弃的 `headStyle` / `bodyStyle`，请使用 `styles.header` / `styles.body`。
- 加载态为内置的轻量骨架，不依赖 `Skeleton` 组件。
