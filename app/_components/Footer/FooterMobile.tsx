'use client';
import { Box, Stack, Typography } from '@mui/material';
import { DisclosureInfo } from '../../_types/EnrollmentInfo';
import FooterDisclosureModal from './footerDisclosureModal';
import Image from 'next/image';
import fdicLogo from '../../../public/assets/img/fdicLogo.png';

interface FooterProps {
  footerDisclosures: DisclosureInfo | undefined;
}

export function FooterMobile({ footerDisclosures }: FooterProps) {
  const termsAndConditions = footerDisclosures?.applicationDisclosures?.find(x => x.disclosureType === 2);
  const privacyNotice = footerDisclosures?.applicationDisclosures?.find(x => x.disclosureType === 5);

  return (
    <Box
      component={'footer'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'grey.200',
        py: 1,
        px: 2,
        mt: 2,
      }}
    >
      <Stack direction="column" spacing={1} alignItems="center">
        <Box sx={{ mt: 2, position: 'relative', height: 'auto', maxWidth: '100%' }}>
          <img
            src={'/DigitalUnity/assets/img/fdicLogo.png'}
            alt="FDIC and Equal Housing Lender Logo"
            style={{ objectFit: 'contain' }}
          />
        </Box>
        <Stack direction="row" spacing={2}>
          <FooterDisclosureModal disclosureName="Privacy Policy">
            <object height="95%" width="100%" data={privacyNotice?.disclosureUrl} type="application/pdf"></object>
          </FooterDisclosureModal>
          <FooterDisclosureModal disclosureName="Terms of Use">
            <object height="95%" width="100%" data={termsAndConditions?.disclosureUrl} type="application/pdf"></object>
          </FooterDisclosureModal>
        </Stack>
      </Stack>
      <Typography sx={{ pt: 1 }} variant="body1" textAlign="center">
        &copy;2024 COMMUNITY BANK, N.A.
      </Typography>
    </Box>
  );
}
