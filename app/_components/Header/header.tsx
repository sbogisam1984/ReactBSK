'use client';
import React from 'react';
import { AppBar, Toolbar, Box, Link, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCartDetailType } from '@/app/_types/ShoppingCartType';
import ShoppingCartPreview from '../ShoppingCartPreview/shoppingCartPreview';
import CBNALogo from '../../../public/assets/img/cbnaLogo.svg';
import ChainLinkIcon from '../Icons/ChainLinkIcon';
import NeedHelpMenu from '../NeedHelp/NeedHelpMenu';

interface HeaderProps {
  cartItems?: ShoppingCartDetailType[];
}

export default function Header({ cartItems }: HeaderProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Add paths where the cart should be hidden
  const hideCartPaths = ['/ShoppingCart'];

  // Check if current path starts with any of the hidden paths
  const shouldHideCart = hideCartPaths.some(path => pathname?.startsWith(path));

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary', borderRadius: '0', height: { xs: '70px', md: '80px' } }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <Link href="/" underline="none">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            {isMobile ? (
              // Mobile logo
              <ChainLinkIcon color="white" width={40} height={40} />
            ) : (
              // Desktop logo
              <Image
                src={CBNALogo}
                alt="Company Logo"
                width={405}
                height={40}
                priority
                style={{
                  width: 'auto',
                  height: '40px',
                  maxWidth: '405px', // Ensures logo doesn't get too large
                }}
              />
            )}
          </Box>
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
          {isMobile && <NeedHelpMenu variant="header" />}
          {!shouldHideCart && <ShoppingCartPreview cartItems={cartItems} />}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
