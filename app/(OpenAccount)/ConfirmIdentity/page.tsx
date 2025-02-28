import React from 'react';
import ConfirmIdentity from './components/confirmIdentity';
import { Occupation } from '@/app/_types/OccupationType';
import { VerificationType } from '@/app/_types/VerificationType';
import { fetchAllowedCountries, fetchHouseholdIncomeRanges, fetchOccupations } from '@/app/_utils/confirmIdentityUtils';
import { fetchVerifications } from '@/app/_utils/confirmIdentityUtils';
import { ApplicantInfo, ApplicantTypeEnum, Country, EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';
import { isSecondaryApplicant, updateLastCompletedStep } from '@/app/_utils/lastCompletedStepUtils';
import { GetEnrollment, GetJointApplicant, GetPrimaryApplicant } from '@/app/_utils/enrollmentUtils';
import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';
import { setCurrentPage } from '@/app/_utils/pageUtils';
import { HouseholdIncomeRange } from '@/app/_types/HouseholdIncomeType';

export default async function ConfirmIdentityPage() {
  const currentPage = EnrollmentPageEnum.ConfirmIdentity;

  let occupations: Occupation[] = [];
  let verifications: VerificationType[] = [];
  let householdIncomeRanges: HouseholdIncomeRange[] = [];
  let currentApplicant: ApplicantInfo | undefined = undefined;
  let countries: Country[] = [];
  const enrollment = await GetEnrollment();
  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  if (!enrollment.data.enrollmentZipCode) {
    throw new Error('Zip code not found');
  }

  const isJointApplication = enrollment.data.applicationType === ApplicantTypeEnum.Joint;
  try {
    occupations = await fetchOccupations();
  } catch (error) {
    console.error('Failed to fetch occupations:', error);
  }

  try {
    householdIncomeRanges = await fetchHouseholdIncomeRanges();
  } catch (error) {
    throw new Error('Failed to fetch household income ranges');
  }

  try {
    countries = await fetchAllowedCountries();
  } catch (error) {
    console.error('Failed to fetch countries:', error);
  }

  await updateLastCompletedStep({
    currentPage: currentPage,
    isJointApplication: isJointApplication,
    lastCompletedStep: enrollment.data.lastCompletedStep,
  });

  currentApplicant = isSecondaryApplicant(enrollment.data.lastCompletedStep, isJointApplication)
    ? await GetJointApplicant(enrollment)
    : await GetPrimaryApplicant(enrollment);

  if (!currentApplicant) {
    throw new Error('Current Applicant not found');
  }

  try {
    verifications = await fetchVerifications(currentApplicant.verificationType?.toString());
  } catch (error) {
    console.error('Failed to fetch Verifications:', error);
  }

  await setCurrentPage(currentPage);

  return (
    <ProfileNavBarWrapper currentPage={currentPage}>
      <ConfirmIdentity
        applicant={currentApplicant}
        enrollmentId={enrollment.data.enrollmentId}
        occupations={occupations}
        verifications={verifications}
        enrollmentZipCode={enrollment.data.enrollmentZipCode}
        householdIncomeRanges={householdIncomeRanges}
        countries={countries}
      />
    </ProfileNavBarWrapper>
  );
}
