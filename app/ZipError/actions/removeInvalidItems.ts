'use server';

import { ShoppingCartDetailType } from '@/app/_types/ShoppingCartType';
import { RemoveShoppingCartItem } from '@/app/_utils/shoppingCartUtils';

export async function removeInvalidItems(invalidItems: ShoppingCartDetailType[]) {
  for (const item of invalidItems) {
    if (item.shoppingCartItemId) {
      await RemoveShoppingCartItem(item.shoppingCartItemId);
    }
  }
}
