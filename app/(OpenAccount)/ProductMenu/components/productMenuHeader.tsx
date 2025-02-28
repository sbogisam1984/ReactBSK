'use client';

import { Box, Button, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import ProductMenuItems from './productMenuItems';
import { ProductType } from '@/app/_types/ProductType';
import { useState } from 'react';
import { ShoppingCartType } from '@/app/_types/ShoppingCartType';
import Grid from '@mui/material/Grid2';

export interface ProductMenuHeaderProps {
  products: ProductType[];
  shoppingCart: ShoppingCartType | undefined;
  initialProducts: ProductType[];
}

export default function ProductMenuHeader({ products, shoppingCart, initialProducts }: ProductMenuHeaderProps) {
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { id: 'Checking', label: 'Checking' },
    { id: 'Savings', label: 'Savings' },
    { id: 'Money Market', label: isMobile ? 'Money Mkt' : 'Money Market' },
    { id: 'Certificate of Deposit', label: isMobile ? 'CD' : 'Certificate of Deposit' },
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const filterText = menuItems[newValue].id;
    const filtered = products.filter(x => x.productType === filterText);
    setFilteredProducts(filtered);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'column' } }}>
      <Box
        sx={{
          borderRight: { xs: 0, sm: 0 },
          borderColor: 'divider',
          width: '100%',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          variant={isMobile ? 'standard' : 'fullWidth'}
          sx={{
            '& .MuiTab-root': {
              color: 'text.primary',
              textTransform: 'none',
              fontWeight: 'bold',
              minHeight: 48,
              alignItems: isMobile ? 'flex-start' : 'center',
              borderBottom: isMobile ? '1px solid black' : 'none',
              '&:first-child': {
                borderTop: isMobile ? '1px solid black' : 'none',
              },
              '&:last-child': {
                borderBottom: isMobile ? '1px solid black' : 'none',
              },
            },
            '& .Mui-selected': {
              bgcolor: '#cb4a20',
              color: 'white',
            },
          }}
        >
          {menuItems.map((item, index) => (
            <Tab
              key={item.id}
              label={item.label}
              sx={{
                '&.Mui-selected': {
                  color: 'white',
                },
              }}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ flexGrow: 1, pt: 2 }}>
        <ProductMenuItems products={filteredProducts} shoppingCart={shoppingCart} />
      </Box>
    </Box>
  );
}
