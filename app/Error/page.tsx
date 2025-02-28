import React from 'react';
import ProfileNavBarWrapper from '../_components/ProfileNavBar/profileNavBarWrapper';
import { Typography, Container, Grid2 as Grid, Stack } from '@mui/material';
import { getCurrentPage } from '../_utils/pageUtils';

interface ErrorPageParams {
  errorMsg?: string;
}

export default async function ErrorPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: ErrorPageParams;
}) {
  const currentPage = await getCurrentPage();
  return (
    <ProfileNavBarWrapper currentPage={currentPage}>
      <Grid container justifyContent={'center'}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Container>
            <Typography variant="h2" component="h2" paddingY=".5em">
              We&apos;ve encountered an error
            </Typography>
            <Typography sx={{ mb: 1 }} variant="body1">
              Error Details:
            </Typography>
            <Typography variant="body2">
              {searchParams.errorMsg ?? 'An error occurred while processing your request. Please try again later.'}
            </Typography>
          </Container>
        </Grid>
      </Grid>
    </ProfileNavBarWrapper>
  );
}
