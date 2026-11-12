---
title: Steps
subtitle: 步骤条
description: 引导用户按照流程完成任务的导航条。
group:
  title: 导航
  order: 3
---

## 何时使用 {#when-to-use}

- 任务较复杂或存在先后关系时，将其分解成一系列步骤，降低用户的认知负担。
- 展示订单、物流、审批等流程的当前进度。

API 与 Antdv Next 的 `Steps` 对齐（`items`、`current`、`status`、`orientation`、`titlePlacement`、`type` 等）。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/status.vue">步骤状态</demo>
<demo src="./demo/vertical.vue">竖向步骤条</demo>
<demo src="./demo/dot.vue">点状步骤条</demo>
<demo src="./demo/icon.vue">自定义图标</demo>
<demo src="./demo/title-placement.vue">标题位置与尺寸</demo>
<demo src="./demo/clickable.vue">可点击切换</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 步骤配置 | [StepsItem](#stepsitem)[] | `[]` |
| current(v-model) | 当前步骤，从 `initial` 开始计数 | `number` | `0` |
| initial | 起始序号 | `number` | `0` |
| status | 当前步骤的状态 | `'wait' \| 'process' \| 'finish' \| 'error'` | `'process'` |
| orientation | 步骤条方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| titlePlacement | 标题相对图标的位置，仅水平方向生效 | `'horizontal' \| 'vertical'` | `'vertical'` |
| type | 步骤条类型 | `'default' \| 'dot'` | `'default'` |
| size | 尺寸 | `'default' \| 'small'` | `'default'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'item' \| 'itemIcon' \| 'itemSection' \| 'itemHeader' \| 'itemTitle' \| 'itemSubtitle' \| 'itemContent' \| 'itemRail', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'item' \| 'itemIcon' \| 'itemSection' \| 'itemHeader' \| 'itemTitle' \| 'itemSubtitle' \| 'itemContent' \| 'itemRail', CSSProperties>` | - |
| ~~direction~~ | 请使用 `orientation` | `'horizontal' \| 'vertical'` | - |
| ~~labelPlacement~~ | 请使用 `titlePlacement` | `'horizontal' \| 'vertical'` | - |
| ~~progressDot~~ | 请使用 `type="dot"` | `boolean` | `false` |

### StepsItem

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `VueNode` | - |
| subTitle | 子标题 | `VueNode` | - |
| content | 步骤的详情描述 | `VueNode` | - |
| icon | 自定义图标 | `VueNode` | - |
| status | 指定状态，未设置时根据 `current` 自动推导 | `'wait' \| 'process' \| 'finish' \| 'error'` | - |
| disabled | 禁用点击 | `boolean` | `false` |
| class | 步骤类名 | `string` | - |
| style | 步骤样式 | `CSSProperties` | - |
| ~~description~~ | 请使用 `content` | `VueNode` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 点击切换步骤时触发。监听该事件（或使用 `v-model:current`）后步骤才可点击 | `(current: number) => void` |
| update:current | 点击切换步骤时触发，用于 `v-model:current` | `(current: number) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| iconRender | 自定义图标渲染，优先于 `item.icon` | `{ item: StepsItem, index: number, status: string, active: boolean }` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Steps` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-steps-icon-size` | 图标容器尺寸 | `28px` |
| `--am-steps-icon-font-size` | 序号字号 | `var(--am-font-size)` |
| `--am-steps-custom-icon-font-size` | 自定义图标字号 | `22px` |
| `--am-steps-dot-size` | 点状步骤条的圆点尺寸 | `8px` |
| `--am-steps-title-font-size` | 标题字号 | `var(--am-font-size)` |
| `--am-steps-title-line-height` | 标题行高 | `22px` |
| `--am-steps-content-font-size` | 描述字号 | `var(--am-font-size-sm)` |
| `--am-steps-rail-size` | 连接线粗细 | `var(--am-line-width)` |
| `--am-steps-rail-color` | 连接线颜色 | `var(--am-color-border)` |
| `--am-steps-rail-gap` | 连接线与图标的间距 | `6px` |
| `--am-steps-process-color` | 进行中的颜色 | `var(--am-color-primary)` |
| `--am-steps-finish-color` | 已完成的颜色 | `var(--am-color-primary)` |
| `--am-steps-error-color` | 错误的颜色 | `var(--am-color-error)` |
| `--am-steps-wait-color` | 等待中的颜色 | `var(--am-color-text-tertiary)` |
| `--am-steps-item-gap` | 竖向步骤之间的间距 | `var(--am-padding)` |

## 与 PC 端的差异 {#diff}

- 水平方向的 `titlePlacement` 默认为 `vertical`（标题在图标下方），更适合窄屏；PC 端默认为 `horizontal`。
- `type` 只支持 `default` 和 `dot`，不支持 `navigation`、`inline`、`panel`。
- 不支持 `variant`、`percent`、`responsive`、`ellipsis`、`maxCount`、`offset`；`progressDot` 只支持布尔值。
- `iconRender` 只提供插槽，参数为 `{ item, index, status, active }`；步骤项不支持 `onClick`，请使用 `change` 事件。
- 使用 `v-model:current` 时步骤同样可点击（PC 端需要监听 `change`）。
