---
title: 与 PC 端对齐
order: 5
group:
  title: 指南
  order: 1
---

如果你熟悉 antdv-next，可以把这里当成一份速查表。

## 通用约定 {#conventions}

| 约定 | PC（antdv-next） | 移动端（antdv-next-mobile） |
| --- | --- | --- |
| 组件标签 | `<a-button>` | `<am-button>` |
| 类名前缀 | `ant-btn` | `am-button` |
| CSS 变量前缀 | `--ant-` | `--am-` |
| 显隐 | `v-model:open` | `v-model:open` |
| 取值 | `v-model:value` / `v-model:checked` | 相同 |
| 尺寸 | `size="small \| middle \| large"` | 相同 |
| 根类名 | `rootClass` | 相同 |
| 语义化结构 | `classes` / `styles` | 相同 |
| 渲染类属性 | 属性与同名插槽，插槽优先 | 相同 |
| 事件 | `emits`，无 `on*` 属性 | 相同 |
| 校验状态 | `status="error \| warning"` | 相同 |
| 全局配置 | `ConfigProvider`（`theme`、`locale`、`componentSize`、`componentDisabled`） | 相同 |
| 主题 | CSS-in-JS + 可选 CSS 变量 | 仅 CSS 变量 |
| 静态方法 | `message` / `Modal.confirm` | 相同，另有 `Toast`、`ActionSheet.show` |

## 组件对应关系 {#mapping}

| PC 组件 | 移动端 | 说明 |
| --- | --- | --- |
| Button、Divider、Flex、Row / Col、Space | 同名 | API 一致 |
| Typography | Typography | 重点支持多行省略与展开 |
| Tabs、Steps、Segmented、Pagination | 同名 | `items` 写法一致，Tabs 支持手势切换 |
| Menu / Layout.Sider | TabBar、SideBar、NavBar | 移动端导航形态 |
| Dropdown | Dropdown | 移动端为筛选栏下拉面板，而非右键菜单 |
| Form、Input、InputNumber、Checkbox、Radio、Switch、Rate、Slider | 同名 | Form 以单元格形式呈现，InputNumber 默认步进器外观 |
| Select | Select、Selector | Select 从底部弹出列表；Selector 为平铺选择 |
| Cascader | Cascader | 底部弹层逐级选择 |
| DatePicker、TimePicker | 同名 | 滚轮选择，值类型一致（dayjs / `valueFormat`） |
| DatePicker.RangePicker | Calendar | 日历范围选择 |
| Upload | Upload | 默认九宫格图片上传 |
| Avatar、Badge、Card、Collapse、Descriptions、Empty、Image、Tag、Timeline、Statistic | 同名 | API 一致 |
| List | List / ListItem | 移动端最常用的单元格列表 |
| Carousel | Carousel | 支持手势与无限循环 |
| Alert、Progress、Result、Skeleton、Spin、Watermark | 同名 | API 一致 |
| Drawer | Drawer、Popup | Popup 是更底层的弹出层 |
| Modal | Modal | iOS 风格对话框，静态方法一致 |
| message | message、Toast | Toast 为居中的轻提示 |
| Popover | Popover | 点击触发，支持菜单模式 |
| FloatButton | FloatButton | 额外支持拖拽与吸边 |
| Affix | Affix | API 一致 |
| Table、Tree、Transfer、Mentions、Tour、Splitter 等 | - | 不适合小屏，暂未提供 |

## 移动端独有组件 {#mobile-only}

NavBar、TabBar、SideBar、IndexBar、Popup、Mask、ActionSheet、Toast、NoticeBar、Picker、PickerView、Calendar、Selector、NumberKeyboard、PullToRefresh、InfiniteScroll、SwipeAction、FloatingPanel、ImagePreview、SafeArea。

## 迁移示例 {#example}

PC 端：

```vue
<a-form :model="form" @finish="onFinish">
  <a-form-item label="姓名" name="name" :rules="[{ required: true }]">
    <a-input v-model:value="form.name" />
  </a-form-item>
  <a-form-item label="生日" name="birthday">
    <a-date-picker v-model:value="form.birthday" />
  </a-form-item>
  <a-button type="primary" html-type="submit">提交</a-button>
</a-form>
```

移动端只需把前缀换成 `am-`：

```vue
<am-form :model="form" @finish="onFinish">
  <am-form-item label="姓名" name="name" :rules="[{ required: true }]">
    <am-input v-model:value="form.name" />
  </am-form-item>
  <am-form-item label="生日" name="birthday">
    <am-date-picker v-model:value="form.birthday" />
  </am-form-item>
  <am-button type="primary" html-type="submit" block>提交</am-button>
</am-form>
```

每个组件文档末尾都有「与 PC 端的差异」一节，列出了不支持或行为不同的属性。
