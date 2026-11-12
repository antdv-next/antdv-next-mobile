import type { Ref, ShallowRef } from 'vue'
import { computed, ref, shallowRef } from 'vue'
import { tryOnScopeDispose } from './shared'

export interface UseRequestOptions<T, P extends any[]> {
  /** do not run on creation; call `run()` yourself */
  manual?: boolean
  defaultParams?: P
  initialData?: T
  /** only show `loading` after this many ms, to avoid flicker on fast responses */
  loadingDelay?: number
  onSuccess?: (data: T, params: P) => void
  onError?: (error: unknown, params: P) => void
  onFinally?: (params: P) => void
}

export interface UseRequestReturn<T, P extends any[]> {
  data: ShallowRef<T | undefined>
  error: ShallowRef<unknown>
  loading: Ref<boolean>
  params: ShallowRef<P | undefined>
  /** run and swallow errors (they land in `error` / `onError`) */
  run: (...params: P) => void
  /** run and get the promise */
  runAsync: (...params: P) => Promise<T>
  /** run again with the last params */
  refresh: () => void
  /** set `data` without requesting */
  mutate: (data: T | undefined | ((prev: T | undefined) => T | undefined)) => void
  /** ignore the response of the in-flight request */
  cancel: () => void
}

/**
 * Async state for one request: `data`, `loading`, `error`, with race protection
 * (only the latest call may update the state).
 *
 * ```ts
 * const { data, loading, run } = useRequest(fetchUser, { defaultParams: [id] })
 * ```
 */
export function useRequest<T, P extends any[] = []>(
  service: (...params: P) => Promise<T>,
  options: UseRequestOptions<T, P> = {},
): UseRequestReturn<T, P> {
  const data = shallowRef<T | undefined>(options.initialData)
  const error = shallowRef<unknown>()
  const loading = ref(false)
  const params = shallowRef<P>()
  let count = 0
  let delayTimer: ReturnType<typeof setTimeout> | undefined

  const clearDelay = () => {
    if (delayTimer !== undefined)
      clearTimeout(delayTimer)
    delayTimer = undefined
  }

  async function runAsync(...args: P): Promise<T> {
    const current = ++count
    params.value = args
    clearDelay()
    if (options.loadingDelay)
      delayTimer = setTimeout(() => (loading.value = true), options.loadingDelay)
    else
      loading.value = true
    try {
      const result = await service(...args)
      if (current === count) {
        data.value = result
        error.value = undefined
        options.onSuccess?.(result, args)
      }
      return result
    }
    catch (err) {
      if (current === count) {
        error.value = err
        options.onError?.(err, args)
      }
      throw err
    }
    finally {
      if (current === count) {
        clearDelay()
        loading.value = false
        options.onFinally?.(args)
      }
    }
  }

  const run = (...args: P) => {
    runAsync(...args).catch(() => {})
  }
  const refresh = () => run(...((params.value ?? options.defaultParams ?? []) as P))
  const cancel = () => {
    count++
    clearDelay()
    loading.value = false
  }
  const mutate: UseRequestReturn<T, P>['mutate'] = (next) => {
    data.value = typeof next === 'function' ? (next as (prev: T | undefined) => T | undefined)(data.value) : next
  }

  if (!options.manual)
    run(...((options.defaultParams ?? []) as P))
  tryOnScopeDispose(cancel)

  return { data, error, loading, params, run, runAsync, refresh, mutate, cancel }
}

export interface LoadMoreResult<T> {
  list: T[]
  /** total count, when the server knows it */
  total?: number
  /** explicit flag; otherwise derived from `total` or an empty page */
  hasMore?: boolean
}

export interface UseLoadMoreOptions<T> {
  /** first page number. Default `1`. */
  initialPage?: number
  pageSize?: number
  manual?: boolean
  onSuccess?: (result: LoadMoreResult<T>, page: number) => void
  onError?: (error: unknown, page: number) => void
}

/**
 * Paged list state made for `<am-infinite-scroll>` + `<am-pull-to-refresh>`:
 *
 * ```vue
 * <am-pull-to-refresh v-model:refreshing="refreshing" @refresh="refresh">
 *   <am-infinite-scroll v-model:loading="loading" v-model:error="error" :finished="finished" @load="loadMore">
 *     <am-list-item v-for="item in list" :key="item.id" :title="item.name" />
 *   </am-infinite-scroll>
 * </am-pull-to-refresh>
 * ```
 */
export function useLoadMore<T>(
  service: (params: { page: number, pageSize: number }) => Promise<LoadMoreResult<T>>,
  options: UseLoadMoreOptions<T> = {},
) {
  const { initialPage = 1, pageSize = 20 } = options
  const list = ref([]) as Ref<T[]>
  const page = ref(initialPage - 1)
  const total = ref<number>()
  const loading = ref(false)
  const refreshing = ref(false)
  const error = ref(false)
  const finished = ref(false)
  const empty = computed(() => finished.value && list.value.length === 0)
  let count = 0

  async function request(target: number, replace: boolean) {
    const current = ++count
    error.value = false
    try {
      const result = await service({ page: target, pageSize })
      if (current !== count)
        return
      list.value = replace ? result.list : [...list.value, ...result.list]
      page.value = target
      total.value = result.total
      if (result.hasMore !== undefined)
        finished.value = !result.hasMore
      else if (result.total !== undefined)
        finished.value = list.value.length >= result.total
      else
        finished.value = result.list.length < pageSize
      options.onSuccess?.(result, target)
    }
    catch (err) {
      if (current !== count)
        return
      error.value = true
      options.onError?.(err, target)
    }
    finally {
      if (current === count) {
        loading.value = false
        refreshing.value = false
      }
    }
  }

  /** load the next page (bind to InfiniteScroll `@load`) */
  function loadMore() {
    if (finished.value || refreshing.value)
      return Promise.resolve()
    loading.value = true
    return request(page.value + 1, false)
  }

  /** reload from the first page (bind to PullToRefresh `@refresh`) */
  function refresh() {
    refreshing.value = true
    finished.value = false
    return request(initialPage, true)
  }

  function reset() {
    count++
    list.value = []
    page.value = initialPage - 1
    total.value = undefined
    loading.value = false
    refreshing.value = false
    error.value = false
    finished.value = false
  }

  if (!options.manual)
    loadMore()
  tryOnScopeDispose(() => {
    count++
  })

  return { list, page, total, loading, refreshing, error, finished, empty, loadMore, refresh, reset }
}
