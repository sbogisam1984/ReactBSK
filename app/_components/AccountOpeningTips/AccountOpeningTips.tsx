import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Link } from '@mui/material';
import { Circle, OpenInNew } from '@mui/icons-material';
import CustomDivider from '../CustomDivider/CustomDivider';
import ApplyNowButton from './ApplyNowButton';

interface Props {
  accountType?: string;
}

const AccountOpeningTips = ({ accountType }: Props) => {
  const tips = [
    'Social Security number',
    "A valid form of government-issued identification in your name, such as a Driver's License, Military ID, State-Issued ID, or Passport",
    'Information for your opening deposit, such as details for an internal transfer, ACH, or card payment',
    'If applying for a joint account, have your co-applicant available to provide similar information',
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {accountType && (
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          OPENING TODAY: {accountType}
        </Typography>
      )}

      <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
        Some helpful tips before you begin:
      </Typography>

      <CustomDivider />

      <Typography variant="body1" sx={{ mb: 1 }}>
        To expedite this process, please have the following information handy:
      </Typography>

      <List sx={{ mb: 2 }}>
        {tips.map((tip, index) => (
          <ListItem
            key={index}
            sx={{
              py: { xs: 1, sm: 0.75 },
              px: 0,
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'flex-start',
                mr: 1,
                mt: '6px',
              }}
            >
              <Circle
                sx={{
                  fontSize: '0.5rem',
                  color: 'primary.main',
                }}
              />
            </Box>
            <ListItemText primary={tip} primaryTypographyProps={{ variant: 'body1' }} />
          </ListItem>
        ))}
      </List>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please note that our online account openings are for individual and joint consumer requests only. For business
        accounts or accounts being opened by fiduciaries, including powers of attorney, please{' '}
        <Link
          href="https://cbna.com/locations"
          underline="hover"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          find a nearby branch to apply
          <OpenInNew sx={{ fontSize: '1rem' }} />
        </Link>
        .
      </Typography>

      <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
        Ready to begin?
      </Typography>

      <ApplyNowButton />
    </Box>
  );
};

export default AccountOpeningTips;
