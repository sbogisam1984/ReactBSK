import { Box, Button, Container, Typography, Fab, Grid2 as Grid, Link } from '@mui/material';
import { EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';
import { ProductType } from '@/app/_types/ProductType';
import { ShoppingCartType } from '@/app/_types/ShoppingCartType';
import { GetEnrollment } from '@/app/_utils/enrollmentUtils';
import { setCurrentPage } from '@/app/_utils/pageUtils';
import { GetFilteredProducts } from '@/app/_utils/productListUtils';
import { CreateShoppingCart, GetShoppingCartByEnrollmentId } from '@/app/_utils/shoppingCartUtils';
import ProfileNavBarWrapper from '../../_components/ProfileNavBar/profileNavBarWrapper';
import ProductMenuHeader from './components/productMenuHeader';
import { ShoppingCart } from '@mui/icons-material';
import { redirect } from 'next/navigation';

export default async function CombinedProductMenuPage() {
  const currentPage = EnrollmentPageEnum.ProductMenu;
  let hasShoppingCartItems: boolean = false;
  const enrollment = await GetEnrollment();
  if (enrollment) {
    const enrollmentId: number = enrollment.data.enrollmentId;
    const zipCode: string | undefined = enrollment.data.enrollmentZipCode;
    const products: ProductType[] | undefined = await GetFilteredProducts(zipCode ?? '', '');
    const checkingProducts = products?.filter(x => x.productType === 'Checking');

    let shoppingCart: ShoppingCartType | undefined = await GetShoppingCartByEnrollmentId(enrollmentId);
    if (shoppingCart) {
      hasShoppingCartItems = (shoppingCart.shoppingCartItems?.length ?? 0) > 0;
    } else {
      const newShoppingCart: ShoppingCartType = {
        enrollmentId: Number(enrollmentId),
      };

      shoppingCart = await CreateShoppingCart(newShoppingCart);
    }

    if (products && products.length > 0 && checkingProducts) {
      await setCurrentPage(currentPage, { zipCode: zipCode });

      return (
        <ProfileNavBarWrapper currentPage={currentPage}>
          <Container>
            <Typography textTransform="uppercase" variant="h2" component="h2" paddingY=".5em">
              Products Available in {zipCode}:
            </Typography>
          </Container>
          <Container>
            <ProductMenuHeader products={products} shoppingCart={shoppingCart} initialProducts={checkingProducts} />
          </Container>
          <Grid container>
            <Grid size={{ xs: 12 }} sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Box
                sx={{
                  position: 'fixed',
                  bottom: '2rem',
                  right: '2rem',
                  zIndex: 1000,
                }}
              >
                <Fab
                  href="/SelectVerification"
                  color="primary"
                  disabled={!hasShoppingCartItems}
                  aria-label="checkout"
                  sx={{
                    width: '64px',
                    height: '64px',
                  }}
                >
                  <ShoppingCart />
                </Fab>
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Box sx={{ textAlign: 'right', p: 2, mr: 1 }}>
                <Button disabled={!hasShoppingCartItems} href="/SelectVerification" variant="contained">
                  Checkout
                </Button>
              </Box>
            </Grid>
          </Grid>
        </ProfileNavBarWrapper>
      );
    } else {
      redirect('/ZipError?redirect=GettingStarted');
    }
  }
}
