import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';
import React from 'react';
import BeforeWeBegin from './BeforeWeBegin';
import Grid from '@mui/material/Grid2';
import { setCurrentPage } from '@/app/_utils/pageUtils';
import { EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';

export default async function GettingStartedPage() {
  const currentPage = EnrollmentPageEnum.GettingStarted;
  await setCurrentPage(currentPage);

  return (
    <ProfileNavBarWrapper currentPage={currentPage}>
      <Grid container justifyContent={'center'}>
        <Grid size={{ xs: 11, md: 8 }}>
          <BeforeWeBegin />
        </Grid>
      </Grid>
    </ProfileNavBarWrapper>
  );
}
