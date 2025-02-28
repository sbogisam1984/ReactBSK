'use client';

import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useEffect, useState } from 'react';
import { EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';
import { LoadingButton } from '@mui/lab';

interface Props {
  currentPage: EnrollmentPageEnum;
}

export default function ShoppingCartBack({ currentPage }: Props) {
  const router = useRouter();
  const [fromProductMenu, setFromProductMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if previous entry in history is /productmenu
    setFromProductMenu(currentPage === EnrollmentPageEnum.ProductMenu);
  }, [currentPage]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleClick = () => {
    setIsLoading(true);
    if (fromProductMenu) {
      router.push('/SelectVerification');
    } else {
      router.back();
    }
  };

  return (
    <LoadingButton
      loading={isLoading}
      size="large"
      variant="contained"
      onClick={handleClick}
      endIcon={<ArrowRightIcon />}
    >
      <Typography>{fromProductMenu ? 'Check out' : 'Continue'}</Typography>
    </LoadingButton>
  );
}
