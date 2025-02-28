import React from 'react';
import DecisionDisplay from './components/DecisionDisplay/decision';
import { EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';
import { updateLastCompletedStep } from '@/app/_utils/lastCompletedStepUtils';
import { GetEnrollment } from '@/app/_utils/enrollmentUtils';
import { setCurrentPage } from '@/app/_utils/pageUtils';
import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';

export default async function Decision() {
  const currentPage = EnrollmentPageEnum.Decision;
  const enrollment = await GetEnrollment();

  if (enrollment) {
    await updateLastCompletedStep({
      currentPage: currentPage,
      lastCompletedStep: enrollment.data.lastCompletedStep,
    });

    await setCurrentPage(currentPage);

    return (
      <ProfileNavBarWrapper currentPage={currentPage}>
        <DecisionDisplay />
      </ProfileNavBarWrapper>
    );
  }
}
