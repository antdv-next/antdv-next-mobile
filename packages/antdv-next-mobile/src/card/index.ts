import { withInstall } from '../_util/withInstall'
import CardVue from './Card.vue'
import CardMetaVue from './CardMeta.vue'

export type * from './interface'

export const CardMeta = withInstall(CardMetaVue, 'AmCardMeta')

const Card = withInstall(CardVue, 'AmCard', { Meta: CardMeta })

export default Card
