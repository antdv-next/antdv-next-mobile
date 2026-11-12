---
title: Barrage
subtitle: 弹幕
description: 在视频、直播、图片等内容上方横向飘过的评论。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 观看视频、直播时，实时展示其他用户的评论。
- 需要在一块内容上方营造热闹氛围的互动文字，如活动页、抽奖页。

`Barrage` 是移动端专属组件，Antdv Next（PC）中没有对应组件。默认插槽放置被弹幕覆盖的内容（视频、图片等），弹幕层不响应点击，下方内容保持可交互。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/control.vue">播放与暂停</demo>
<demo src="./demo/custom.vue">自定义弹幕</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value (v-model) | 弹幕列表，每个 `id` 只会生成一条弹幕；弹幕飞出容器后会从列表中移除 | [BarrageItem](#barrage-item)[] | - |
| defaultValue | 初始弹幕列表（非受控） | [BarrageItem](#barrage-item)[] | `[]` |
| rows | 弹幕轨道数，弹幕按顺序轮流分配到各轨道 | `number` | `4` |
| top | 第一条轨道距容器顶部的距离，单位 px | `number` | `10` |
| duration | 一条弹幕飞过容器所需的时间，单位毫秒 | `number` | `4000` |
| delay | 同一批加入的弹幕之间的间隔，单位毫秒；初始列表的第一条弹幕也会先等待一个 `delay` | `number` | `300` |
| autoPlay | 是否自动播放，为 `false` 时需调用 `play()` | `boolean` | `true` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'item', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'item', CSSProperties>` | - |

#### BarrageItem {#barrage-item}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 唯一标识 | `string \| number` | - |
| text | 弹幕内容，`item` 插槽优先 | `VueNode` | - |
| class | 弹幕的类名 | `string` | - |
| style | 弹幕的样式 | `CSSProperties` | - |

#### 列表的更新规则

- 弹幕飞出容器后，组件会把它从列表中移除，并依次触发 `finish`、`update:value`、`change`；`update:value` / `change` 只在组件自己修改列表时触发。因此使用 `v-model:value` 时列表里只剩下等待中和飞行中的弹幕，不会无限增长。
- 只传 `value` 而不回写时，飞完的弹幕不会再次渲染，直到它的 `id` 从列表中消失。
- 追加数据不会打断飞行中的弹幕；从列表中删除一项会立即移除对应的弹幕（不触发 `finish`）。
- 想让同一条内容再飞一次，请使用新的 `id` 重新加入列表。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:value | 组件移除飞完的弹幕后触发 | `(value: BarrageItem[]) => void` |
| change | 同 `update:value` | `(value: BarrageItem[]) => void` |
| finish | 一条弹幕飞出容器时触发 | `(item: BarrageItem) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 弹幕下方的内容，如视频、图片 | - |
| item | 自定义弹幕内容 | `{ item: BarrageItem }` |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| play | 开始 / 继续播放 | `() => void` |
| pause | 暂停，飞行中的弹幕停在原地 | `() => void` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Barrage` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-barrage-color` | 弹幕文字颜色 | `var(--am-color-white)` |
| `--am-barrage-font-size` | 弹幕文字大小 | `var(--am-font-size-lg)` |
| `--am-barrage-font-weight` | 弹幕文字字重 | `var(--am-font-weight-strong)` |
| `--am-barrage-shadow-color` | 文字描边阴影的颜色，保证在浅色画面上可读 | `var(--am-color-bg-mask)` |
| `--am-barrage-row-height` | 轨道高度 | `24px` |
| `--am-barrage-row-gap` | 轨道间距 | `var(--am-margin-xxs)` |

## 与 PC 端的差异 {#diff}

- 移动端专属组件，PC 端没有对应实现；`value` / `defaultValue` / `rootClass` / `classes` / `styles` 等命名沿用 Antdv Next 的约定。
- 弹幕由纯 CSS 动画驱动，根节点 `overflow: hidden`，容器高度由默认插槽的内容或自定义样式决定。
- 支持 RTL：`direction="rtl"` 时弹幕从左向右飞。
- 页面切到后台时自动暂停，回到前台后继续。
- 弹幕本身就是动态内容，系统开启「减弱动态效果」时仍会播放；需要时可监听 `prefers-reduced-motion` 并调用 `pause()` 或不渲染组件。
