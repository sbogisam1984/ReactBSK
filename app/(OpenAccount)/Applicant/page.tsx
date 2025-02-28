import React from 'react';
import ApplicationInfo from './components/ApplicationInfo/applicationinfo';
import {
  ApplicantFormHandler,
  GetEnrollment,
  GetJointApplicant,
  GetPrimaryApplicant,
} from '../../_utils/enrollmentUtils';
import { ApplicantInfo, ApplicantTypeEnum, EnrollmentPageEnum } from '../../_types/EnrollmentInfo';
import { isSecondaryApplicant, updateLastCompletedStep } from '@/app/_utils/lastCompletedStepUtils';
import { setCurrentPage } from '@/app/_utils/pageUtils';
import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';

export default async function Applicant() {
  const currentPage = EnrollmentPageEnum.ApplicantInfo;

  // this is only needed for the scan workflow.
  // indicate the source, scan or manual, via a dynamic route or some other means
  const enrollment = await GetEnrollment();
  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  let currentApplicant: ApplicantInfo | undefined;
  let primaryApplicant: ApplicantInfo | undefined;
  const isJointApplication = enrollment.data.applicationType === ApplicantTypeEnum.Joint;
  const lastCompletedStep = enrollment.data.lastCompletedStep;
  const applicationType = enrollment.data.applicationType;

  if (applicationType === undefined) {
    throw new Error('Application Type not found');
  }

  if (lastCompletedStep === undefined) {
    throw new Error('LastCompletedStep not found');
  }

  if (isSecondaryApplicant(lastCompletedStep, isJointApplication)) {
    currentApplicant = await GetJointApplicant(enrollment);
    primaryApplicant = await GetPrimaryApplicant(enrollment);
  } else {
    currentApplicant = await GetPrimaryApplicant(enrollment);
  }

  await updateLastCompletedStep({
    currentPage: currentPage,
    isJointApplication: isJointApplication,
    lastCompletedStep: lastCompletedStep,
  });

  await setCurrentPage(currentPage);

  return (
    <ProfileNavBarWrapper currentPage={currentPage}>
      <ApplicationInfo
        currentApplicant={currentApplicant}
        action={ApplicantFormHandler}
        enrollmentZipCode={enrollment.data.enrollmentZipCode}
        applicationType={applicationType}
        primaryApplicant={primaryApplicant}
      />
    </ProfileNavBarWrapper>
  );
}
