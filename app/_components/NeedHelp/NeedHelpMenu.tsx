'use client';
import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Stack,
  Link,
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Help as HelpIcon, Close as CloseIcon } from '@mui/icons-material';

interface NeedHelpMenuProps {
  variant?: 'header' | 'navbar';
}

const NeedHelpContent = () => (
  <Stack spacing={1}>
    <Link href="#" variant="body1" color="primary" sx={{ justifyContent: 'flex-start' }}>
      Request A Callback
    </Link>
    <Link href="#" variant="body1" color="primary" sx={{ justifyContent: 'flex-start' }}>
      Email our Digital Accounts Team
    </Link>
    <Link href="#" variant="body1" color="primary" sx={{ justifyContent: 'flex-start' }}>
      FAQs
    </Link>
    <Link href="#" variant="body1" color="primary" sx={{ justifyContent: 'flex-start' }}>
      Branch Locator
    </Link>
  </Stack>
);

const NeedHelpMenu = ({ variant = 'navbar' }: NeedHelpMenuProps) => {
  const [expanded, setExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const expandedWidth = '350px';
  const collapsedWidth = '180px';

  const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  // Don't render in navbar if mobile
  if (variant === 'navbar' && isMobile) {
    return null;
  }

  // Don't render in header if not mobile
  if (variant === 'header' && !isMobile) {
    return null;
  }

  if (variant === 'header') {
    return (
      <>
        <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'white' }}>
          <HelpIcon />
        </IconButton>

        <Drawer
          anchor="right"
          PaperProps={{
            sx: {
              borderRadius: 0,
            },
          }}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            sx={{
              width: '300px', // or any width you prefer
              p: 2,
              height: '100%',
              bgcolor: 'background.paper',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                NEED HELP?
              </Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <NeedHelpContent />
          </Box>
        </Drawer>
      </>
    );
  }

  // Desktop accordion version
  return (
    <Box
      sx={{
        width: expanded ? expandedWidth : collapsedWidth,
        transition: 'width 0.2s ease-in-out',
        overflow: 'hidden',
        '& .MuiAccordion-root:last-of-type ': {
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
        border: expanded ? '1px solid lightGray' : 'none',
      }}
    >
      <Accordion
        sx={{
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
          },
          width: expanded ? expandedWidth : collapsedWidth,
          '& .MuiAccordionSummary-root': {
            justifyContent: 'center',
            paddingLeft: '30px',
          },
        }}
        expanded={expanded}
        onChange={handleChange}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="primary" />}
          aria-controls="need-help-content"
          id="need-help-header"
          sx={{
            bgcolor: 'white',
            '& .MuiAccordionSummary-content': { flexGrow: expanded ? '1' : '0' },
            justifyContent: 'flex-start',
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            NEED HELP?
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            bgcolor: 'white',
            paddingLeft: '30px',
            paddingBottom: '30px',
            width: expandedWidth,
          }}
        >
          <NeedHelpContent />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default NeedHelpMenu;
