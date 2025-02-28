import React from 'react';
import { Box } from '@mui/material';
import Wizard from '../Wizard/wizard';
import { EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';
import Grid from '@mui/material/Grid2';
import NeedHelpMenu from '../NeedHelp/NeedHelpMenu';

interface Props {
  currentPage: EnrollmentPageEnum;
}

export default function ProfileNavBar({ currentPage }: Props) {
  return (
    <Box
      component="header"
      color={'secondary'}
      sx={{
        width: '100%',
        height: '47.5px',
        bgcolor: '#ebebeb',
        px: 2,
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid size={{ xs: 2.5, xl: 2 }} />
        <Grid size={{ xs: 7, xl: 8 }}>
          <Wizard currentPage={currentPage} />
        </Grid>
        <Grid size={{ xs: 2.5, xl: 2 }}>
          <Box position={'relative'}>
            <Box sx={{ position: 'absolute', top: -20, right: 0, zIndex: 1000 }}>
              <NeedHelpMenu variant="navbar" />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
