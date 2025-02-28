'use server';

import { ProductType } from '../_types/ProductType';
import { ProductConverter } from './productUtils';

export async function GetFilteredProducts(
  zipCode: string,
  productType: string,
  isNewCustomer: boolean = true
): Promise<ProductType[]> {
  let filteredProducts: ProductType[] = [];

  await fetch(
    process.env.NEXT_PUBLIC_API_BASE_URL +
      `/api/Product/Filter?zipCode=${zipCode}&productType=${productType}&isNewCustomer=${isNewCustomer}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      if (data.data) {
        const filteredProductsTemp = data.data;
        filteredProducts = filteredProductsTemp.map((p: ProductType) => {
          return ProductConverter(p);
        });
      }
    });

  return filteredProducts;
}
