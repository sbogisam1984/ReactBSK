import { EnrollmentStepEnum, EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';
import { UpdateEnrollmentKeyValue } from '@/app/_utils/enrollmentUtils';

interface StepUpdateContext {
  lastCompletedStep: EnrollmentStepEnum;
  currentPage: EnrollmentPageEnum;
  isJointApplication?: boolean;
}

function getStepOrder(step: EnrollmentStepEnum): number {
  return Object.values(EnrollmentStepEnum).indexOf(step);
}

export function isSecondaryApplicant(lastCompletedStep: EnrollmentStepEnum, isJointApplication?: boolean): boolean {
  return (
    isJointApplication === true &&
    getStepOrder(lastCompletedStep) >= getStepOrder(EnrollmentStepEnum.PrimaryConfirmIdentity)
  );
}

/**
 * Updates the last completed step based on the current page and application type.
 *
 * @param context - The context of the step update
 * @returns Promise<EnrollmentStepEnum> - The updated last completed step
 *
 * Summary of pages requiring isJointApplication:
 * - SelectVerification
 * - ScanVerification
 * - ApplicantInfo
 * - ConfirmIdentity
 * - KYCQuestions
 * - KBAQuestions
 * - AdditionalServices
 *
 * For these pages, the step progression differs between joint and individual applications.
 * Other pages have the same step progression regardless of application type.
 */
export async function updateLastCompletedStep(context: StepUpdateContext): Promise<EnrollmentStepEnum> {
  const { lastCompletedStep, currentPage, isJointApplication } = context;

  const isSecondaryApplicantStep = isSecondaryApplicant(lastCompletedStep, isJointApplication);
  let stepBeforeCurrentPage: EnrollmentStepEnum;

  switch (currentPage) {
    case EnrollmentPageEnum.Home:
    case EnrollmentPageEnum.Products:
      stepBeforeCurrentPage = EnrollmentStepEnum.InitialVisit;
      break;
    case EnrollmentPageEnum.SelectVerification:
      stepBeforeCurrentPage = isJointApplication
        ? isSecondaryApplicantStep
          ? EnrollmentStepEnum.PrimaryKBA
          : EnrollmentStepEnum.ProductSelection
        : EnrollmentStepEnum.ProductSelection;
      break;
    case EnrollmentPageEnum.ScanVerification:
    case EnrollmentPageEnum.ApplicantInfo:
      stepBeforeCurrentPage = isJointApplication
        ? isSecondaryApplicantStep
          ? EnrollmentStepEnum.JointVerificationSelection
          : EnrollmentStepEnum.PrimaryVerificationSelection
        : EnrollmentStepEnum.PrimaryVerificationSelection;
      break;
    case EnrollmentPageEnum.ConfirmIdentity:
      stepBeforeCurrentPage = isJointApplication
        ? isSecondaryApplicantStep
          ? EnrollmentStepEnum.JointDetails
          : EnrollmentStepEnum.PrimaryDetails
        : EnrollmentStepEnum.PrimaryDetails;
      break;
    case EnrollmentPageEnum.KYCQuestions:
    case EnrollmentPageEnum.KBAQuestions:
    case EnrollmentPageEnum.SelectJoint:
      stepBeforeCurrentPage = isJointApplication
        ? isSecondaryApplicantStep
          ? EnrollmentStepEnum.JointConfirmIdentity
          : EnrollmentStepEnum.PrimaryConfirmIdentity
        : EnrollmentStepEnum.PrimaryConfirmIdentity;
      break;
    case EnrollmentPageEnum.Funding:
      stepBeforeCurrentPage = isJointApplication
        ? isSecondaryApplicantStep
          ? EnrollmentStepEnum.JointKBA
          : EnrollmentStepEnum.PrimaryKBA
        : EnrollmentStepEnum.PrimaryKBA;
      break;
    case EnrollmentPageEnum.Disclosures:
      stepBeforeCurrentPage = EnrollmentStepEnum.Funding;
      break;
    case EnrollmentPageEnum.Decision:
      stepBeforeCurrentPage = EnrollmentStepEnum.Disclosures;
      break;
    default:
      console.warn(`Unhandled page in updateLastCompletedStep: ${EnrollmentPageEnum[currentPage]}`);
      return lastCompletedStep;
  }

  if (getStepOrder(stepBeforeCurrentPage) > getStepOrder(lastCompletedStep)) {
    await UpdateEnrollmentKeyValue({
      key: 'LastCompletedStep',
      value: stepBeforeCurrentPage.toString(),
    });
    return stepBeforeCurrentPage;
  }

  return lastCompletedStep;
}
