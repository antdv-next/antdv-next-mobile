/**
 * Dependency-free QR Code (Model 2) encoder: versions 1-40, error correction levels L / M / Q / H,
 * numeric / alphanumeric / byte (UTF-8) segments, Reed-Solomon error correction and
 * automatic mask selection by penalty score (ISO/IEC 18004).
 */

export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H'

export interface QRCodeEncodeOptions {
  /** Minimum error correction level, default `M` */
  errorLevel?: QRCodeErrorLevel
  /** Raise the error correction level when it does not increase the version, default `true` */
  boostLevel?: boolean
  /** Smallest version to use (1-40), default `1` */
  minVersion?: number
  /** Largest version to use (1-40), default `40` */
  maxVersion?: number
  /** Force a mask pattern (0-7), by default the one with the lowest penalty is picked */
  mask?: number
}

export interface QRCodeMatrix {
  /** 1-40 */
  version: number
  /** Modules per side: `version * 4 + 17` */
  size: number
  /** The level really used (may be higher than requested with `boostLevel`) */
  errorLevel: QRCodeErrorLevel
  /** The applied mask pattern, 0-7 */
  mask: number
  /** `modules[y][x]`, `true` is a dark module */
  modules: boolean[][]
}

type SegmentMode = 'numeric' | 'alphanumeric' | 'byte'

interface Segment {
  mode: SegmentMode
  numChars: number
  /** Data bits, one entry per bit */
  bits: number[]
}

const MIN_VERSION = 1
const MAX_VERSION = 40

const LEVELS: QRCodeErrorLevel[] = ['L', 'M', 'Q', 'H']
/** The two format bits of every level */
const LEVEL_FORMAT_BITS: Record<QRCodeErrorLevel, number> = { L: 1, M: 0, Q: 3, H: 2 }

const MODE_BITS: Record<SegmentMode, number> = { numeric: 0x1, alphanumeric: 0x2, byte: 0x4 }
/** Width of the character count field for versions 1-9, 10-26, 27-40 */
const CHAR_COUNT_BITS: Record<SegmentMode, [number, number, number]> = {
  numeric: [10, 12, 14],
  alphanumeric: [9, 11, 13],
  byte: [8, 16, 16],
}

const NUMERIC_REGEX = /^\d*$/
const ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+./:-]*$/
const ALPHANUMERIC_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'

/** Error correction codewords per block, indexed by level then version - 1 */
const ECC_CODEWORDS_PER_BLOCK: Record<QRCodeErrorLevel, number[]> = {
  L: [7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  M: [10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  Q: [13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  H: [17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
}

/** Number of error correction blocks, indexed by level then version - 1 */
const NUM_ERROR_CORRECTION_BLOCKS: Record<QRCodeErrorLevel, number[]> = {
  L: [1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  M: [1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  Q: [1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  H: [1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
}

const PENALTY_N1 = 3
const PENALTY_N2 = 3
const PENALTY_N3 = 40
const PENALTY_N4 = 10

/* ---------------------------------- segments ---------------------------------- */

function appendBits(value: number, length: number, bits: number[]) {
  for (let i = length - 1; i >= 0; i--)
    bits.push((value >>> i) & 1)
}

/** UTF-8 bytes of a string (lone surrogates become U+FFFD) */
export function toUtf8Bytes(text: string): number[] {
  const bytes: number[] = []
  for (let i = 0; i < text.length; i++) {
    let code = text.codePointAt(i)!
    if (code > 0xFFFF)
      i++
    else if (code >= 0xD800 && code <= 0xDFFF)
      code = 0xFFFD
    if (code < 0x80) {
      bytes.push(code)
    }
    else if (code < 0x800) {
      bytes.push(0xC0 | (code >>> 6), 0x80 | (code & 0x3F))
    }
    else if (code < 0x10000) {
      bytes.push(0xE0 | (code >>> 12), 0x80 | ((code >>> 6) & 0x3F), 0x80 | (code & 0x3F))
    }
    else {
      bytes.push(
        0xF0 | (code >>> 18),
        0x80 | ((code >>> 12) & 0x3F),
        0x80 | ((code >>> 6) & 0x3F),
        0x80 | (code & 0x3F),
      )
    }
  }
  return bytes
}

function makeSegment(text: string): Segment | undefined {
  if (text === '')
    return undefined
  const bits: number[] = []
  if (NUMERIC_REGEX.test(text)) {
    for (let i = 0; i < text.length; i += 3) {
      const chunk = text.slice(i, i + 3)
      appendBits(Number.parseInt(chunk, 10), chunk.length * 3 + 1, bits)
    }
    return { mode: 'numeric', numChars: text.length, bits }
  }
  if (ALPHANUMERIC_REGEX.test(text)) {
    let i = 0
    for (; i + 2 <= text.length; i += 2) {
      const pair = ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45 + ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1))
      appendBits(pair, 11, bits)
    }
    if (i < text.length)
      appendBits(ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bits)
    return { mode: 'alphanumeric', numChars: text.length, bits }
  }
  const bytes = toUtf8Bytes(text)
  bytes.forEach(byte => appendBits(byte, 8, bits))
  return { mode: 'byte', numChars: bytes.length, bits }
}

function charCountBits(mode: SegmentMode, version: number) {
  return CHAR_COUNT_BITS[mode][Math.floor((version + 7) / 17)]!
}

/** Bits needed by the segments at `version`, `Infinity` when a segment is too long for its count field */
function getTotalBits(segments: Segment[], version: number) {
  let result = 0
  for (const segment of segments) {
    const countBits = charCountBits(segment.mode, version)
    if (segment.numChars >= 1 << countBits)
      return Infinity
    result += 4 + countBits + segment.bits.length
  }
  return result
}

/* ---------------------------------- capacity ---------------------------------- */

/** Number of data + error correction bits of a version (function patterns excluded) */
function getNumRawDataModules(version: number) {
  let result = (16 * version + 128) * version + 64
  if (version >= 2) {
    const numAlign = Math.floor(version / 7) + 2
    result -= (25 * numAlign - 10) * numAlign - 55
    if (version >= 7)
      result -= 36
  }
  return result
}

function getNumDataCodewords(version: number, level: QRCodeErrorLevel) {
  return Math.floor(getNumRawDataModules(version) / 8)
    - ECC_CODEWORDS_PER_BLOCK[level][version - 1]! * NUM_ERROR_CORRECTION_BLOCKS[level][version - 1]!
}

/* -------------------------------- Reed-Solomon -------------------------------- */

/** Product of two field elements in GF(2^8 / 0x11D) */
function gfMultiply(x: number, y: number) {
  let z = 0
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11D)
    z ^= ((y >>> i) & 1) * x
  }
  return z
}

/** Coefficients of the generator polynomial of the given degree (highest power dropped) */
function reedSolomonDivisor(degree: number) {
  const result: number[] = Array.from<number>({ length: degree }).fill(0)
  result[degree - 1] = 1
  let root = 1
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMultiply(result[j]!, root)
      if (j + 1 < degree)
        result[j]! ^= result[j + 1]!
    }
    root = gfMultiply(root, 0x02)
  }
  return result
}

function reedSolomonRemainder(data: number[], divisor: number[]) {
  const result: number[] = divisor.map(() => 0)
  for (const byte of data) {
    const factor = byte ^ result.shift()!
    result.push(0)
    for (let i = 0; i < divisor.length; i++)
      result[i]! ^= gfMultiply(divisor[i]!, factor)
  }
  return result
}

/** Splits the data codewords into blocks, appends the error correction and interleaves everything */
function addEccAndInterleave(data: number[], version: number, level: QRCodeErrorLevel) {
  const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[level][version - 1]!
  const blockEccLen = ECC_CODEWORDS_PER_BLOCK[level][version - 1]!
  const rawCodewords = Math.floor(getNumRawDataModules(version) / 8)
  const numShortBlocks = numBlocks - (rawCodewords % numBlocks)
  const shortBlockLen = Math.floor(rawCodewords / numBlocks)

  const blocks: number[][] = []
  const divisor = reedSolomonDivisor(blockEccLen)
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const dataLen = shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1)
    const block = data.slice(k, k + dataLen)
    k += dataLen
    const ecc = reedSolomonRemainder(block, divisor)
    // Short blocks get a placeholder so every block has the same length
    if (i < numShortBlocks)
      block.push(0)
    blocks.push(block.concat(ecc))
  }

  const result: number[] = []
  for (let i = 0; i < blocks[0]!.length; i++) {
    for (let j = 0; j < blocks.length; j++) {
      // Skip the placeholder of the short blocks
      if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks)
        result.push(blocks[j]![i]!)
    }
  }
  return result
}

/* ----------------------------------- matrix ----------------------------------- */

function getAlignmentPatternPositions(version: number) {
  if (version === 1)
    return []
  const size = version * 4 + 17
  const numAlign = Math.floor(version / 7) + 2
  const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (numAlign * 2 - 2)) * 2
  const result = [6]
  for (let pos = size - 7; result.length < numAlign; pos -= step)
    result.splice(1, 0, pos)
  return result
}

function getMaskBit(mask: number, x: number, y: number) {
  switch (mask) {
    case 0: return (x + y) % 2 === 0
    case 1: return y % 2 === 0
    case 2: return x % 3 === 0
    case 3: return (x + y) % 3 === 0
    case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0
    case 5: return (x * y) % 2 + (x * y) % 3 === 0
    case 6: return ((x * y) % 2 + (x * y) % 3) % 2 === 0
    default: return ((x + y) % 2 + (x * y) % 3) % 2 === 0
  }
}

class Matrix {
  version: number
  level: QRCodeErrorLevel
  size: number
  modules: boolean[][]
  isFunction: boolean[][]

  constructor(version: number, level: QRCodeErrorLevel) {
    this.version = version
    this.level = level
    const size = this.size = version * 4 + 17
    this.modules = Array.from({ length: size }, () => Array.from<boolean>({ length: size }).fill(false))
    this.isFunction = Array.from({ length: size }, () => Array.from<boolean>({ length: size }).fill(false))
  }

  setFunction(x: number, y: number, dark: boolean) {
    this.modules[y]![x] = dark
    this.isFunction[y]![x] = true
  }

  drawFunctionPatterns() {
    const { size } = this
    // Timing patterns
    for (let i = 0; i < size; i++) {
      this.setFunction(6, i, i % 2 === 0)
      this.setFunction(i, 6, i % 2 === 0)
    }
    // Finder patterns (with their separators)
    this.drawFinder(3, 3)
    this.drawFinder(size - 4, 3)
    this.drawFinder(3, size - 4)
    // Alignment patterns, the three finder corners excluded
    const positions = getAlignmentPatternPositions(this.version)
    const last = positions.length - 1
    for (let i = 0; i <= last; i++) {
      for (let j = 0; j <= last; j++) {
        if (!((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)))
          this.drawAlignment(positions[i]!, positions[j]!)
      }
    }
    // Reserve the format area, the real bits are written per mask
    this.drawFormatBits(0)
    this.drawVersion()
  }

  drawFinder(cx: number, cy: number) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy))
        const x = cx + dx
        const y = cy + dy
        if (x >= 0 && x < this.size && y >= 0 && y < this.size)
          this.setFunction(x, y, dist !== 2 && dist !== 4)
      }
    }
  }

  drawAlignment(cx: number, cy: number) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++)
        this.setFunction(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
    }
  }

  drawFormatBits(mask: number) {
    const { size } = this
    // 5 data bits + 10 BCH bits, xor-ed with the format mask
    const data = (LEVEL_FORMAT_BITS[this.level] << 3) | mask
    let rem = data
    for (let i = 0; i < 10; i++)
      rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
    const bits = ((data << 10) | rem) ^ 0x5412
    const bit = (i: number) => ((bits >>> i) & 1) !== 0

    // First copy, around the top-left finder
    for (let i = 0; i <= 5; i++)
      this.setFunction(8, i, bit(i))
    this.setFunction(8, 7, bit(6))
    this.setFunction(8, 8, bit(7))
    this.setFunction(7, 8, bit(8))
    for (let i = 9; i < 15; i++)
      this.setFunction(14 - i, 8, bit(i))

    // Second copy, split between the top-right and bottom-left finders
    for (let i = 0; i < 8; i++)
      this.setFunction(size - 1 - i, 8, bit(i))
    for (let i = 8; i < 15; i++)
      this.setFunction(8, size - 15 + i, bit(i))
    // Dark module
    this.setFunction(8, size - 8, true)
  }

  drawVersion() {
    if (this.version < 7)
      return
    // 6 data bits + 12 BCH bits
    let rem = this.version
    for (let i = 0; i < 12; i++)
      rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25)
    const bits = (this.version << 12) | rem
    for (let i = 0; i < 18; i++) {
      const dark = ((bits >>> i) & 1) !== 0
      const a = this.size - 11 + (i % 3)
      const b = Math.floor(i / 3)
      this.setFunction(a, b, dark)
      this.setFunction(b, a, dark)
    }
  }

  /** Places the codewords in the zigzag order, skipping function modules */
  drawCodewords(data: number[]) {
    const { size } = this
    const total = data.length * 8
    let i = 0
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6)
        right = 5
      for (let vert = 0; vert < size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j
          const upward = ((right + 1) & 2) === 0
          const y = upward ? size - 1 - vert : vert
          if (!this.isFunction[y]![x] && i < total) {
            this.modules[y]![x] = ((data[i >>> 3]! >>> (7 - (i & 7))) & 1) !== 0
            i++
          }
        }
      }
    }
  }

  /** XOR the data modules with a mask pattern (calling it twice undoes it) */
  applyMask(mask: number) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (!this.isFunction[y]![x] && getMaskBit(mask, x, y))
          this.modules[y]![x] = !this.modules[y]![x]
      }
    }
  }

  getPenaltyScore() {
    const { size, modules } = this
    let result = 0

    const addHistory = (runLength: number, history: number[]) => {
      // The light border is treated as an infinitely wide run
      if (history[0] === 0)
        runLength += size
      history.pop()
      history.unshift(runLength)
    }
    // Finder-like patterns (1:1:3:1:1 with 4 light modules on one side)
    const countPatterns = (history: number[]) => {
      const n = history[1]!
      const core = n > 0 && history[2] === n && history[3] === n * 3 && history[4] === n && history[5] === n
      return (core && history[0]! >= n * 4 && history[6]! >= n ? 1 : 0)
        + (core && history[6]! >= n * 4 && history[0]! >= n ? 1 : 0)
    }
    const terminateAndCount = (runColor: boolean, runLength: number, history: number[]) => {
      if (runColor) {
        addHistory(runLength, history)
        runLength = 0
      }
      runLength += size
      addHistory(runLength, history)
      return countPatterns(history)
    }

    // Rule 1 (runs of the same color) and rule 3 (finder-like patterns), rows then columns
    for (let pass = 0; pass < 2; pass++) {
      for (let a = 0; a < size; a++) {
        let runColor = false
        let runLength = 0
        const history = [0, 0, 0, 0, 0, 0, 0]
        for (let b = 0; b < size; b++) {
          const dark = pass === 0 ? modules[a]![b]! : modules[b]![a]!
          if (dark === runColor) {
            runLength++
            if (runLength === 5)
              result += PENALTY_N1
            else if (runLength > 5)
              result++
          }
          else {
            addHistory(runLength, history)
            if (!runColor)
              result += countPatterns(history) * PENALTY_N3
            runColor = dark
            runLength = 1
          }
        }
        result += terminateAndCount(runColor, runLength, history) * PENALTY_N3
      }
    }

    // Rule 2: 2x2 blocks of the same color
    for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size - 1; x++) {
        const color = modules[y]![x]
        if (color === modules[y]![x + 1] && color === modules[y + 1]![x] && color === modules[y + 1]![x + 1])
          result += PENALTY_N2
      }
    }

    // Rule 4: balance of dark and light modules
    let dark = 0
    for (const row of modules) {
      for (const cell of row) {
        if (cell)
          dark++
      }
    }
    const total = size * size
    const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1
    result += k * PENALTY_N4
    return result
  }
}

/* ----------------------------------- public ----------------------------------- */

function clampVersion(value: number | undefined, fallback: number) {
  const version = Math.floor(Number(value))
  return version >= MIN_VERSION && version <= MAX_VERSION ? version : fallback
}

/**
 * Encodes a text (or several texts, each one as its own optimally typed segment) into a QR Code matrix.
 * Throws a `RangeError` when the data does not fit in version 40 (or `maxVersion`) at the requested level.
 */
export function encodeQRCode(value: string | string[], options: QRCodeEncodeOptions = {}): QRCodeMatrix {
  const { boostLevel = true } = options
  let level: QRCodeErrorLevel = LEVELS.includes(options.errorLevel!) ? options.errorLevel! : 'M'
  const minVersion = clampVersion(options.minVersion, MIN_VERSION)
  const maxVersion = Math.max(clampVersion(options.maxVersion, MAX_VERSION), minVersion)

  const segments: Segment[] = []
  for (const text of Array.isArray(value) ? value : [value]) {
    const segment = makeSegment(String(text ?? ''))
    if (segment)
      segments.push(segment)
  }

  // Smallest version that fits
  let version = minVersion
  let usedBits = 0
  for (; ; version++) {
    usedBits = getTotalBits(segments, version)
    if (usedBits <= getNumDataCodewords(version, level) * 8)
      break
    if (version >= maxVersion)
      throw new RangeError('[antdv-next-mobile: QRCode] Data too long')
  }

  // Use the spare capacity for a higher error correction level
  if (boostLevel) {
    for (const next of LEVELS.slice(LEVELS.indexOf(level) + 1)) {
      if (usedBits <= getNumDataCodewords(version, next) * 8)
        level = next
    }
  }

  // Segments -> bit stream
  const capacityBits = getNumDataCodewords(version, level) * 8
  const bits: number[] = []
  for (const segment of segments) {
    appendBits(MODE_BITS[segment.mode], 4, bits)
    appendBits(segment.numChars, charCountBits(segment.mode, version), bits)
    for (const bit of segment.bits)
      bits.push(bit)
  }
  // Terminator, byte alignment, pad bytes
  appendBits(0, Math.min(4, capacityBits - bits.length), bits)
  appendBits(0, (8 - (bits.length % 8)) % 8, bits)
  for (let pad = 0xEC; bits.length < capacityBits; pad ^= 0xEC ^ 0x11)
    appendBits(pad, 8, bits)

  const dataCodewords: number[] = Array.from<number>({ length: bits.length >>> 3 }).fill(0)
  bits.forEach((bit, i) => {
    dataCodewords[i >>> 3]! |= bit << (7 - (i & 7))
  })

  const matrix = new Matrix(version, level)
  matrix.drawFunctionPatterns()
  matrix.drawCodewords(addEccAndInterleave(dataCodewords, version, level))

  let mask = Math.floor(Number(options.mask))
  if (!(mask >= 0 && mask <= 7)) {
    mask = 0
    let minPenalty = Infinity
    for (let i = 0; i < 8; i++) {
      matrix.applyMask(i)
      matrix.drawFormatBits(i)
      const penalty = matrix.getPenaltyScore()
      if (penalty < minPenalty) {
        mask = i
        minPenalty = penalty
      }
      matrix.applyMask(i)
    }
  }
  matrix.applyMask(mask)
  matrix.drawFormatBits(mask)

  return { version, size: matrix.size, errorLevel: level, mask, modules: matrix.modules }
}

/* ---------------------------------- rendering ---------------------------------- */

export interface QRCodeExcavation {
  x: number
  y: number
  w: number
  h: number
}

/** Clears the modules covered by the icon */
export function excavateModules(modules: boolean[][], excavation: QRCodeExcavation): boolean[][] {
  return modules.map((row, y) => {
    if (y < excavation.y || y >= excavation.y + excavation.h)
      return row
    return row.map((cell, x) => (x < excavation.x || x >= excavation.x + excavation.w ? cell : false))
  })
}

/** One SVG path (horizontal runs merged) for all dark modules, in module units */
export function generatePath(modules: boolean[][], margin = 0): string {
  const ops: string[] = []
  modules.forEach((row, y) => {
    let start = -1
    for (let x = 0; x <= row.length; x++) {
      const dark = x < row.length && row[x]
      if (dark && start < 0) {
        start = x
      }
      else if (!dark && start >= 0) {
        ops.push(`M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`)
        start = -1
      }
    }
  })
  return ops.join('')
}
