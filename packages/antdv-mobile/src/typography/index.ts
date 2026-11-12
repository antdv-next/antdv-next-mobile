import { withInstall } from '../_util/withInstall'
import TypographyVue from './Typography.vue'
import TypographyParagraphVue from './TypographyParagraph.vue'
import TypographyTextVue from './TypographyText.vue'
import TypographyTitleVue from './TypographyTitle.vue'

export type * from './interface'

export const TypographyText = withInstall(TypographyTextVue, 'AmTypographyText')
export const TypographyTitle = withInstall(TypographyTitleVue, 'AmTypographyTitle')
export const TypographyParagraph = withInstall(TypographyParagraphVue, 'AmTypographyParagraph')

const Typography = withInstall(TypographyVue, 'AmTypography', {
  Text: TypographyText,
  Title: TypographyTitle,
  Paragraph: TypographyParagraph,
})

export default Typography
