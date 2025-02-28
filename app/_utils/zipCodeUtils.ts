import { ShoppingCartDetailType, ShoppingCartType } from '../_types/ShoppingCartType';
import { GetFilteredProducts } from './productListUtils';

export type ZipCodeValidationResult = {
  isValid: boolean;
  invalidItems: ShoppingCartDetailType[];
};

/**
 * Validates if a zip code is valid for available products, optionally checking against a shopping cart.
 * @param zipCode - The zip code to validate.
 * @param shoppingCart - Optional shopping cart to check products against.
 * @returns A promise that resolves to a ZipCodeValidationResult containing validation status and any invalid items.
 */
export async function validateZipCodeForProducts(
  zipCode: string,
  shoppingCart?: ShoppingCartType
): Promise<ZipCodeValidationResult> {
  const products = await GetFilteredProducts(zipCode, '');

  if (!products || products.length === 0) {
    return {
      isValid: false,
      invalidItems: shoppingCart?.shoppingCartItems ?? [],
    };
  }

  if (shoppingCart?.shoppingCartItems && shoppingCart.shoppingCartItems.length > 0) {
    const invalidItems = shoppingCart.shoppingCartItems.filter(
      cartItem => !products.some(product => product.productId === cartItem.product?.productId)
    );

    return {
      isValid: invalidItems.length === 0,
      invalidItems,
    };
  }

  return {
    isValid: true,
    invalidItems: [],
  };
}
