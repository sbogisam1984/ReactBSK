import React from 'react';
import SelectJointApplication from '@/app/(OpenAccount)/Applicant/components/ApplicationInfo/selectJointApplication';
import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';
import {
  GetEnrollment,
  GetJointApplicant,
  GetPrimaryApplicant,
  InitializeApplicant,
} from '@/app/_utils/enrollmentUtils';
import { notFound, redirect } from 'next/navigation';
import { setCurrentPage } from '@/app/_utils/pageUtils';
import { ApplicantTypeEnum, EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';
import { isSecondaryApplicant } from '@/app/_utils/lastCompletedStepUtils';

export default async function SelectJointPage() {
  const currentPage = EnrollmentPageEnum.SelectJoint;
  const enrollment = await GetEnrollment();

  if (!enrollment) {
    notFound();
  }

  await setCurrentPage(currentPage);

  const currentApplicant = isSecondaryApplicant(
    enrollment.data.lastCompletedStep,
    enrollment.data.applicationType === ApplicantTypeEnum.Joint
  )
    ? await GetJointApplicant(enrollment)
    : await GetPrimaryApplicant(enrollment);

  if (!currentApplicant || !currentApplicant.id) {
    throw new Error('current applicant not found');
  }

  if (currentApplicant.applicantType === ApplicantTypeEnum.Joint) {
    redirect('/Funding');
  }

  const InitializeJointApplicant = async () => {
    'use server';
    await InitializeApplicant(enrollment, ApplicantTypeEnum.Joint);
  };

  return (
    <ProfileNavBarWrapper currentPage={currentPage}>
      <SelectJointApplication initializeJointApplicant={InitializeJointApplicant} />
    </ProfileNavBarWrapper>
  );
}
