import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

const root = fileURLToPath(new URL('.', import.meta.url))

function collectCss(dir: string, list: string[] = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory())
      collectCss(full, list)
    else if (entry.name.endsWith('.css') && entry.name !== 'style.css')
      list.push(full)
  }
  return list
}

/** Concatenate every per-component css chunk into a single `dist/style.css` for full import. */
function fullCss() {
  return {
    name: 'antdv-next-mobile:full-css',
    closeBundle() {
      const dist = join(root, 'dist')
      const files = collectCss(dist).sort((a, b) => {
        // tokens & base first so component styles can override them
        const rank = (f: string) => (f.includes(`${join('dist', 'style')}`) ? 0 : 1)
        return rank(a) - rank(b) || a.localeCompare(b)
      })
      writeFileSync(join(dist, 'style.css'), files.map(f => readFileSync(f, 'utf-8')).join('\n'))
    },
  }
}

export default defineConfig({
  plugins: [vue(), libInjectCss(), fullCss()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    minify: false,
    lib: {
      entry: join(root, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^vue($|\/)/, /^@antdv-next\//, /^@v-c\//, /^dayjs($|\/)/],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
})
