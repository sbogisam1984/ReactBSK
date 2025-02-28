import { Typography } from '@mui/material';
import React from 'react';

interface Props {
  accountType?: string;
}

export default function OpeningToday({ accountType = '<ACCOUNT TYPE/NAME IF PRESELECTED>' }: Props) {
  return (
    <Typography variant="subtitle1" gutterBottom>
      OPENING TODAY: {accountType}
    </Typography>
  );
}
