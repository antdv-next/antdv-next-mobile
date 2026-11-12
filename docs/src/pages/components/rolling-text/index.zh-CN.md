---
title: RollingText
subtitle: 翻滚文本
description: 数字或文本像里程表一样逐位上下翻滚到目标值。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 需要以动画强调数值变化时，例如金额、积分、中奖号码、数据大屏。
- 需要让一组等长文本（时间、口令等）以翻牌的方式切换时，使用 `texts`。
- 只需静态展示数值请使用 [Statistic](/components/statistic)。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/direction.vue">翻滚方向与停止顺序</demo>
<demo src="./demo/texts.vue">翻滚文本</demo>
<demo src="./demo/custom.vue">自定义样式</demo>
<demo src="./demo/manual.vue">手动控制</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 目标数值 | `number` | `0` |
| from | 起始数值 | `number` | `0` |
| duration | 每一位的翻滚时长，单位秒 | `number` | `2` |
| autoStart | 是否在挂载后自动开始；开启时数值变化会重新翻滚 | `boolean` | `true` |
| direction | 翻滚方向 | `'up' \| 'down'` | `'down'` |
| stopOrder | 各位停止的先后顺序，`ltr` 从左到右，`rtl` 从右到左 | `'ltr' \| 'rtl'` | `'ltr'` |
| texts | 设置后按列翻滚这组等长文本而不是数字，第一项为起始内容，最后一项为目标内容 | `string[]` | - |
| height | 行高，数字单位为 px | `number \| string` | `40` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'item', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'item', CSSProperties>` | - |

- `from` 与 `value` 会补零到相同位数（`from: 0`、`value: 123` 即 `000` → `123`），并统一小数位数；小数点与负号不参与翻滚。
- 相邻两位依次间隔 0.2 秒停止，整体时长为 `duration + 0.2 × (位数 - 1)` 秒。
- `autoStart` 为 `false` 时，数值变化后回到起始状态，等待再次调用 `start()`。
- 根节点带有 `role="img"` 与内容为目标值的 `aria-label`，翻滚的各列对读屏软件隐藏。
- 系统开启「减弱动态效果」（`prefers-reduced-motion`）时直接显示目标值，`finish` 仍会触发。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| finish | 最后一位停止翻滚时触发 | `() => void` |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| start | 从起始值开始（或重新开始）翻滚 | `() => void` |
| reset | 停止并回到起始值 | `() => void` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.RollingText` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-rolling-text-color` | 文字颜色 | `var(--am-color-text-heading)` |
| `--am-rolling-text-font-size` | 字号 | `24px` |
| `--am-rolling-text-font-weight` | 字重 | `var(--am-font-weight-strong)` |
| `--am-rolling-text-gap` | 各位之间的间距 | `0px` |
| `--am-rolling-text-item-height` | 行高，`height` 属性会覆盖它 | `40px` |
| `--am-rolling-text-item-width` | 每一位的宽度 | `auto` |
| `--am-rolling-text-item-background` | 每一位的背景 | `transparent` |
| `--am-rolling-text-item-border-radius` | 每一位的圆角 | `0` |

## 与 PC 端的差异 {#diff}

- 移动端新增组件，antdv-next（PC 端）没有对应组件。
