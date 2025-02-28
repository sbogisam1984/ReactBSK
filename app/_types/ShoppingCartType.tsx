import { AdditionalServicesType, ProductType } from "./ProductType"

export interface ShoppingCartType {
    enrollmentId: number,
    shoppingCartId?: number,
    shoppingCartItems?: ShoppingCartDetailType[],
    totalCost?: number
}

export interface ShoppingCartDetailType {
    shoppingCartItemId?: number,
    quantity?: number,
    product?: ProductType,
    shoppingCartServices?: ShoppingCartDetailServiceType[],
    totalItemCost?: number,
    accountNumber?: string
}

export interface ShoppingCartDetailServiceType {
    shoppingCartItemServiceInfoId?: number,
    additionalServicesInfo?: AdditionalServicesType,
    cost?: number,
    quantity?: number
}
