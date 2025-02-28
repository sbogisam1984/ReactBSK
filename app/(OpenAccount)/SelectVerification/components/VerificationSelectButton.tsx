'use client';

import { LoadingButton } from '@mui/lab';
import { useEffect, useState, useTransition } from 'react';
import { ApplicantInfo, TransactionTypeEnum, VerificationTypeEnum } from '@/app/_types/EnrollmentInfo';
import { verificationOptionHandler } from '@/app/_utils/verificationUtils';

interface Props {
  variant: 'contained' | 'outlined';
  children: React.ReactNode;
  enrollmentId: number;
  applicant: ApplicantInfo;
  transactionType: TransactionTypeEnum;
  verificationType: VerificationTypeEnum;
}

export default function VerificationSelectButton({
  variant,
  children,
  enrollmentId,
  applicant,
  transactionType,
  verificationType,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      verificationOptionHandler(enrollmentId, applicant, transactionType, verificationType);
    });
  };

  return (
    <LoadingButton loading={isPending} variant={variant} onClick={handleClick}>
      {children}
    </LoadingButton>
  );
}
