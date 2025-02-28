import { Divider } from '@mui/material';
import React from 'react';
import Grid from '@mui/material/Grid2';

export default function CustomDivider() {
  return (
    <Grid container>
      <Grid size={1}>
        <Divider sx={{ my: 2, borderWidth: 1.5 }} />
      </Grid>
      <Grid />
    </Grid>
  );
}
