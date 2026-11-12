import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import MarkdownIt from 'markdown-it'
import { createHighlighter } from 'shiki'

export interface Frontmatter {
  title?: string
  subtitle?: string
  description?: string
  order?: number
  group?: { title?: string, order?: number }
  [key: string]: any
}

export interface DemoMeta {
  id: string
  title: string
  src: string
  /** `<demo src full>`: render edge-to-edge without the padded card */
  full: boolean
}

const LANGS = ['vue', 'ts', 'tsx', 'js', 'json', 'css', 'html', 'bash', 'diff']
const VIRTUAL_ID = 'virtual:am-docs'
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`
const LOCALE = 'zh-CN'

let highlighterPromise: ReturnType<typeof createHighlighter> | undefined
function getHighlighter() {
  highlighterPromise ??= createHighlighter({ themes: ['github-light', 'github-dark'], langs: LANGS })
  return highlighterPromise
}

/** Minimal frontmatter parser: `key: value` with one level of nesting. */
export function parseFrontmatter(source: string): { data: Frontmatter, content: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  if (!match)
    return { data: {}, content: source }
  const data: Frontmatter = {}
  let parent: Record<string, any> | null = null
  match[1].split(/\r?\n/).forEach((line) => {
    if (!line.trim() || line.trim().startsWith('#'))
      return
    const m = /^(\s*)([\w-]+):(.*)$/.exec(line)
    if (!m)
      return
    const [, indent, key, rawValue] = m
    let value: any = rawValue.trim().replace(/^(['"])(.*)\1$/, '$2')
    if (value !== '' && !Number.isNaN(Number(value)))
      value = Number(value)
    if (indent.length > 0 && parent) {
      parent[key] = value
    }
    else if (value === '') {
      parent = {}
      data[key] = parent
    }
    else {
      parent = null
      data[key] = value
    }
  })
  return { data, content: source.slice(match[0].length) }
}

const demoReg = /<demo\s+src="([^"]+)"([^>]*)>([\s\S]*?)<\/demo>/g

export function extractDemos(content: string): DemoMeta[] {
  const demos: DemoMeta[] = []
  content.replace(demoReg, (_, src: string, attrs: string, title: string) => {
    demos.push({ id: path.basename(src, '.vue'), title: title.trim(), src, full: /\bfull\b/.test(attrs) })
    return ''
  })
  return demos
}

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s.]+/g, '-')
    .replace(/[^\w\p{Script=Han}-]/gu, '')
}

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function toScriptJson(value: unknown) {
  return JSON.stringify(value).replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--')
}

async function createRenderer() {
  const highlighter = await getHighlighter()
  const highlight = (code: string, lang: string) => {
    const language = LANGS.includes(lang) ? lang : 'text'
    return highlighter
      .codeToHtml(code, { lang: language, themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false })
      .replace('<pre', '<pre v-pre')
  }
  const md = new MarkdownIt({ html: true, linkify: true })
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]
    return `<div class="doc-code">${highlight(token.content.replace(/\n$/, ''), token.info.trim())}</div>`
  }
  md.renderer.rules.code_inline = (tokens, idx) => `<code v-pre>${escapeHtml(tokens[idx].content)}</code>`
  md.renderer.rules.table_open = () => '<div class="doc-table"><table>'
  md.renderer.rules.table_close = () => '</table></div>'

  const defaultLinkOpen = md.renderer.rules.link_open ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href') ?? ''
    if (/^https?:/.test(href)) {
      tokens[idx].attrSet('target', '_blank')
      tokens[idx].attrSet('rel', 'noopener')
    }
    return defaultLinkOpen(tokens, idx, options, env, self)
  }

  // headings: `## Title {#custom-id}` -> id + toc
  md.core.ruler.push('am_heading', (state) => {
    const toc: Array<{ id: string, text: string, level: number }> = []
    state.tokens.forEach((token, i) => {
      if (token.type !== 'heading_open')
        return
      const inline = state.tokens[i + 1]
      let text = inline.content
      let id: string | undefined
      const m = /\s*\{#([\w-]+)\}\s*$/.exec(text)
      if (m) {
        id = m[1]
        text = text.slice(0, m.index)
        inline.content = text
        const last = inline.children?.[inline.children.length - 1]
        if (last && last.type === 'text')
          last.content = last.content.replace(/\s*\{#[\w-]+\}\s*$/, '')
      }
      id ??= slugify(text)
      token.attrSet('id', id)
      const level = Number(token.tag.slice(1))
      if (level === 2 || level === 3)
        toc.push({ id, text: text.replace(/[`*]/g, ''), level })
    })
    state.env.toc = toc
    return true
  })
  return { md, highlight }
}

let rendererPromise: ReturnType<typeof createRenderer> | undefined
function getRenderer() {
  rendererPromise ??= createRenderer()
  return rendererPromise
}

function readDemoSource(file: string) {
  const raw = fs.readFileSync(file, 'utf-8')
  let desc = ''
  const code = raw
    .replace(/<docs(?:\s+lang="([^"]*)")?\s*>([\s\S]*?)<\/docs>\s*/g, (_, lang: string | undefined, body: string) => {
      if (!lang || lang === LOCALE)
        desc = body.trim()
      return ''
    })
    .trim()
  return { code, desc }
}

async function transformMarkdown(source: string, id: string) {
  const { md, highlight } = await getRenderer()
  const { data, content } = parseFrontmatter(source)
  const dir = path.dirname(id)
  const demos: any[] = []

  const body = content
    .replace(/<\/?demo-group[^>]*>/g, '')
    .replace(demoReg, (_, src: string, _attrs: string, title: string) => {
      const file = path.resolve(dir, src)
      const { code, desc } = readDemoSource(file)
      const index = demos.length
      demos.push({
        id: path.basename(src, '.vue'),
        title: title.trim(),
        descHtml: desc ? md.render(desc) : '',
        codeHtml: highlight(code, 'vue'),
        code,
      })
      return `\n\n<DemoBlock v-bind="demos[${index}]"></DemoBlock>\n\n`
    })

  const env: Record<string, any> = {}
  const html = md.render(body, env)

  return `<script setup>
import DemoBlock from '@site/components/DemoBlock.vue'
import DocPage from '@site/components/DocPage.vue'

const frontmatter = ${toScriptJson(data)}
const toc = ${toScriptJson(env.toc ?? [])}
const demos = ${toScriptJson(demos)}
</script>

<template>
  <DocPage :frontmatter="frontmatter" :toc="toc">
${html}
  </DocPage>
</template>
`
}

function scan(root: string) {
  const pagesDir = path.join(root, 'src/pages')
  const components: any[] = []
  const componentsDir = path.join(pagesDir, 'components')
  if (fs.existsSync(componentsDir)) {
    fs.readdirSync(componentsDir).sort().forEach((name) => {
      const file = path.join(componentsDir, name, `index.${LOCALE}.md`)
      if (!fs.existsSync(file))
        return
      const { data, content } = parseFrontmatter(fs.readFileSync(file, 'utf-8'))
      components.push({
        name,
        title: data.title ?? name,
        subtitle: data.subtitle ?? '',
        description: data.description ?? '',
        group: data.group?.title ?? '其他',
        groupOrder: data.group?.order ?? 99,
        order: data.order ?? 0,
        page: `/src/pages/components/${name}/index.${LOCALE}.md`,
        demos: extractDemos(content).map(demo => ({
          ...demo,
          file: `/src/pages/components/${name}/${demo.src.replace(/^\.\//, '')}`,
        })),
      })
    })
  }
  const guides: any[] = []
  const docsDir = path.join(pagesDir, 'docs')
  if (fs.existsSync(docsDir)) {
    fs.readdirSync(docsDir).filter(f => f.endsWith(`.${LOCALE}.md`)).forEach((fileName) => {
      const { data } = parseFrontmatter(fs.readFileSync(path.join(docsDir, fileName), 'utf-8'))
      const name = fileName.replace(`.${LOCALE}.md`, '')
      guides.push({
        name,
        title: data.title ?? name,
        group: data.group?.title ?? '指南',
        groupOrder: data.group?.order ?? 0,
        order: data.order ?? 0,
        page: `/src/pages/docs/${fileName}`,
      })
    })
  }
  guides.sort((a, b) => a.groupOrder - b.groupOrder || a.order - b.order)
  return { components, guides }
}

function generateVirtualModule(root: string) {
  const { components, guides } = scan(root)
  const componentCode = components.map((c) => {
    const demos = c.demos.map((d: any) => `{ id: ${JSON.stringify(d.id)}, title: ${JSON.stringify(d.title)}, full: ${d.full}, load: () => import(${JSON.stringify(d.file)}) }`).join(', ')
    const { page, demos: _demos, ...meta } = c
    return `{ ...${JSON.stringify(meta)}, page: () => import(${JSON.stringify(page)}), demos: [${demos}] }`
  }).join(',\n  ')
  const guideCode = guides.map((g) => {
    const { page, ...meta } = g
    return `{ ...${JSON.stringify(meta)}, page: () => import(${JSON.stringify(page)}) }`
  }).join(',\n  ')
  return `export const components = [\n  ${componentCode}\n]\nexport const guides = [\n  ${guideCode}\n]\n`
}

/**
 * - `*.md` -> Vue SFC (frontmatter, toc, shiki, `<demo src>` blocks)
 * - `virtual:am-docs` -> component / guide registry built from the markdown files
 * - `<docs>` custom blocks in demo SFCs are dropped from the runtime bundle
 */
export function markdownPlugin(): Plugin {
  let root = process.cwd()
  return {
    name: 'am-docs:markdown',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
    },
    resolveId(id) {
      if (id === VIRTUAL_ID)
        return RESOLVED_VIRTUAL_ID
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_ID)
        return generateVirtualModule(root)
    },
    async transform(code, id) {
      if (/[?&]type=docs/.test(id))
        return { code: 'export default {}', map: null }
      if (!id.endsWith('.md'))
        return
      // demo sources are inlined, make their changes re-render the page
      const dir = path.dirname(id)
      extractDemos(code).forEach(demo => this.addWatchFile(path.resolve(dir, demo.src)))
      return { code: await transformMarkdown(code, id), map: null }
    },
    configureServer(server) {
      const refresh = (file: string) => {
        if (!file.endsWith('.md') && !/[\\/]demo[\\/].*\.vue$/.test(file))
          return
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID)
        if (mod)
          server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', refresh)
      server.watcher.on('unlink', refresh)
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.md')) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID)
        if (mod)
          server.moduleGraph.invalidateModule(mod)
      }
    },
  }
}
