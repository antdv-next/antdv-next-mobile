---
title: Statistic
subtitle: 统计数值
description: 展示统计数值，以及倒计时 / 正计时。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 当需要突出某个或某组数字时。
- 当需要展示带描述的统计类数据时使用。
- 秒杀、验证码、活动开始等需要倒计时的场景使用 `Statistic.Timer`。

API 与 antdv-next 的 `Statistic` / `Statistic.Timer` 对齐。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基本</demo>
<demo src="./demo/unit.vue">前缀与后缀</demo>
<demo src="./demo/card.vue">在卡片中使用</demo>
<demo src="./demo/formatter.vue">自定义格式</demo>
<demo src="./demo/loading.vue">加载中</demo>
<demo src="./demo/timer.vue">计时器</demo>
<demo src="./demo/timer-custom.vue">自定义倒计时样式</demo>

## API

### Statistic 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 数值的标题，同名插槽优先 | `VueNode` | - |
| value | 数值内容 | `number \| string` | `0` |
| precision | 数值精度（小数位数） | `number` | - |
| prefix | 数值的前缀，同名插槽优先 | `VueNode` | - |
| suffix | 数值的后缀，同名插槽优先 | `VueNode` | - |
| formatter | 自定义数值展示，同名插槽优先 | `(value: number \| string, config?: StatisticFormatConfig) => VNodeChild` | - |
| groupSeparator | 千分位标识符 | `string` | `,` |
| decimalSeparator | 小数点 | `string` | `.` |
| loading | 数值是否加载中 | `boolean` | `false` |
| valueStyle | 数值区域的样式 | `CSSProperties` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'header' \| 'title' \| 'content' \| 'prefix' \| 'value' \| 'suffix', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'header' \| 'title' \| 'content' \| 'prefix' \| 'value' \| 'suffix', CSSProperties>` | - |

### Statistic 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| title | 数值的标题 | - |
| prefix | 数值的前缀 | - |
| suffix | 数值的后缀 | - |
| formatter | 自定义数值展示 | `{ value: number \| string }` |

### Statistic.Timer 属性 {#timer-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 计时类型：倒计时或正计时 | `'countdown' \| 'countup'` | `'countdown'` |
| value | 目标时间（倒计时）或起始时间（正计时）的时间戳 | `number \| string` | `0` |
| format | 格式化模板，支持 `Y` `M` `D` `H` `m` `s` `S`，`[]` 内的文字原样输出 | `string` | `'HH:mm:ss'` |
| title | 标题，同名插槽优先 | `VueNode` | - |
| prefix | 前缀，同名插槽优先 | `VueNode` | - |
| suffix | 后缀，同名插槽优先 | `VueNode` | - |
| loading | 是否加载中 | `boolean` | `false` |
| valueStyle | 数值区域的样式 | `CSSProperties` | - |

同样支持 `rootClass`、`classes`、`styles`。

### Statistic.Timer 事件 {#timer-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| finish | 倒计时完成时触发，仅 `type="countdown"` 有效 | `() => void` |
| change | 时间变化时触发，参数为剩余 / 已过的毫秒数 | `(value: number) => void` |

### Statistic.Timer 插槽 {#timer-slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| title | 标题 | - |
| prefix | 前缀 | - |
| suffix | 后缀 | - |
| formatter | 自定义渲染，例如数字块样式 | `{ value: number, formatted: string, time: { days, hours, minutes, seconds, milliseconds } }` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Statistic` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-statistic-title-color` | 标题颜色 | `var(--am-color-text-description)` |
| `--am-statistic-title-font-size` | 标题字号 | `var(--am-font-size)` |
| `--am-statistic-title-margin` | 标题与数值的间距 | `var(--am-margin-xxs)` |
| `--am-statistic-content-color` | 数值颜色 | `var(--am-color-text-heading)` |
| `--am-statistic-content-font-size` | 数值字号 | `24px` |
| `--am-statistic-content-font-weight` | 数值字重 | `400` |
| `--am-statistic-decimal-font-size` | 小数部分字号 | `0.75em` |
| `--am-statistic-gap` | 前后缀与数值的间距 | `4px` |

## 与 PC 端的差异 {#diff}

- `Statistic.Timer` 的 `type` 默认为 `'countdown'`（PC 端为必填）。
- `Statistic.Timer` 新增 `formatter` 插槽，提供拆分好的 `time`（天 / 时 / 分 / 秒 / 毫秒），便于实现移动端常见的数字块倒计时。
- `formatter` 属性仅支持函数，不支持 PC 端内部使用的 `'number'` / `'countdown'` 字面量。
- 不支持 `valueRender`，不透出 `mouseenter` / `mouseleave` 事件；没有已废弃的 `Statistic.Countdown`。
- 页面被 `KeepAlive` 缓存时计时器自动暂停，激活后按当前时间继续。
