import type { HighlightChunk } from './interface'

export interface HighlightOptions {
  caseSensitive?: boolean
  autoEscape?: boolean
}

function escapeRegExp(source: string) {
  return source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Splits `content` into plain / highlighted chunks. Overlapping and adjacent matches are merged. */
export function getHighlightChunks(
  content: string,
  keywords: string | string[] | undefined,
  options: HighlightOptions = {},
): HighlightChunk[] {
  const { caseSensitive = false, autoEscape = true } = options
  if (!content)
    return []

  const list = (Array.isArray(keywords) ? keywords : [keywords]).filter((item): item is string => typeof item === 'string' && item !== '')
  const ranges: [number, number][] = []

  list.forEach((keyword) => {
    let regexp: RegExp
    try {
      regexp = new RegExp(autoEscape ? escapeRegExp(keyword) : keyword, caseSensitive ? 'g' : 'gi')
    }
    catch {
      // An invalid pattern (only possible with `autoEscape: false`) highlights nothing.
      return
    }
    let match = regexp.exec(content)
    while (match) {
      if (match[0].length === 0)
        regexp.lastIndex += 1
      else
        ranges.push([match.index, match.index + match[0].length])
      match = regexp.exec(content)
    }
  })

  ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const merged: [number, number][] = []
  ranges.forEach(([start, end]) => {
    const last = merged[merged.length - 1]
    if (last && start <= last[1])
      last[1] = Math.max(last[1], end)
    else
      merged.push([start, end])
  })

  const chunks: HighlightChunk[] = []
  let cursor = 0
  merged.forEach(([start, end], index) => {
    if (start > cursor)
      chunks.push({ text: content.slice(cursor, start), highlight: false, start: cursor, end: start, index: -1 })
    chunks.push({ text: content.slice(start, end), highlight: true, start, end, index })
    cursor = end
  })
  if (cursor < content.length)
    chunks.push({ text: content.slice(cursor), highlight: false, start: cursor, end: content.length, index: -1 })
  return chunks
}
