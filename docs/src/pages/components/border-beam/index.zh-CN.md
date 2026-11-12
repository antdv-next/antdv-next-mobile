---
title: BorderBeam
subtitle: 边框流光
description: 为容器边框提供持续流动的装饰性高亮效果。
group:
  title: 手势与其他
  order: 7
---

## 何时使用 {#when-to-use}

- 需要强化某个容器的视觉关注度，但又不希望引入业务状态语义时。
- 适合登录面板、推荐卡片、AI 模块、重点操作区等场景。
- 它是装饰性效果，不应替代焦点态、校验态或业务状态边框；一屏内建议只强调一两个容器。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/press.vue">按压时显示</demo>
<demo src="./demo/count.vue">多条流光</demo>
<demo src="./demo/custom-container.vue">自定义容器</demo>
<demo src="./demo/color.vue">渐变色</demo>
<demo src="./demo/duration.vue">动画时长</demo>
<demo src="./demo/size.vue">尺寸</demo>
<demo src="./demo/line-width.vue">线宽</demo>
<demo src="./demo/outset.vue">外扩距离</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 流光颜色，支持单色字符串或渐变停靠点数组。`percent` 使用 `0 ~ 100` 的输入区间，组件会在内部为尾部透明过渡预留空间 | `string \| { color: string, percent: number }[]` | 主题色渐变 |
| count | 均匀分布的流光数量，应为正整数（小数向下取整，非法值按 `1` 处理） | `number` | `1` |
| duration | 流光绕行一圈的时间，单位秒 | `number` | `6` |
| items | 每条流光的配置。数组长度决定流光数量，并且优先于 `count`；未设置的属性继承顶层的 `color`、`lineWidth`、`outset` 和 `size` | [BorderBeamItem](#borderbeamitem)`[]` | - |
| lineWidth | 流光线宽，数字按像素处理 | `number \| string` | `1px` |
| outset | 流光层相对容器内边缘的外扩距离，数字按像素处理 | `number \| string` | 容器的边框宽度（容器裁剪溢出时为 `0`） |
| size | 流光可见段的尺寸，数字按像素处理 | `number \| string` | `100` |
| rootClass | 流光层的类名 | `string` | - |
| classes | 语义化类名：`root`（流光层） | `BorderBeamSemanticClassNames` | - |
| styles | 语义化样式：`root`（流光层） | `BorderBeamSemanticStyles` | - |

传给 `BorderBeam` 的 `class`、`style` 和其他属性会落在每一个流光层上，而不是容器上。

### BorderBeamItem {#borderbeamitem}

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 当前流光的颜色配置 | `string \| { color: string, percent: number }[]` | - |
| lineWidth | 当前流光的线宽，数字按像素处理 | `number \| string` | - |
| outset | 当前流光相对容器内边缘的外扩距离 | `number \| string` | - |
| size | 当前流光可见段的尺寸，数字按像素处理 | `number \| string` | - |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 被流光修饰的容器，需为单个 DOM 元素，或只有一个根元素的组件 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.BorderBeam`（如 `{ lineWidth: 2 }`）或直接覆盖 CSS 变量定制。变量声明在流光层 `.am-border-beam` 上，对应的属性会以行内样式写入同名变量。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-border-beam-color` | 默认渐变的起始颜色（流光头部） | `var(--am-color-primary)` |
| `--am-border-beam-color-end` | 默认渐变的结束颜色 | `var(--am-color-primary-hover)` |
| `--am-border-beam-beam-gradient` | 流光渐变，由 `color` 属性写入 | 由上面两个颜色组成的渐变 |
| `--am-border-beam-line-width` | 线宽，由 `lineWidth` 属性写入 | `var(--am-line-width)` |
| `--am-border-beam-size` | 可见段尺寸，由 `size` 属性写入 | `100px` |
| `--am-border-beam-duration` | 绕行一圈的时间，由 `duration` 属性写入 | `6s` |
| `--am-border-beam-delay` | 动画延迟，多条流光时由组件写入 | `0s` |
| `--am-border-beam-inset-offset` | 流光层的 `inset`，由 `outset` 或测得的边框宽度写入 | `0px` |
| `--am-border-beam-opacity` | 流光的不透明度 | `0.95` |
| `--am-border-beam-z-index` | 流光层的层级 | `1` |

## FAQ

### 开启减少动态效果后会怎样？ {#faq-reduced-motion}

`BorderBeam` 是装饰效果。命中 `prefers-reduced-motion: reduce` 时，流光会被隐藏，容器本身不受影响。

### `color` 中的 `percent` 表示什么？ {#faq-color-percent}

`percent` 表示渐变停靠点的输入位置，取值范围为 `0 ~ 100`。组件会将这些停靠点映射到可见的流光段内（前 70%），并为尾部的透明过渡保留空间，使尾迹连续可见。

### `size` 的取值限制 {#faq-size-limit}

流光由一个边长为 `size` 的方形渐变层生成，它沿容器边框移动，遮罩只显示它与边框重叠的部分。流光经过水平边框时，渐变层会向边框两侧各延伸约 `size / 2`；当 `size` 接近或超过容器高度的两倍时，它可能同时覆盖上下两条边框，宽度方向同理。因此应保证 `size < 2 × min(width, height)`，手机上的小卡片尤其需要注意。

### 为什么没有效果？ {#faq-not-working}

- 默认插槽必须是**单个** DOM 元素，或只有一个根元素的组件；多个节点、纯文本或多根组件无法定位容器，不会渲染流光。
- 流光层使用 `position: absolute`，容器需要提供定位上下文（通常为 `position: relative`），`BorderBeam` 不会修改容器的样式。
- 流光层作为容器的最后一个子元素插入。如果容器的内容是由框架直接写入的纯文本（如 `<div>{{ text }}</div>`），文本更新时流光层会被一并替换掉，请用一个元素包裹文本。
- 浏览器需要支持 `offset-path: rect()` 与 `mask-composite`，较旧的浏览器不支持时流光层不显示，容器不受影响。
- 容器的边框宽度与是否裁剪溢出在挂载时读取一次，之后不再监听；圆角通过 `border-radius: inherit` 实时跟随，无需测量。

## 与 PC 端的差异 {#diff}

- 属性、插槽与 PC 完全一致；去掉了 `prefixCls`，按本库约定新增 `classes` / `styles`（`root`）。
- 样式由 CSS-in-JS 改为纯 CSS 变量：属性写入 `--am-border-beam-*`，默认值声明在 `.am-border-beam` 上；除 PC 的 `lineWidth` 外，颜色、尺寸、时长、不透明度和层级也都是可覆盖的主题变量。
- 容器裁剪溢出（`overflow` 不为 `visible`，例如本库的 Card）时，默认的 `outset` 自动为 `0`，流光贴在边框内侧而不会被裁掉；PC 需要手动设置 `outset={0}`。
- 没有 hover 态：PC 的「鼠标悬浮时显示」示例改为「按压时显示」（`:active`）。
- RTL 下流光逆时针绕行（PC 始终顺时针）。
- `count` 与 `items` 同时传入时以 `items` 为准，但不会输出开发环境警告。
- 流光层通过 `_base/Portal` 渲染到容器内，每条流光都是容器的直接子元素。
