import React from 'react';
import Cart from '@/app/ShoppingCart/components/cart';
import ShoppingCartBack from './components/shoppingCartBack';
import { ShoppingCartType } from '../_types/ShoppingCartType';
import { GetShoppingCartByEnrollmentId } from '../_utils/shoppingCartUtils';
import { ProductType } from '../_types/ProductType';
import { GetFilteredProducts } from '../_utils/productListUtils';
import { GetEnrollment } from '../_utils/enrollmentUtils';
import { Box, Container, Typography } from '@mui/material';
import ProfileNavBarWrapper from '../_components/ProfileNavBar/profileNavBarWrapper';
import { getCurrentPage } from '../_utils/pageUtils';
import ProductMenuHeader from '../(OpenAccount)/ProductMenu/components/productMenuHeader';

export default async function ShoppingCart() {
  const enrollment = await GetEnrollment();
  if (enrollment) {
    const shoppingCart: ShoppingCartType | undefined = await GetShoppingCartByEnrollmentId(
      Number(enrollment.data.enrollmentId)
    );

    const zipCode: string | undefined = enrollment.data.enrollmentZipCode;
    const products: ProductType[] | undefined = await GetFilteredProducts(zipCode ?? '', '');
    const checkingProducts = products?.filter(x => x.productType === 'Checking');
    const currentPage = await getCurrentPage();

    if (products && products.length > 0 && checkingProducts) {
      return (
        <ProfileNavBarWrapper currentPage={currentPage}>
          <Container className="pt-2">
            <Cart shoppingCart={shoppingCart}></Cart>
          </Container>
          <Container>
            <Box display="flex" flexDirection="column" sx={{ paddingY: '1em' }}>
              <Typography variant="h2" component="h2" textTransform="uppercase" sx={{ paddingY: '1em' }}>
                Add another product?
              </Typography>
              <ProductMenuHeader
                products={products}
                shoppingCart={shoppingCart}
                initialProducts={checkingProducts}
              ></ProductMenuHeader>
              <div className="pt-4 self-end">
                <ShoppingCartBack currentPage={currentPage}></ShoppingCartBack>
              </div>
            </Box>
          </Container>
        </ProfileNavBarWrapper>
      );
    }
  }
}
