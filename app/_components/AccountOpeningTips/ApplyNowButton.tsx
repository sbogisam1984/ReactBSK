'use client';

import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ApplyNowButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // add useeffect to reset loading state
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    router.push('/GettingStarted');
  };

  return (
    <LoadingButton
      onClick={handleClick}
      variant="outlined"
      loading={isLoading}
      sx={{
        minWidth: { xs: '50%', sm: 'auto' },
      }}
    >
      APPLY NOW
    </LoadingButton>
  );
};

export default ApplyNowButton;
