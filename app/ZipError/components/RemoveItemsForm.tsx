'use client';
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { removeInvalidItems } from '../actions/removeInvalidItems';
import { GetEnrollment, ResumeApplicantForm } from '@/app/_utils/enrollmentUtils';
import { redirect } from 'next/navigation';
import { ApplicantTypeEnum } from '@/app/_types/EnrollmentInfo';
import { ShoppingCartDetailType } from '@/app/_types/ShoppingCartType';

interface RemoveItemsFormProps {
  invalidItems: ShoppingCartDetailType[];
}

export default function RemoveItemsForm({ invalidItems }: RemoveItemsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      action={async () => {
        setIsLoading(true);
        try {
          await removeInvalidItems(invalidItems);

          const updatedEnrollment = await GetEnrollment();
          if (updatedEnrollment?.data.applicantDetails?.[0]) {
            const applicant = updatedEnrollment.data.applicantDetails[0];
            if (applicant.applicantType !== ApplicantTypeEnum.Primary) {
              redirect('/applicant');
            }
            await ResumeApplicantForm({
              firstName: applicant.firstName ?? '',
              lastName: applicant.lastName ?? '',
              emailAddress: applicant.email ?? '',
              phone: applicant.phone ?? '',
              physicalAddress: applicant.address?.streetName ?? '',
              physicalCity: applicant.address?.city ?? '',
              physicalState: applicant.address?.state ?? '',
              physicalZip: applicant.address?.zipCode ?? '',
              mailingAddress: applicant.mailingAddress?.streetName ?? '',
              mailingCity: applicant.mailingAddress?.city ?? '',
              mailingState: applicant.mailingAddress?.state ?? '',
              mailingZip: applicant.mailingAddress?.zipCode ?? '',
              usePhysicalAddress: applicant.usePhysicalAddress ?? true,
              applicantType: applicant.applicantType ?? ApplicantTypeEnum.Primary,
            });
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <LoadingButton type="submit" variant="contained" color="primary" loading={isLoading} loadingPosition="center">
        Remove Unavailable Items & Continue
      </LoadingButton>
    </form>
  );
}
