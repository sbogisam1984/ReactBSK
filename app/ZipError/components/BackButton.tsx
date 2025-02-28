'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  targetPage?: string;
}

export default function BackButton({ targetPage }: BackButtonProps) {
  const router = useRouter();

  console.log(targetPage);

  const handleClick = () => {
    if (targetPage) {
      router.push(`/${targetPage}`);
    } else {
      router.back();
    }
  };

  return (
    <Button variant="contained" onClick={handleClick}>
      Go Back
    </Button>
  );
}
