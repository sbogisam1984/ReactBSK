import React from 'react';
import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';
import { setCurrentPage } from '@/app/_utils/pageUtils';
import { EnrollmentPageEnum } from '../../_types/EnrollmentInfo';
import { Typography } from '@mui/material';

export default async function InvalidApplicantPage() {
  const currentPage = EnrollmentPageEnum.KBAQuestions;
  await setCurrentPage(currentPage);

  return (
    <ProfileNavBarWrapper currentPage={currentPage}>
      <Typography>Placeholder text for Invalid Applicant response resulting from ID verification processing</Typography>
    </ProfileNavBarWrapper>
  );
}
