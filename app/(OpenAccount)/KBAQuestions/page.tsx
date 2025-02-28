import React from 'react';
import KBAQuestions from './components/kbaquestions';
import { ApplicantTypeEnum, EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';
import { GetEnrollment, GetJointApplicant, GetKBAQuestions, GetPrimaryApplicant } from '@/app/_utils/enrollmentUtils';
import { isSecondaryApplicant, updateLastCompletedStep } from '@/app/_utils/lastCompletedStepUtils';
import { setCurrentPage } from '@/app/_utils/pageUtils';
import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';

export default async function KBAQuestionsPage() {
  const currentPage = EnrollmentPageEnum.KBAQuestions;
  const enrollment = await GetEnrollment();
  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  const isJointApplication = enrollment.data.applicationType === ApplicantTypeEnum.Joint;

  await updateLastCompletedStep({
    currentPage: currentPage,
    lastCompletedStep: enrollment.data.lastCompletedStep,
    isJointApplication: isJointApplication,
  });

  const currentApplicant = isSecondaryApplicant(enrollment.data.lastCompletedStep, isJointApplication)
    ? await GetJointApplicant(enrollment)
    : await GetPrimaryApplicant(enrollment);

  if (!currentApplicant) {
    throw new Error('Applicant not found');
  }

  if (currentApplicant.id === null) {
    throw new Error('Applicant ID is null');
  }

  const questions = await GetKBAQuestions(currentApplicant.id);

  await setCurrentPage(currentPage);

  return (
    <ProfileNavBarWrapper currentPage={currentPage}>
      <KBAQuestions
        applicationType={enrollment.data.applicationType}
        applicant={currentApplicant}
        questions={questions}
        enrollmentId={enrollment.data.enrollmentId}
        enrollmentZipCode={enrollment.data.enrollmentZipCode}
      />
    </ProfileNavBarWrapper>
  );
}
