import type { WatermarkFont } from './interface'

/** Line gap between multi-line text, same as antdv-next. */
export const FONT_GAP = 3

export type ResolvedFont = Required<WatermarkFont>

function prepareCanvas(width: number, height: number, ratio = 1) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const realWidth = width * ratio
  const realHeight = height * ratio
  canvas.setAttribute('width', `${realWidth}px`)
  canvas.setAttribute('height', `${realHeight}px`)
  ctx?.save()
  return [ctx, canvas, realWidth, realHeight] as const
}

/** `false` in SSR and in environments without a 2d canvas (e.g. jsdom). */
export function getCanvasContext() {
  if (typeof document === 'undefined')
    return null
  try {
    return document.createElement('canvas').getContext('2d')
  }
  catch {
    return null
  }
}

/** Size of one watermark: explicit `width` / `height`, otherwise measured from the text. */
export function getMarkSize(
  ctx: CanvasRenderingContext2D,
  options: { width?: number, height?: number, image?: string, content?: string | string[], font: ResolvedFont },
): [width: number, height: number] {
  const { width, height, image, content, font } = options
  let defaultWidth = 120
  let defaultHeight = 64
  if (!image && ctx.measureText) {
    ctx.font = `${Number(font.fontSize)}px ${font.fontFamily}`
    const contents = Array.isArray(content) ? content : [content]
    const sizes = contents.map((item) => {
      const metrics = ctx.measureText(item ?? '')
      const lineHeight = (metrics.fontBoundingBoxAscent ?? 0) + (metrics.fontBoundingBoxDescent ?? 0)
      return [metrics.width, lineHeight || Number(font.fontSize) * 1.2]
    })
    defaultWidth = Math.ceil(Math.max(...sizes.map(size => size[0]!)))
    defaultHeight = Math.ceil(Math.max(...sizes.map(size => size[1]!))) * contents.length + (contents.length - 1) * FONT_GAP
  }
  return [width ?? defaultWidth, height ?? defaultHeight]
}

/**
 * Draws one watermark (text or image), rotates it and lays it out as a staggered, repeatable tile.
 * Returns `[dataURL, tileWidth, tileHeight]` in css pixels, or `null` when no canvas is available.
 */
export function getClips(
  content: string | string[] | HTMLImageElement,
  rotate: number,
  ratio: number,
  width: number,
  height: number,
  font: ResolvedFont,
  gapX: number,
  gapY: number,
): [dataURL: string, width: number, height: number] | null {
  // ================= Text / Image =================
  const [ctx, canvas, contentWidth, contentHeight] = prepareCanvas(width, height, ratio)
  if (!ctx)
    return null

  if (typeof content === 'object' && !Array.isArray(content)) {
    ctx.drawImage(content, 0, 0, contentWidth, contentHeight)
  }
  else {
    const { color, fontSize, fontStyle, fontWeight, fontFamily, textAlign } = font
    const mergedFontSize = Number(fontSize) * ratio
    ctx.font = `${fontStyle} normal ${fontWeight} ${mergedFontSize}px/${height}px ${fontFamily}`
    ctx.fillStyle = color
    ctx.textAlign = textAlign
    ctx.textBaseline = 'top'
    const contents = Array.isArray(content) ? content : [content]
    const x = textAlign === 'center' ? contentWidth / 2 : textAlign === 'right' || textAlign === 'end' ? contentWidth : 0
    contents.forEach((item, index) => {
      ctx.fillText(item ?? '', x, index * (mergedFontSize + FONT_GAP * ratio))
    })
  }

  // ==================== Rotate ====================
  const angle = (Math.PI / 180) * Number(rotate)
  const maxSize = Math.max(width, height)
  const [rCtx, rCanvas, realMaxSize] = prepareCanvas(maxSize, maxSize, ratio)
  if (!rCtx)
    return null
  rCtx.translate(realMaxSize / 2, realMaxSize / 2)
  rCtx.rotate(angle)
  if (contentWidth > 0 && contentHeight > 0)
    rCtx.drawImage(canvas, -contentWidth / 2, -contentHeight / 2)

  // Bounding box of the rotated content
  const rotatePos = (x: number, y: number) => [
    x * Math.cos(angle) - y * Math.sin(angle),
    x * Math.sin(angle) + y * Math.cos(angle),
  ] as const
  let left = 0
  let right = 0
  let top = 0
  let bottom = 0
  const halfWidth = contentWidth / 2
  const halfHeight = contentHeight / 2
  const corners = [
    [-halfWidth, -halfHeight],
    [halfWidth, -halfHeight],
    [halfWidth, halfHeight],
    [-halfWidth, halfHeight],
  ] as const
  corners.forEach(([x, y]) => {
    const [targetX, targetY] = rotatePos(x, y)
    left = Math.min(left, targetX)
    right = Math.max(right, targetX)
    top = Math.min(top, targetY)
    bottom = Math.max(bottom, targetY)
  })

  const cutLeft = left + realMaxSize / 2
  const cutTop = top + realMaxSize / 2
  const cutWidth = right - left
  const cutHeight = bottom - top

  // ================ Fill Alternate ================
  const realGapX = gapX * ratio
  const realGapY = gapY * ratio
  const filledWidth = (cutWidth + realGapX) * 2
  const filledHeight = cutHeight + realGapY
  const [fCtx, fCanvas] = prepareCanvas(filledWidth, filledHeight)
  if (!fCtx)
    return null

  const drawImg = (targetX = 0, targetY = 0) => {
    fCtx.drawImage(rCanvas, cutLeft, cutTop, cutWidth, cutHeight, targetX, targetY, cutWidth, cutHeight)
  }
  drawImg()
  drawImg(cutWidth + realGapX, -cutHeight / 2 - realGapY / 2)
  drawImg(cutWidth + realGapX, +cutHeight / 2 + realGapY / 2)

  return [fCanvas.toDataURL(), filledWidth / ratio, filledHeight / ratio]
}

/** Position / size of the layer for a given `gap` and `offset` (same rules as antdv-next). */
export function getLayerStyle(gap: [number, number], offset?: [number, number]) {
  const [gapX, gapY] = gap
  const gapXCenter = gapX / 2
  const gapYCenter = gapY / 2
  let positionLeft = (offset?.[0] ?? gapXCenter) - gapXCenter
  let positionTop = (offset?.[1] ?? gapYCenter) - gapYCenter
  const style: Record<string, string> = {}
  if (positionLeft > 0) {
    style.left = `${positionLeft}px`
    style.width = `calc(100% - ${positionLeft}px)`
    positionLeft = 0
  }
  if (positionTop > 0) {
    style.top = `${positionTop}px`
    style.height = `calc(100% - ${positionTop}px)`
    positionTop = 0
  }
  style['background-position'] = `${positionLeft}px ${positionTop}px`
  return style
}
