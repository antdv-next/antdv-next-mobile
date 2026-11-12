import components from './components'

export type FilterPattern = ReadonlyArray<string | RegExp> | string | RegExp | null

export interface AntdvNextMobileResolverOptions {
  /**
   * Components or icons that should not be imported automatically.
   * Matches the tag name (`AmButton`) or the export name (`Button`).
   *
   * @default []
   */
  exclude?: FilterPattern
  /**
   * Also import the icons of `@antdv-next/icons` (`<SearchOutlined />`).
   *
   * @default false
   */
  resolveIcons?: boolean
}

export interface AntdvNextMobileResolveResult {
  name: string
  from: string
}

/** Structurally compatible with `ComponentResolverObject` of `unplugin-vue-components`. */
export interface AntdvNextMobileComponentResolver {
  type: 'component'
  resolve: (name: string) => AntdvNextMobileResolveResult | undefined
}

const ICON_RE = /^[A-Z][A-Za-z0-9]*(?:Outlined|Filled|TwoTone)$/

/** `AmQRCode` -> `AmQrcode`, so the export spelling works as a tag too. */
const aliases: Record<string, string> = {}
Object.keys(components).forEach((name) => {
  const alias = `Am${components[name]}`
  if (!components[alias])
    aliases[alias] = name
})

function isExclude(name: string, exclude?: FilterPattern): boolean {
  if (!exclude)
    return false
  const patterns = typeof exclude === 'string' || exclude instanceof RegExp ? [exclude] : exclude
  return patterns.some(pattern => (typeof pattern === 'string' ? name === pattern : pattern.test(name)))
}

/**
 * Resolver for [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components):
 * imports `@antdv-next/mobile` components on demand (`<am-button>` / `<AmButton>`).
 */
export function AntdvNextMobileResolver(options: AntdvNextMobileResolverOptions = {}): AntdvNextMobileComponentResolver {
  const { exclude, resolveIcons = false } = options
  return {
    type: 'component',
    resolve(name) {
      if (isExclude(name, exclude))
        return

      const importName = components[name] ?? components[aliases[name]]
      if (importName) {
        if (isExclude(importName, exclude))
          return
        return { name: importName, from: '@antdv-next/mobile' }
      }

      if (resolveIcons && ICON_RE.test(name))
        return { name, from: '@antdv-next/icons' }
    },
  }
}

export default AntdvNextMobileResolver
