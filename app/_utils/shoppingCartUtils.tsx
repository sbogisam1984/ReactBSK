'use server';

import { revalidatePath } from 'next/cache';
import { ShoppingCartDetailServiceType, ShoppingCartDetailType, ShoppingCartType } from '../_types/ShoppingCartType';
import { GetCookie } from './cookieUtils';
import { AdditionalServiceConverter, ProductConverter } from './productUtils';
import { redirect } from 'next/navigation';

export async function CreateShoppingCart(shoppingCart: ShoppingCartType): Promise<ShoppingCartType | undefined> {
  let ret: ShoppingCartType | undefined;
  const response = await fetch(process.env.API_BASE_URL + `/api/ShoppingCart`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shoppingCart),
    credentials: 'include',
  });

  if (response.ok) {
    const data = await response.json();
    ret = ShoppingCartConverter(data.data);
  }

  return ret;
}

export async function AddShoppingCartItem(
  shoppingCartId: number,
  shoppingCartItem: ShoppingCartDetailType
): Promise<ShoppingCartType | undefined> {
  let ret: ShoppingCartType | undefined;

  await fetch(process.env.API_BASE_URL + `/api/ShoppingCart/${shoppingCartId}/Item`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shoppingCartItem),
    credentials: 'include',
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      ret = ShoppingCartConverter(data.data);
    });

  return ret;
}

export async function RemoveShoppingCartItem(shoppingCartDetailId: number): Promise<ShoppingCartType | undefined> {
  let ret: ShoppingCartType | undefined;

  await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/ShoppingCart/Item/${shoppingCartDetailId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      ret = ShoppingCartConverter(data);
    });

  return ret;
}

export async function GetShoppingCart(shoppingCartId: number): Promise<ShoppingCartType | undefined> {
  let ret: ShoppingCartType | undefined;

  await fetch(process.env.API_BASE_URL + `/api/ShoppingCart/${shoppingCartId}`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      ret = ShoppingCartConverter(data.data);
    });

  return ret;
}

export async function GetShoppingCartByEnrollmentId(enrollmentId: number): Promise<ShoppingCartType | undefined> {
  let ret: ShoppingCartType | undefined;

  await fetch(process.env.API_BASE_URL + `/api/ShoppingCart/Enrollment/${enrollmentId}`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      }
    })
    .then(data => {
      if (data) {
        ret = ShoppingCartConverter(data.data);
      }
    })
    .catch(e => {
      //TODO: log
    });

  return ret;
}

export async function AddAlsoBuyItem(productId: number, quantity: number) {
  const enrollment = await GetCookie('enrollment');
  let shoppingCartId: number | undefined;
  if (enrollment) {
    const shoppingCart = await GetShoppingCartByEnrollmentId(+enrollment.value);
    if (shoppingCart) {
      shoppingCartId = Number(shoppingCart.shoppingCartId);
    }
  }

  console.log(`add item`);
  if (shoppingCartId) {
    const shoppingCartItem: ShoppingCartDetailType = {
      product: {
        productId: productId,
      },
      quantity: quantity,
    };

    const newShoppingCart = await AddShoppingCartItem(shoppingCartId, shoppingCartItem);
    console.log(JSON.stringify(newShoppingCart, null, 4));
  }
}

export async function AddAdditionalServices(shoppingCartDetailId: number | undefined, additionalServiceId: number) {
  console.log(`${shoppingCartDetailId} ${additionalServiceId}`);
  const response = await fetch(
    process.env.API_BASE_URL + `/api/ShoppingCart/Item/${shoppingCartDetailId}/Service/${additionalServiceId}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (response.ok) {
    const data = await response.json();
    return ShoppingCartItemsConverter(data.data);
  }

  if (!response.ok) {
    // TODO: log
  }
}

export async function RemoveAdditionalServices(shoppingCartDetailId: number | undefined, additionalServiceId: number) {
  console.log(`${shoppingCartDetailId} ${additionalServiceId}`);
  const response = await fetch(
    process.env.API_BASE_URL + `/api/ShoppingCart/Item/${shoppingCartDetailId}/Service/${additionalServiceId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (response.ok) {
    const data = await response.json();
    return ShoppingCartItemsConverter(data.data);
  }

  if (!response.ok) {
    // TODO: log
  }
}

export async function AdditionalServicesNextNavigation() {
  redirect('/Funding');
}

function ShoppingCartConverter(data: any): ShoppingCartType | undefined {
  return {
    enrollmentId: data.enrollmentId,
    shoppingCartId: data.id,
    shoppingCartItems: data.shoppingCartItems?.map((x: ShoppingCartDetailType) => ({
      product: ProductConverter(x.product),
      quantity: x.quantity,
      totalItemCost: x.totalItemCost,
      shoppingCartItemId: x.shoppingCartItemId,
      shoppingCartServices: x.shoppingCartServices?.map(s => ShoppingCartItemServicesConverter(s)),
      accountNumber: x.accountNumber,
    })),
    totalCost: data.totalCost,
  };
}

function ShoppingCartItemsConverter(data: any): ShoppingCartDetailType | undefined {
  return {
    product: ProductConverter(data.product),
    quantity: data.quantity,
    totalItemCost: data.totalItemCost,
    shoppingCartItemId: data.id,
    shoppingCartServices: data.shoppingCartServices?.map((s: any) => ShoppingCartItemServicesConverter(s)),
    accountNumber: data.accountNumber,
  };
}

function ShoppingCartItemServicesConverter(data: any): ShoppingCartDetailServiceType | undefined {
  //console.log(`ShoppingCartItemServicesConverter ${JSON.stringify(data,null,5)}`)
  return {
    shoppingCartItemServiceInfoId: data.shoppingCartItemServiceInfoId,
    additionalServicesInfo: AdditionalServiceConverter(data.additionalServicesInfo),
    cost: data.cost,
    quantity: data.quantity,
  };
}
