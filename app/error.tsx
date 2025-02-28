'use client';

import { Typography, Container, Grid2 as Grid, Stack } from '@mui/material';
import ProfileNavBarWrapper from './_components/ProfileNavBar/profileNavBarWrapper';
import { getCurrentPage } from './_utils/pageUtils';
import { useEffect, useState } from 'react';
import { EnrollmentPageEnum } from './_types/EnrollmentInfo';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [currentPage, setCurrentPage] = useState<EnrollmentPageEnum>(EnrollmentPageEnum.Home);

  useEffect(() => {
    const loadPage = async () => {
      const page = await getCurrentPage();
      setCurrentPage(page);
    };
    loadPage();
  }, []);

  return (
    <ProfileNavBarWrapper currentPage={currentPage}>
      <Grid container justifyContent={'center'}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Container>
            <Typography variant="h2" component="h2" paddingY=".5em">
              We&apos;ve encountered a system error
            </Typography>
            <Typography sx={{ mb: 1 }} variant="body1">
              Error Details:
            </Typography>
            <Typography variant="body2">{error.message}</Typography>
            {error.digest && <Typography variant="body2">Digest: {error.digest}</Typography>}
          </Container>
        </Grid>
      </Grid>
    </ProfileNavBarWrapper>
  );
}
