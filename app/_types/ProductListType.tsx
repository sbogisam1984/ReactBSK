import { ProductType } from './ProductType'

export default interface ProductListType {
  product: ProductType,
  action?: {
    title: string
    click?: () => void
    link?: string
    addToCart?: boolean
  }
}
