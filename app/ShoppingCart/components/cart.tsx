'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RemoveShoppingCartItem } from '@/app/_utils/shoppingCartUtils';
import { ShoppingCartDetailType, ShoppingCartType } from '@/app/_types/ShoppingCartType';
import { Typography, Grid2 as Grid, Box, Divider, Button, Link } from '@mui/material';
import ShoppingCartAdditionalServices from './shoppingCartAdditionalServices';
import { getProductNameWithServicemark } from '@/app/_utils/productUtils';

export const Cart = ({ shoppingCart }: { shoppingCart: ShoppingCartType | undefined }) => {
  const router = useRouter();

  const handleCartItemClick = (index: number) => {
    router.push('/Applicant');
  };

  return (
    <>
      <Box sx={{ py: 1 }}>
        <Typography variant="h2" textTransform="uppercase" gutterBottom>
          Your Cart
        </Typography>
        <Box className="flex flex-col content-center">
          {shoppingCart?.shoppingCartItems?.length === 0 && <div>No items in cart</div>}
          {(shoppingCart?.shoppingCartItems?.length ?? 0) > 0 && (
            <Grid container>
              <Grid size={{ md: 6 }} offset={{ md: 6 }}>
                <Typography></Typography>
              </Grid>
              {shoppingCart?.shoppingCartItems?.map((item: ShoppingCartDetailType, index) => (
                <React.Fragment key={item.shoppingCartItemId}>
                  <Grid size={{ md: 12 }} offset={{ md: 0 }} key={item.shoppingCartItemId} className="pt-8">
                    <Link className="px-[0.375rem] cursor-pointer" href={'/Applicant'}>
                      {getProductNameWithServicemark(
                        item.product?.productName?.toUpperCase(),
                        item.product?.isServicemarkRequired
                      )}{' '}
                      x{item.accountNumber?.slice(-4)}{' '}
                    </Link>
                    <Link
                      href=""
                      onClick={async () => {
                        await RemoveShoppingCartItem(Number(item.shoppingCartItemId));
                        router.refresh();
                      }}
                    >
                      <Typography className="px-[0.375rem]" color="primary">
                        (-) Remove
                      </Typography>
                    </Link>
                  </Grid>
                  <ShoppingCartAdditionalServices item={item}></ShoppingCartAdditionalServices>
                  <Grid size={{ md: 2 }} offset={{ md: 5 }}>
                    {(item.totalItemCost ?? 0) > 0 && (
                      <Typography textAlign="right">
                        Sub total: {item.totalItemCost?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </Typography>
                    )}
                  </Grid>
                  <Grid size={{ md: 4 }}></Grid>
                  <Grid size={{ md: 12 }}>
                    <Divider></Divider>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          )}
          <Grid container>
            {(shoppingCart?.totalCost ?? 0) > 0 && (
              <Grid size={{ md: 2 }} offset={{ md: 5 }}>
                <Typography fontWeight="bold" textAlign="right">
                  Total: {shoppingCart?.totalCost?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Cart;
