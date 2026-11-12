let globalZIndex = 1000

/** Returns an ever-increasing z-index so the latest opened popup is always on top. */
export function nextZIndex() {
  globalZIndex += 2
  return globalZIndex
}

export function setGlobalZIndex(val: number) {
  globalZIndex = val
}
