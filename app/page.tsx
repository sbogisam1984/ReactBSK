import React from 'react';
import ProfileNavBarWrapper from './_components/ProfileNavBar/profileNavBarWrapper';
import { setCurrentPage } from './_utils/pageUtils';
import { EnrollmentPageEnum } from './_types/EnrollmentInfo';
import AccountOpeningTips from './_components/AccountOpeningTips/AccountOpeningTips';
import Grid from '@mui/material/Grid2';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // TODO: Translate to friendly product name and add to cart
  const accountType = searchParams.accountType as string | undefined;
  const currentPage = EnrollmentPageEnum.Home;
  // [JL] I'm currently setting the lastCompletedStep to InitialVisit in the API when the enrollment is created
  await setCurrentPage(currentPage);

  return (
    <div>
      <ProfileNavBarWrapper currentPage={currentPage}>
        <Grid container>
          <Grid size={{ md: 2 }} />
          <Grid size={{ md: 8 }}>
            <AccountOpeningTips accountType={accountType} />
          </Grid>
        </Grid>
        <Grid size={{ md: 2 }} />
      </ProfileNavBarWrapper>
    </div>
  );
}
