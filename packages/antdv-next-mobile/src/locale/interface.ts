export interface ValidateMessages {
  default?: string
  required?: string
  enum?: string
  whitespace?: string
  date?: { format?: string, parse?: string, invalid?: string }
  types?: Record<string, string>
  string?: { len?: string, min?: string, max?: string, range?: string }
  number?: { len?: string, min?: string, max?: string, range?: string }
  array?: { len?: string, min?: string, max?: string, range?: string }
  pattern?: { mismatch?: string }
}

export interface Locale {
  /** dayjs-style locale code, e.g. `zh-cn` */
  locale: string
  common: {
    confirm: string
    cancel: string
    close: string
    loading: string
    reset: string
    done: string
    delete: string
    back: string
  }
  Modal: { okText: string, cancelText: string, justOkText: string }
  Popconfirm: { okText: string, cancelText: string }
  ActionSheet: { cancelText: string }
  Picker: { okText: string, cancelText: string, placeholder: string }
  DatePicker: {
    placeholder: string
    rangePlaceholder: [string, string]
    year: string
    quarter: string
    month: string
    week: string
    day: string
    hour: string
    minute: string
    second: string
    am: string
    pm: string
  }
  TimePicker: { placeholder: string }
  Calendar: {
    title: string
    confirm: string
    today: string
    start: string
    end: string
    startEnd: string
    /** Sunday first */
    weekdays: [string, string, string, string, string, string, string]
    /** dayjs format string for the month caption */
    monthFormat: string
    rangePrompt: (maxRange: number) => string
  }
  Cascader: { placeholder: string, select: string }
  Select: { placeholder: string, notFoundContent: string }
  Empty: { description: string }
  Form: { optional: string, defaultValidateMessages: ValidateMessages }
  Image: { preview: string, loadFailed: string }
  Input: { placeholder: string, clear: string }
  InputSearch: { placeholder: string, cancelText: string }
  PullToRefresh: { pulling: string, canRelease: string, refreshing: string, complete: string }
  InfiniteScroll: { loading: string, noMore: string, failed: string, retry: string }
  Upload: { upload: string, uploading: string, uploadError: string, removeFile: string, previewFile: string }
  Pagination: { prev: string, next: string }
  NumberKeyboard: { done: string, delete: string }
  Typography: { expand: string, collapse: string, copy: string, copied: string }
  Spin: { tip: string }
  Dropdown: { confirm: string, reset: string }
  Tour: { next: string, prev: string, finish: string }
}
