import { GetEnrollment, GetJointApplicant, GetPrimaryApplicant } from '@/app/_utils/enrollmentUtils';
import { ApplicantInfo, ApplicantTypeEnum, EnrollmentPageEnum, TransactionTypeEnum } from '@/app/_types/EnrollmentInfo';
import { isSecondaryApplicant, updateLastCompletedStep } from '@/app/_utils/lastCompletedStepUtils';
import { setCurrentPage } from '@/app/_utils/pageUtils';
import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';
import { notFound } from 'next/navigation';
import VerificationOptions from './verificationOptions';
import { Grid2 as Grid } from '@mui/material';
import { headers } from 'next/headers';

export default async function SelectVerificationPage() {
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);

  const enrollment = await GetEnrollment();
  let currentApplicant: ApplicantInfo | undefined;

  if (!enrollment || !enrollment.data) {
    throw new Error('No enrollment found');
  }

  const lastCompletedStep = enrollment.data.lastCompletedStep;

  if (lastCompletedStep === undefined) {
    throw new Error('LastCompletedStep not found');
  }
  const isJointApplication = enrollment.data.applicationType === ApplicantTypeEnum.Joint;
  if (isSecondaryApplicant(lastCompletedStep, isJointApplication)) {
    currentApplicant = await GetJointApplicant(enrollment);
  } else {
    currentApplicant = await GetPrimaryApplicant(enrollment);
  }

  if (!currentApplicant) {
    notFound(); // Not sure if this is the best way to handle this, but let's try
  }
  const currentPage = EnrollmentPageEnum.SelectVerification;

  // Update the lastCompletedStep
  await updateLastCompletedStep({
    currentPage: currentPage,
    isJointApplication: enrollment.data.applicationType === ApplicantTypeEnum.Joint,
    lastCompletedStep: lastCompletedStep,
  });

  await setCurrentPage(currentPage);

  return (
    <ProfileNavBarWrapper currentPage={currentPage}>
      <Grid container justifyContent={'center'}>
        <Grid size={8}>
          <VerificationOptions currentApplicant={currentApplicant} enrollment={enrollment} isMobile={isMobile} />
        </Grid>
      </Grid>
    </ProfileNavBarWrapper>
  );
}
