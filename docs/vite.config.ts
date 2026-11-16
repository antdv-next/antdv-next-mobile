import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { unitPlugin } from '../packages/antdv-mobile/build/unit'
import { markdownPlugin } from './plugins/markdown'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  base: process.env.DOCS_BASE || '/',
  plugins: [
    // the library is consumed from source here, so its css needs the same px -> unit pass as the build
    unitPlugin(),
    markdownPlugin(),
    vue({ include: [/\.vue$/, /\.md$/] }),
  ],
  resolve: {
    alias: [
      { find: /^@antdv-next\/mobile\/locale\/(.*)$/, replacement: `${r('../packages/antdv-mobile/src/locale')}/$1` },
      { find: /^@antdv-next\/mobile$/, replacement: r('../packages/antdv-mobile/src/index.ts') },
      { find: '@site', replacement: r('./src/site') },
      { find: '@mobile', replacement: r('./src/mobile') },
    ],
  },
  server: {
    host: true,
    port: 5180,
  },
  build: {
    rollupOptions: {
      input: {
        index: r('./index.html'),
        mobile: r('./mobile.html'),
      },
    },
  },
})
