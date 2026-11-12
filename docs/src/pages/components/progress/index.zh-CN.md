---
title: Progress
subtitle: 进度条
description: 展示操作的当前进度。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

在操作需要较长时间才能完成时，为用户显示该操作的当前进度和状态。

- 当一个操作会打断当前界面，或者需要在后台运行，且耗时可能超过 2 秒时。
- 当需要显示一个操作完成的百分比时。

API 与 Antdv Next 的 `Progress` 对齐：`type`（`line` / `circle` / `dashboard`）、`percent`、`status`、`strokeColor`（纯色 / 渐变）、`success`、`steps`、`size`、`percentPosition`。

## 代码演示 {#examples}

<demo src="./demo/line.vue">进度条</demo>
<demo src="./demo/circle.vue">进度圈</demo>
<demo src="./demo/dashboard.vue">仪表盘</demo>
<demo src="./demo/dynamic.vue">动态展示</demo>
<demo src="./demo/format.vue">自定义文字格式</demo>
<demo src="./demo/gradient.vue">渐变色</demo>
<demo src="./demo/segment.vue">分段进度条</demo>
<demo src="./demo/steps.vue">步骤进度条</demo>
<demo src="./demo/size.vue">尺寸与信息位置</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `'line' \| 'circle' \| 'dashboard'` | `'line'` |
| percent | 百分比 | `number` | `0` |
| status | 状态，`percent` 达到 100 时自动变为 `success`；`active` 仅对 `line` 生效 | `'normal' \| 'active' \| 'success' \| 'exception'` | - |
| showInfo | 是否显示进度数值或状态图标 | `boolean` | `true` |
| format | 内容的模板函数，默认插槽优先 | `(percent?: number, successPercent?: number) => VNodeChild` | `percent => percent + '%'` |
| strokeColor | 进度条的色彩：纯色、渐变，或 `steps` 模式下每一步的颜色数组 | `string \| string[] \| { from: string, to: string, direction?: string } \| Record<string, string>` | - |
| railColor | 未完成的分段的颜色 | `string` | - |
| strokeLinecap | 进度条的端点样式 | `'round' \| 'butt' \| 'square'` | `'round'` |
| strokeWidth | 线宽：`line` 为 px，`circle` / `dashboard` 为画布宽度的百分比 | `number` | `line`: `8`，其余 `6` |
| success | 成功进度条相关配置 | `{ percent?: number, strokeColor?: string }` | - |
| size | 尺寸。`line`：`[宽, 高]`（数字表示线条粗细）；`circle` / `dashboard`：直径 | `'small' \| 'medium' \| number \| [number \| string, number] \| { width?: number, height?: number }` | `'medium'` |
| steps | 进度条总共步数（仅 `line`） | `number \| { count: number, gap?: number }` | - |
| rounding | `steps` 模式下已完成步数的取整函数 | `(step: number) => number` | `Math.round` |
| percentPosition | 进度数值位置（仅 `line`）：`type` 为 `inner` 时显示在进度条内 | `{ align?: 'start' \| 'center' \| 'end', type?: 'inner' \| 'outer' }` | `{ align: 'end', type: 'outer' }` |
| gapDegree | 进度圈缺口角度，可取值 0 ~ 295 | `number` | `dashboard`: `75` |
| gapPlacement | 进度圈缺口位置 | `'top' \| 'bottom' \| 'start' \| 'end'` | `dashboard`: `'bottom'` |
| trailColor | 已废弃，请使用 `railColor` | `string` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'body' \| 'rail' \| 'track' \| 'indicator', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'body' \| 'rail' \| 'track' \| 'indicator', CSSProperties>` | - |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义进度信息内容，优先于 `format` | `{ percent: number, successPercent?: number }` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Progress` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-progress-color` | 进度条默认颜色 | `var(--am-color-primary)` |
| `--am-progress-rail-color` | 轨道颜色 | `var(--am-color-fill-secondary)` |
| `--am-progress-success-color` | 成功状态颜色 | `var(--am-color-success)` |
| `--am-progress-exception-color` | 异常状态颜色 | `var(--am-color-error)` |
| `--am-progress-line-height` | 条形进度条粗细 | `8px`（small `6px`） |
| `--am-progress-line-border-radius` | 条形进度条圆角 | `100px` |
| `--am-progress-info-color` | 进度文字颜色 | `var(--am-color-text)` |
| `--am-progress-info-font-size` | 进度文字字号 | `var(--am-font-size)` |
| `--am-progress-info-gap` | 进度条与文字的间距 | `var(--am-margin-xs)` |
| `--am-progress-circle-info-color` | 环形进度条文字颜色 | `var(--am-color-text)` |
| `--am-progress-steps-item-width` | 步骤进度条单格宽度 | `14px` |
| `--am-progress-steps-gap` | 步骤进度条间距 | `2px` |

## 与 PC 端的差异 {#diff}

- `size` 为数字且 `type="line"` 时表示线条粗细（PC 端同时作用于宽和高）。
- 环形进度条的渐变使用 SVG 线性渐变实现，不支持锥形渐变（conic）。
- `strokeColor` 传入多个颜色的数组时，条形进度条会渲染为等分的线性渐变。
- 环形进度条的 `steps` 暂不支持；不支持已废弃的 `width`、`gapPosition`。
- 小尺寸环形进度条不会在 hover 时用气泡展示数值，文字始终显示在圆环内，可通过 `showInfo` 隐藏。
