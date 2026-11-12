---
title: Segmented
subtitle: 分段控制器
description: 用于展示多个选项并允许用户选择其中单个选项。
group:
  title: 导航
  order: 3
---

## 何时使用 {#when-to-use}

- 在 2 ~ 5 个互斥的选项或视图之间切换，例如「日 / 周 / 月」。
- 选项数量少、标签短，希望所有选项始终可见。

API 与 antdv-next 的 `Segmented` 对齐，选中滑块带有平滑的滑动动画。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/block.vue">撑满宽度</demo>
<demo src="./demo/size.vue">尺寸与形状</demo>
<demo src="./demo/icon.vue">图标</demo>
<demo src="./demo/disabled.vue">禁用</demo>
<demo src="./demo/vertical.vue">垂直方向</demo>
<demo src="./demo/custom.vue">自定义渲染与主题变量</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 选项配置 | `(string \| number \| SegmentedLabeledOption)[]` | `[]` |
| value(v-model) | 当前选中的值 | `string \| number` | - |
| defaultValue | 默认选中的值 | `string \| number` | 第一个选项的值 |
| block | 宽度撑满父元素，选项等分宽度 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| shape | 形状 | `'default' \| 'round'` | `'default'` |
| disabled | 是否禁用 | `boolean` | `false` |
| vertical | 垂直排列 | `boolean` | `false` |
| orientation | 排列方向，优先于 `vertical` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'item' \| 'icon' \| 'label', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'item' \| 'icon' \| 'label', CSSProperties>` | - |

### SegmentedLabeledOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项文本 | `VueNode` | - |
| value | 选项的值 | `string \| number` | - |
| icon | 选项图标 | `VueNode` | - |
| disabled | 是否禁用该选项 | `boolean` | `false` |
| className | 选项类名 | `string` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 选中项变化时触发 | `(value: string \| number) => void` |
| update:value | 选中项变化时触发，用于 `v-model:value` | `(value: string \| number) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| iconRender | 自定义图标，优先于 `option.icon` | `SegmentedLabeledOption` |
| labelRender | 自定义文本，优先于 `option.label` | `SegmentedLabeledOption` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Segmented` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-segmented-height` | 整体高度 | `var(--am-control-height-sm)` |
| `--am-segmented-padding` | 轨道内边距 | `2px` |
| `--am-segmented-font-size` | 字号 | `var(--am-font-size)` |
| `--am-segmented-item-padding-inline` | 选项水平内边距 | `var(--am-padding-sm)` |
| `--am-segmented-background` | 轨道背景色 | `var(--am-color-fill-secondary)` |
| `--am-segmented-color` | 选项文字颜色 | `var(--am-color-text-secondary)` |
| `--am-segmented-selected-color` | 选中项文字颜色 | `var(--am-color-text)` |
| `--am-segmented-selected-background` | 选中滑块背景色 | `var(--am-color-bg-elevated)` |
| `--am-segmented-border-radius` | 轨道圆角 | `var(--am-border-radius)` |
| `--am-segmented-item-border-radius` | 选项与滑块圆角 | 轨道圆角减去内边距 |

## 与 PC 端的差异 {#diff}

- 选项不支持 `tooltip`（移动端没有 hover），也没有 hover 态，按压反馈使用 `:active`。
- 不支持 `name`：选项使用 `role="radio"` 的元素实现，不渲染原生 `<input type="radio">`。
- `options` 的值类型固定为 `string | number`，不提供泛型参数。
- 未受控且未设置 `defaultValue` 时默认选中第一项。
