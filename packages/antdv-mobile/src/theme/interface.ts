export interface SeedToken {
  colorPrimary?: string
  colorSuccess?: string
  colorWarning?: string
  colorError?: string
  colorInfo?: string
  colorLink?: string
  colorTextBase?: string
  colorBgBase?: string
  fontFamily?: string
  fontFamilyCode?: string
  fontSize?: number | string
  lineWidth?: number | string
  lineType?: string
  borderRadius?: number | string
  controlHeight?: number | string
  zIndexPopupBase?: number
}

export interface MapToken {
  colorPrimaryBg?: string
  colorPrimaryBgHover?: string
  colorPrimaryBorder?: string
  colorPrimaryBorderHover?: string
  colorPrimaryHover?: string
  colorPrimaryActive?: string
  colorPrimaryText?: string
  colorSuccessBg?: string
  colorSuccessBorder?: string
  colorSuccessText?: string
  colorWarningBg?: string
  colorWarningBorder?: string
  colorWarningText?: string
  colorErrorBg?: string
  colorErrorBorder?: string
  colorErrorText?: string
  colorInfoBg?: string
  colorInfoBorder?: string
  colorInfoText?: string
  colorText?: string
  colorTextSecondary?: string
  colorTextTertiary?: string
  colorTextQuaternary?: string
  colorTextHeading?: string
  colorTextLabel?: string
  colorTextDescription?: string
  colorTextPlaceholder?: string
  colorTextDisabled?: string
  colorTextLightSolid?: string
  colorIcon?: string
  colorBgContainer?: string
  colorBgElevated?: string
  colorBgLayout?: string
  colorBgSpotlight?: string
  colorBgMask?: string
  colorBgContainerDisabled?: string
  colorFill?: string
  colorFillSecondary?: string
  colorFillTertiary?: string
  colorFillQuaternary?: string
  colorBorder?: string
  colorBorderSecondary?: string
  colorSplit?: string
  fontSizeSM?: number | string
  fontSizeLG?: number | string
  fontSizeXL?: number | string
  fontSizeHeading1?: number | string
  fontSizeHeading2?: number | string
  fontSizeHeading3?: number | string
  fontSizeHeading4?: number | string
  fontSizeHeading5?: number | string
  lineHeight?: number
  lineHeightSM?: number
  lineHeightLG?: number
  fontWeightStrong?: number
  controlHeightXS?: number | string
  controlHeightSM?: number | string
  controlHeightLG?: number | string
  borderRadiusXS?: number | string
  borderRadiusSM?: number | string
  borderRadiusLG?: number | string
  borderRadiusXL?: number | string
  paddingXXS?: number | string
  paddingXS?: number | string
  paddingSM?: number | string
  padding?: number | string
  paddingMD?: number | string
  paddingLG?: number | string
  paddingXL?: number | string
  marginXXS?: number | string
  marginXS?: number | string
  marginSM?: number | string
  margin?: number | string
  marginMD?: number | string
  marginLG?: number | string
  marginXL?: number | string
  motionDurationFast?: string
  motionDurationMid?: string
  motionDurationSlow?: string
  boxShadow?: string
  boxShadowSecondary?: string
  opacityDisabled?: number
}

/** Any other key is converted with the same rule: `fooBarLG` -> `--am-foo-bar-lg`. */
export type AliasToken = SeedToken & MapToken & { [key: string]: string | number | undefined }

export type ThemeAlgorithmName = 'default' | 'dark' | 'compact'

export interface ThemeAlgorithm {
  (): ThemeAlgorithmName
  /** @internal */
  __amAlgorithm: ThemeAlgorithmName
}

export type ComponentToken = Record<string, string | number | undefined>

export interface ThemeConfig {
  /**
   * `theme.defaultAlgorithm` / `theme.darkAlgorithm` / `theme.compactAlgorithm`
   * (or the strings `'default' | 'dark' | 'compact'`). Arrays compose.
   */
  algorithm?: ThemeAlgorithm | ThemeAlgorithmName | Array<ThemeAlgorithm | ThemeAlgorithmName>
  /** Global tokens, same names as antdv-next. Written as CSS variables `--am-*`. */
  token?: AliasToken
  /** Component tokens: `{ Button: { borderRadius: 20 } }` -> `--am-button-border-radius: 20px`. */
  components?: Record<string, ComponentToken | undefined>
  /** Inherit the theme of the parent ConfigProvider. Default `true`. */
  inherit?: boolean
  /** Accepted for antdv-next compatibility. CSS variables are always on. */
  cssVar?: boolean | Record<string, any>
  /** Accepted for antdv-next compatibility. No hash is ever generated. */
  hashed?: boolean
}

export interface ResolvedTheme {
  /** class list for the theme scope element */
  className: string[]
  /** inline css variables for the theme scope element (global tokens) */
  style: Record<string, string>
  /**
   * Stylesheet text carrying the component tokens (`theme.components`). Components declare their
   * own tokens on their root class, so an inherited variable could never override them; a scoped
   * rule targeting the component root does.
   */
  css: string
  algorithms: ThemeAlgorithmName[]
  isDark: boolean
  token: AliasToken
}
