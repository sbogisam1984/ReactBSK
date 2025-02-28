import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';
import { GetEnrollment } from '@/app/_utils/enrollmentUtils';
import { Typography, Container, Grid2 as Grid, Stack } from '@mui/material';
import BackButton from './components/BackButton';
import { GetShoppingCartByEnrollmentId } from '../_utils/shoppingCartUtils';
import InvalidItemsList from './components/InvalidItemsList';
import { validateZipCodeForProducts } from '../_utils/zipCodeUtils';
import RemoveItemsForm from './components/RemoveItemsForm';
import { getCurrentPage } from '../_utils/pageUtils';

interface ZipErrorSearchParams {
  redirect?: string;
  [key: string]: string | string[] | undefined;
}

export default async function ZipErrorPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: ZipErrorSearchParams;
}) {
  const enrollment = await GetEnrollment();
  if (enrollment) {
    const enrollmentId: number = enrollment.data.enrollmentId;
    const zipCode: string | undefined = enrollment.data.enrollmentZipCode;
    const cart = await GetShoppingCartByEnrollmentId(enrollmentId);
    const validation = cart
      ? await validateZipCodeForProducts(zipCode ?? '', cart)
      : { isValid: false, invalidItems: [] };
    const hasValidItems = cart?.shoppingCartItems?.length !== validation.invalidItems.length;
    const targetPage = searchParams.redirect as string | undefined;
    const currentPage = await getCurrentPage();

    return (
      <ProfileNavBarWrapper currentPage={currentPage}>
        <Grid container justifyContent={'center'}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Container>
              <Typography variant="h2" component="h2" paddingY=".5em">
                Product Availability Issue
              </Typography>
              {cart ? (
                hasValidItems ? (
                  <>
                    <Typography sx={{ mb: 1 }} variant="body1">
                      The following items in your cart are not available in {zipCode}:
                    </Typography>
                    <InvalidItemsList items={validation.invalidItems} />
                  </>
                ) : (
                  <Typography sx={{ mb: 1 }} variant="body1">
                    None of the items in your cart are available in {zipCode}. Please try a different ZIP code.
                  </Typography>
                )
              ) : (
                <Typography sx={{ mb: 1 }} variant="body1">
                  Products are not available in {zipCode}. Please try a different ZIP code.
                </Typography>
              )}

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <BackButton targetPage={targetPage} />
                {cart && hasValidItems && <RemoveItemsForm invalidItems={validation.invalidItems} />}
              </Stack>
            </Container>
          </Grid>
        </Grid>
      </ProfileNavBarWrapper>
    );
  }
}
