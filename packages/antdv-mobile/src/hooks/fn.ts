import { tryOnScopeDispose } from './shared'

export interface CancelableFn<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  /** drop the pending call */
  cancel: () => void
  /** run the pending call now */
  flush: () => void
}

export interface UseDebounceFnOptions {
  /** also call on the leading edge */
  leading?: boolean
  /** call on the trailing edge. Default `true`. */
  trailing?: boolean
}

/** Debounced function, cancelled automatically when the component unmounts. */
export function useDebounceFn<T extends (...args: any[]) => any>(fn: T, wait = 300, options: UseDebounceFnOptions = {}): CancelableFn<T> {
  const { leading = false, trailing = true } = options
  let timer: ReturnType<typeof setTimeout> | undefined
  let pending: Parameters<T> | undefined

  const debounced = ((...args: Parameters<T>) => {
    const callNow = leading && timer === undefined
    pending = args
    if (timer !== undefined)
      clearTimeout(timer)
    timer = setTimeout(() => {
      timer = undefined
      if (trailing && pending && !callNow) {
        const last = pending
        pending = undefined
        fn(...last)
      }
      pending = undefined
    }, wait)
    if (callNow) {
      pending = undefined
      fn(...args)
    }
  }) as CancelableFn<T>

  debounced.cancel = () => {
    if (timer !== undefined)
      clearTimeout(timer)
    timer = undefined
    pending = undefined
  }
  debounced.flush = () => {
    if (timer !== undefined && pending) {
      const last = pending
      debounced.cancel()
      fn(...last)
    }
  }
  tryOnScopeDispose(debounced.cancel)
  return debounced
}

export interface UseThrottleFnOptions {
  /** call on the leading edge. Default `true`. */
  leading?: boolean
  /** call once more with the last arguments after the interval. Default `true`. */
  trailing?: boolean
}

/** Throttled function, cancelled automatically when the component unmounts. */
export function useThrottleFn<T extends (...args: any[]) => any>(fn: T, wait = 200, options: UseThrottleFnOptions = {}): CancelableFn<T> {
  const { leading = true, trailing = true } = options
  let timer: ReturnType<typeof setTimeout> | undefined
  let last = 0
  let pending: Parameters<T> | undefined

  const invoke = (args: Parameters<T>) => {
    last = Date.now()
    pending = undefined
    fn(...args)
  }

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now()
    if (!last && !leading)
      last = now
    const remaining = wait - (now - last)
    pending = args
    if (remaining <= 0) {
      if (timer !== undefined) {
        clearTimeout(timer)
        timer = undefined
      }
      invoke(args)
    }
    else if (timer === undefined && trailing) {
      timer = setTimeout(() => {
        timer = undefined
        if (pending)
          invoke(pending)
        if (!leading)
          last = 0
      }, remaining)
    }
  }) as CancelableFn<T>

  throttled.cancel = () => {
    if (timer !== undefined)
      clearTimeout(timer)
    timer = undefined
    pending = undefined
    last = 0
  }
  throttled.flush = () => {
    if (pending) {
      const args = pending
      if (timer !== undefined)
        clearTimeout(timer)
      timer = undefined
      invoke(args)
    }
  }
  tryOnScopeDispose(throttled.cancel)
  return throttled
}
