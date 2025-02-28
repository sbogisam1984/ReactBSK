import { Box } from '@mui/material';
import { GetFooterDisclosures } from '../../_utils/disclosureUtils';
import { FooterDesktop } from './FooterDesktop';
import { FooterMobile } from './FooterMobile';

export default async function Footer() {
  const footerDisclosures = await GetFooterDisclosures();

  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <FooterDesktop footerDisclosures={footerDisclosures} />
      </Box>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <FooterMobile footerDisclosures={footerDisclosures} />
      </Box>
    </>
  );
}
