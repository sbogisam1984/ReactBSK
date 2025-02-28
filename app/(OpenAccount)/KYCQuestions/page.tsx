import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';
import React from 'react';
import KYCQuestions from './components/KYCQuestions';
import { setCurrentPage } from '@/app/_utils/pageUtils';
import { ApplicantInfo, ApplicantTypeEnum, EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';
import { GetEnrollment, GetJointApplicant, GetPrimaryApplicant } from '@/app/_utils/enrollmentUtils';
import { isSecondaryApplicant, updateLastCompletedStep } from '@/app/_utils/lastCompletedStepUtils';
import { fetchKYCAnswers, fetchKYCQuestions } from '@/app/_utils/kycUtils';

export default async function KYCQuestionsPage() {
  const currentPage = EnrollmentPageEnum.KYCQuestions;
  const enrollment = await GetEnrollment();
  let currentApplicant: ApplicantInfo | undefined = undefined;

  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  const isJointApplication = enrollment.data.applicationType === ApplicantTypeEnum.Joint;
  currentApplicant = isSecondaryApplicant(enrollment.data.lastCompletedStep, isJointApplication)
    ? await GetJointApplicant(enrollment)
    : await GetPrimaryApplicant(enrollment);

  if (!currentApplicant) {
    throw new Error('Current Applicant not found');
  }

  if (!currentApplicant.applicantType) {
    throw new Error('Applicant type not found');
  }

  const fetchResponse = await fetchKYCQuestions();
  const questions = fetchResponse.data;

  if (!questions) {
    throw new Error('Error fetching KYC questions');
  }

  if (currentApplicant.id === null) {
    throw new Error('Applicant ID is null');
  }
  const answersResponse = await fetchKYCAnswers(currentApplicant.id);
  const answers = answersResponse.data;

  if (!answers) {
    throw new Error('Error fetching KYC answers');
  }

  await updateLastCompletedStep({
    currentPage: currentPage,
    isJointApplication: isJointApplication,
    lastCompletedStep: enrollment.data.lastCompletedStep,
  });

  await setCurrentPage(currentPage);
  return (
    <ProfileNavBarWrapper currentPage={currentPage}>
      <KYCQuestions
        questions={questions}
        applicantId={currentApplicant?.id}
        applicantType={currentApplicant.applicantType}
        previousAnswers={answers}
      />
    </ProfileNavBarWrapper>
  );
}
