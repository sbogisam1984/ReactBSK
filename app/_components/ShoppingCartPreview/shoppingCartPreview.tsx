'use client';
import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Popover, Typography, CircularProgress } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Delete } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RemoveShoppingCartItem } from '../../_utils/shoppingCartUtils';
import { ShoppingCartDetailType } from '../../_types/ShoppingCartType';
import { getProductNameWithServicemark } from '@/app/_utils/productUtils';
import { LoadingButton } from '@mui/lab';

export default function ShoppingCartPreview({ cartItems }: { cartItems: ShoppingCartDetailType[] | undefined }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [localCartItems, setLocalCartItems] = useState<ShoppingCartDetailType[]>(cartItems || []);
  const [loadingItems, setLoadingItems] = useState<number[]>([]);
  const [isViewCartLoading, setIsViewCartLoading] = useState(false);

  useEffect(() => {
    setLocalCartItems(cartItems || []);
  }, [cartItems]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setIsOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const handleRemoveItem = async (itemId: number) => {
    setLoadingItems(prev => [...prev, itemId]);
    await RemoveShoppingCartItem(itemId);
    try {
      setLocalCartItems(prev => prev.filter(item => item.shoppingCartItemId !== itemId));
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setLoadingItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleViewCart = async () => {
    setIsViewCartLoading(true);
    router.push('/ShoppingCart');
  };

  const renderContent = () => {
    if (!localCartItems.length) {
      return <Typography>No items in cart.</Typography>;
    } else {
      return (
        <ul>
          {localCartItems.map((item, index) => (
            <li
              key={`${item.shoppingCartItemId}-${getProductNameWithServicemark(
                item.product?.productName,
                item.product?.isServicemarkRequired
              )}-${index}`}
              className="flex justify-between items-center my-2"
            >
              <Typography>
                {getProductNameWithServicemark(item.product?.productName, item.product?.isServicemarkRequired)} x
                {item.accountNumber?.slice(-4)}
              </Typography>
              <IconButton
                onClick={() => handleRemoveItem(Number(item.shoppingCartItemId))}
                disabled={loadingItems.includes(Number(item.shoppingCartItemId))}
              >
                {loadingItems.includes(Number(item.shoppingCartItemId)) ? <CircularProgress size={24} /> : <Delete />}
              </IconButton>
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div>
      <IconButton size="large" onClick={handleClick} className="relative">
        <Badge
          badgeContent={localCartItems.length}
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: 'white',
              color: '#cb4a20',
              borderRadius: '4px',
              fontSize: '.9rem',
              height: '18px',
              width: '18px',
            },
          }}
        >
          <ShoppingCartOutlinedIcon sx={{ color: 'white', fontSize: '2.5rem' }} fontSize="large" />
        </Badge>
      </IconButton>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        disableScrollLock
      >
        <div className="p-4">
          <Typography variant="h6">Cart Preview</Typography>
          <div>{renderContent()}</div>
          {localCartItems.length > 0 && (
            <LoadingButton
              loading={isViewCartLoading}
              variant="contained"
              className="mt-4 w-full"
              onClick={handleViewCart}
            >
              View Shopping Cart
            </LoadingButton>
          )}
        </div>
      </Popover>
    </div>
  );
}
