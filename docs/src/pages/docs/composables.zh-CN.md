---
title: 组合式 API
order: 6
group:
  title: 指南
  order: 1
---

组件库内部用到的组合式函数（相当于 React 中的 Hooks）全部对外导出，可以直接在业务代码里使用。它们都支持按需引入、可在服务端渲染环境下安全调用，并且会在所属组件卸载或 `effectScope` 停止时自动清理。

```ts
import { useCountDown, useLoadMore, useRequest } from 'antdv-next-mobile'
```

## 一览 {#overview}

| 分类 | 函数 |
| --- | --- |
| 状态 | `useBoolean`、`useToggle`、`useControlled` |
| 函数 | `useDebounceFn`、`useThrottleFn` |
| 定时 | `useCountDown`、`useTimeoutFn`、`useIntervalFn`、`useRafFn` |
| 请求 | `useRequest`、`useLoadMore` |
| 元素与视口 | `useRect`、`useElementSize`、`useWindowSize`、`useScrollParent`、`useInViewport`、`useVirtualRange` |
| 手势与事件 | `useTouch`、`useSwipe`、`useLongPress`、`useClickAway`、`useEventListener`、`useLockScroll` |
| 设备与环境 | `useSafeArea`、`useKeyboard`、`usePageVisibility`、`useOnline`、`useMediaQuery`、`usePreferredDark` |
| 浏览器能力 | `useClipboard`、`useStorage` |
| 组件库上下文 | `useConfig`、`useLocale`、`useToken`、`useSize`、`useDisabled`、`useFormItemInputContext` |

## 状态 {#state}

### useBoolean

管理布尔值，适合弹层显隐、加载标记。

```ts
const { state: open, setTrue: show, setFalse: hide, toggle } = useBoolean()
```

### useToggle

在两个值之间切换，默认是 `false` / `true`。

```ts
const [open, toggle] = useToggle()
const [mode, toggleMode] = useToggle('light', 'dark')

toggle() // 取反
toggle(false) // 指定值
```

### useControlled

受控 / 非受控状态合并，自定义组件支持 `v-model` 时使用，组件库所有组件都基于它。

```ts
const props = withDefaults(defineProps<{ open?: boolean }>(), { open: undefined })
const emit = defineEmits<{ 'update:open': [open: boolean] }>()

const [open, setOpen] = useControlled(props, 'open', {
  defaultValue: false,
  onChange: value => emit('update:open', value),
})
```

> 布尔属性需要把默认值声明为 `undefined`，否则 Vue 会把未传的布尔属性转成 `false`，组件永远处于受控状态。

## 函数 {#fn}

### useDebounceFn / useThrottleFn

防抖与节流，返回的函数带有 `cancel()` 和 `flush()`，组件卸载时自动取消。

```ts
const search = useDebounceFn((keyword: string) => fetchList(keyword), 300)
const onScroll = useThrottleFn(() => report(), 200)
```

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| fn | 要执行的函数 | - |
| wait | 等待时间（毫秒） | 防抖 `300`，节流 `200` |
| options.leading | 是否在开始时调用 | 防抖 `false`，节流 `true` |
| options.trailing | 是否在结束时调用 | `true` |

## 定时 {#timer}

### useCountDown

倒计时，基于真实时间计算，页面切到后台再回来也不会走慢。短信验证码、秒杀场景常用。

```vue
<script setup lang="ts">
import { useCountDown } from 'antdv-next-mobile'

const { current, isActive, start, reset } = useCountDown({
  time: 60 * 1000,
  onFinish: () => reset(),
})
</script>

<template>
  <am-button :disabled="isActive" @click="start">
    {{ isActive ? `${current.seconds} 秒后重发` : '获取验证码' }}
  </am-button>
</template>
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| time | 倒计时时长（毫秒） | `number` | - |
| millisecond | 是否按帧更新（毫秒级精度） | `boolean` | `false` |
| autoStart | 是否立即开始 | `boolean` | `false` |
| onChange | 时间变化时触发 | `(current: CountDownTime) => void` | - |
| onFinish | 倒计时结束时触发 | `() => void` | - |

返回 `current`（含 `total`、`days`、`hours`、`minutes`、`seconds`、`milliseconds`）、`isActive`、`start()`、`pause()`、`reset(time?)`。

### useTimeoutFn / useIntervalFn / useRafFn

带启停控制的 `setTimeout`、`setInterval` 与 `requestAnimationFrame`，卸载时自动清除。

```ts
const { isActive, start, stop } = useIntervalFn(() => poll(), 5000)
const timeout = useTimeoutFn(() => close(), 3000, { immediate: false })
```

## 请求 {#request}

### useRequest

管理一次异步请求的 `data`、`loading`、`error`，并且只让最后一次调用更新状态，避免竞态。

```ts
const { data, loading, error, run, refresh } = useRequest(
  (id: number) => fetchUser(id),
  { defaultParams: [1] },
)
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| manual | 不自动执行，手动调用 `run` | `boolean` | `false` |
| defaultParams | 自动执行时的参数 | `P` | `[]` |
| initialData | 初始数据 | `T` | - |
| loadingDelay | 延迟多少毫秒才显示 loading，避免闪烁 | `number` | - |
| onSuccess / onError / onFinally | 回调 | `Function` | - |

返回 `data`、`error`、`loading`、`params`、`run(...params)`、`runAsync(...params)`、`refresh()`、`mutate(data)`、`cancel()`。

### useLoadMore

分页列表状态，专门配合 `InfiniteScroll` 与 `PullToRefresh` 使用。

```vue
<script setup lang="ts">
import { useLoadMore } from 'antdv-next-mobile'

const { list, loading, refreshing, error, finished, loadMore, refresh } = useLoadMore(
  ({ page, pageSize }) => fetchOrders({ page, pageSize }), // 返回 { list, total }
  { pageSize: 20 },
)
</script>

<template>
  <am-pull-to-refresh v-model:refreshing="refreshing" @refresh="refresh">
    <am-infinite-scroll v-model:loading="loading" v-model:error="error" :finished="finished" @load="loadMore">
      <am-list>
        <am-list-item v-for="item in list" :key="item.id" :title="item.name" />
      </am-list>
    </am-infinite-scroll>
  </am-pull-to-refresh>
</template>
```

服务函数返回 `{ list, total?, hasMore? }`。是否加载完毕按 `hasMore`、`total`、「本页不足一页」的顺序判断。

返回 `list`、`page`、`total`、`loading`、`refreshing`、`error`、`finished`、`empty`、`loadMore()`、`refresh()`、`reset()`。

## 元素与视口 {#dom}

### useRect / useElementSize / useWindowSize

```ts
const el = ref<HTMLElement>()

const { width, height, top, update } = useRect(el) // 挂载时测量，update() 重新测量
const size = useElementSize(el) // ResizeObserver 持续跟踪
const viewport = useWindowSize() // 跟随 resize 与横竖屏切换
```

### useScrollParent

获取元素最近的可滚动祖先，没有时返回 `window`。

### useInViewport

元素是否进入视口，可用于懒加载和曝光统计。

```ts
const { inViewport } = useInViewport(el, { threshold: 0.5, once: true })
```

### useVirtualRange

虚拟滚动的窗口计算，`VirtualList`、`PickerView`、`Calendar` 都基于它。自己掌管滚动时使用；普通列表直接用 [VirtualList](/components/virtual-list) 组件即可。

```ts
const range = useVirtualRange({
  count: () => list.value.length,
  size: () => 44, // 或 () => (index) => heights[index]
  scrollOffset: () => scrollTop.value,
  viewportSize: () => 600,
})
// range.start / range.end / range.totalSize / range.offsetBefore
```

## 手势与事件 {#gesture}

### useTouch

记录单指手势的位移、方向与是否为点击，是所有手势组件的基础。

```ts
const touch = useTouch()

function onTouchStart(event: TouchEvent) {
  touch.start(event)
}
function onTouchMove(event: TouchEvent) {
  touch.move(event)
  if (touch.isHorizontal())
    translate.value = touch.deltaX.value
}
```

### useSwipe

```ts
const { direction, deltaX, isSwiping } = useSwipe(el, {
  threshold: 50,
  onSwipeEnd: (event, direction) => direction === 'left' && next(),
})
```

### useLongPress

```ts
useLongPress(el, () => showMenu(), { delay: 500 })
```

### useClickAway

点击（或触摸）目标之外的区域时触发，支持多个目标和多个事件名。

```ts
useClickAway([triggerRef, panelRef], () => (open.value = false), {
  eventName: ['touchstart', 'mousedown'],
})
```

### useEventListener

挂载时绑定、卸载时自动解绑，默认目标是 `window`，也可以传元素的 ref。

```ts
useEventListener('scroll', onScroll, { target: scrollerRef, passive: true })
```

### useLockScroll

锁定页面滚动，同时保留指定容器内部的滚动。自定义浮层时使用。

```ts
useLockScroll(rootRef, () => open.value)
```

## 设备与环境 {#device}

### useSafeArea

读取刘海与底部横条的安全区尺寸（像素）。

```ts
const { top, bottom } = useSafeArea()
```

### useKeyboard

软键盘高度，基于 VisualViewport。可以用来把底部按钮顶到键盘上方。

```vue
<script setup lang="ts">
const { height, open } = useKeyboard()
</script>

<template>
  <div class="footer" :style="{ transform: `translateY(-${height}px)` }" />
</template>
```

### usePageVisibility / useOnline

```ts
const visibility = usePageVisibility() // 'visible' | 'hidden'
const online = useOnline()
```

### useMediaQuery / usePreferredDark

跟随系统深色模式切换主题：

```vue
<script setup lang="ts">
import { theme, usePreferredDark } from 'antdv-next-mobile'
import { computed } from 'vue'

const isDark = usePreferredDark()
const themeConfig = computed(() => ({
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
}))
</script>

<template>
  <am-config-provider :theme="themeConfig">
    <App />
  </am-config-provider>
</template>
```

## 浏览器能力 {#browser}

### useClipboard

复制文本，在不支持异步剪贴板的 WebView 中自动降级。

```ts
const { copy, copied } = useClipboard()
await copy('邀请码 8K2F')
```

### useStorage

持久化到 `localStorage` 的 ref，并在其他标签页修改时同步。设为 `null` 会移除对应的键。

```ts
const settings = useStorage('app-settings', { dark: false, fontSize: 14 })
settings.value.dark = true
```

## 组件库上下文 {#context}

| 函数 | 说明 |
| --- | --- |
| `useConfig()` | 读取 `ConfigProvider` 上下文：`locale`、`direction`、`componentSize`、`componentDisabled`、`theme` |
| `useLocale(name)` | 读取某个组件的文案 |
| `useToken()` | 读取当前主题：`token`、`isDark`、`cssVar()` |
| `useSize(getter)` | 合并自身 `size` 与全局 `componentSize` |
| `useDisabled(getter)` | 合并自身 `disabled`、表单 `disabled` 与全局 `componentDisabled` |
| `useFormItemInputContext()` | 自定义表单控件接入 `FormItem` 校验：值变化后调用 `onFieldChange()`，失焦时调用 `onFieldBlur()` |

自定义一个可以放进 `FormItem` 的控件：

```vue
<script setup lang="ts">
import { useControlled, useDisabled, useFormItemInputContext } from 'antdv-next-mobile'

const props = withDefaults(defineProps<{ value?: number, disabled?: boolean }>(), { disabled: undefined })
const emit = defineEmits<{ 'update:value': [value: number] }>()

const formItem = useFormItemInputContext()
const disabled = useDisabled(() => props.disabled)
const [value, setValue] = useControlled(props, 'value', {
  defaultValue: 0,
  onChange: (next) => {
    emit('update:value', next)
    formItem.onFieldChange()
  },
})
</script>
```
