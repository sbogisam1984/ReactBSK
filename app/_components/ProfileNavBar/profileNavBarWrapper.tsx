import { EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';
import { GetEnrollment } from '@/app/_utils/enrollmentUtils';
import ProfileNavBar from './profilenavbar';
import { Box, Container } from '@mui/material';
import React from 'react';

interface Props {
  children: React.ReactNode;
  currentPage: EnrollmentPageEnum;
}

export default async function ProfileNavBarWrapper({ children, currentPage }: Props) {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <ProfileNavBar currentPage={currentPage} />
      <Container>{children}</Container>
    </Box>
  );
}
