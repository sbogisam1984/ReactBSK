'use client';
import { Box, Stack, Typography } from '@mui/material';
import { DisclosureInfo } from '../../_types/EnrollmentInfo';
import FooterDisclosureModal from './footerDisclosureModal';
import Image from 'next/image';
import fdicLogo from '../../../public/assets/img/fdicLogo.png';

interface FooterProps {
  footerDisclosures: DisclosureInfo | undefined;
}

export function FooterDesktop({ footerDisclosures }: FooterProps) {
  const termsAndConditions = footerDisclosures?.applicationDisclosures?.find(x => x.disclosureType === 2);
  const privacyNotice = footerDisclosures?.applicationDisclosures?.find(x => x.disclosureType === 5);

  return (
    <Box
      component={'footer'}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'grey.200',
        py: 1,
        px: 2,
        mt: 2,
      }}
    >
      <Stack direction="row" spacing={2}>
        <Typography sx={{ pt: 1 }} variant="body1">
          &copy;2024 COMMUNITY BANK, N.A.
        </Typography>
        <FooterDisclosureModal disclosureName="Privacy Policy">
          <object height="95%" width="100%" data={privacyNotice?.disclosureUrl} type="application/pdf"></object>
        </FooterDisclosureModal>
        <FooterDisclosureModal disclosureName="Terms of Use">
          <object height="95%" width="100%" data={termsAndConditions?.disclosureUrl} type="application/pdf"></object>
        </FooterDisclosureModal>
      </Stack>
      <Box>
        <Box sx={{ mt: 1, position: 'relative', height: '100%', maxWidth: '100%' }}>
          <img
            src="/DigitalUnity/assets/img/fdicLogo.png"
            alt="FDIC and Equal Housing Lender Logo"
            style={{ objectFit: 'contain' }}
          />
        </Box>
      </Box>
    </Box>
  );
}
