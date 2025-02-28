'use server';

import { redirect } from 'next/navigation';
import {
  AddApplicantResponse,
  ApplicantInfo,
  ApplicantQuestions,
  AdditionalQuestions,
  ApplicantTypeEnum,
  DisclosureFile,
  DisclosureInfo,
  EnrollmentInfo,
  VerificationTypeEnum,
  KBARequest,
  TransactionTypeEnum,
  ApplicantKBAAnswers,
} from '../_types/EnrollmentInfo';
import { GetCookie, SetCookie } from './cookieUtils';
import { ApplicantInfoFormValues } from '../(OpenAccount)/Applicant/components/ApplicationInfo/applicationinfo';
import { Log } from './logUtils';
import { GetFilteredProducts } from './productListUtils';
import { GetShoppingCartByEnrollmentId } from './shoppingCartUtils';
import { validateZipCodeForProducts } from './zipCodeUtils';
import { IdIQResult, ManualIdVerificationStatusEnum } from '../_types/IdIQResult';

export async function CreateEnrollment(details: string) {
  let enrollmentId: number = 0;

  await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/Enrollment`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ details: details }),
    credentials: 'include',
  })
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      enrollmentId = data.data.enrollmentId;
    })
    .catch(e => {
      // TODO: log
    });

  return { enrollmentId: enrollmentId };
}

export async function CreateEnrollmentSession(enrollmentId: number | undefined, details: string) {
  if (!enrollmentId) {
    const response = await CreateEnrollment(details);
    enrollmentId = response.enrollmentId;
    await SetCookie('enrollment', enrollmentId.toString());
  }

  return { enrollmentId: enrollmentId };
}

export async function ProcessIdIQResult(
  applicantId: number | undefined,
  workflowStepsIds: string[]
): Promise<IdIQResult | undefined> {
  let idIQResult: IdIQResult | undefined;

  if (applicantId !== undefined) {
    const idIQResponse: Response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + `/api/Enrollment/Applicant/${applicantId}/IdIQ`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowStepsIds),
      }
    );

    if (idIQResponse.ok) {
      const idIQjson = await idIQResponse.json();

      if (idIQjson.isSuccess) {
        idIQResult = idIQjson.data;

        switch (idIQResult?.manualIdVerificationStatus) {
          case ManualIdVerificationStatusEnum.VERIFIED:
            redirect('/KYCQuestions');
            break;
          case ManualIdVerificationStatusEnum.INVALIDAPPLICANT:
            redirect('/InvalidApplicant');
            break;
          case ManualIdVerificationStatusEnum.REQUIRESKBA:
            redirect('/KBAQuestions');
            break;
          default:
            break;
        }
      }
    } else {
      redirect('/Error?errorMsg=Failure completing applicant verification');
    }
  }

  return idIQResult;
}

export async function ProcessLiveQResult(applicantId: number | undefined): Promise<IdIQResult | undefined> {
  let idIQResult: IdIQResult | undefined;

  if (applicantId !== undefined) {
    const liveQResponse: Response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + `/api/Enrollment/Applicant/${applicantId}/LiveQ`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (liveQResponse.ok) {
      const liveQjson = await liveQResponse.json();

      if (liveQjson.isSuccess) {
        idIQResult = liveQjson.data;

        switch (idIQResult?.manualIdVerificationStatus) {
          case ManualIdVerificationStatusEnum.VERIFIED:
            redirect('/KYCQuestions');
            break;
          case ManualIdVerificationStatusEnum.INVALIDAPPLICANT:
            redirect('/InvalidApplicant');
            break;
          case ManualIdVerificationStatusEnum.REQUIRESSTEPUP:
            // TODO: temporary, change this redirect
            redirect('/InvalidApplicant');
            break;
          default:
            break;
        }
      }
    }
  }

  return idIQResult;
}

export async function GetKBAQuestions(applicantId: number): Promise<ApplicantQuestions[] | undefined> {
  const kbaResponse = await fetch(
    process.env.NEXT_PUBLIC_API_BASE_URL + `/api/Enrollment/Applicant/${applicantId}/KBAQuestions`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (kbaResponse.ok) {
    const kbaJson = await kbaResponse.json();
    const kbaQuestions: ApplicantQuestions[] = kbaJson?.applicantKBAQuestions;

    if (kbaQuestions !== undefined && (kbaQuestions?.length ?? 0 > 0)) {
      return kbaQuestions;
    } else {
      redirect('/SelectJoint');
    }
  }
}

export async function GetEnrollment(): Promise<EnrollmentInfo | undefined> {
  const enrollmentCookie = await GetCookie('enrollment');
  if (enrollmentCookie) {
    let enrollmentInfo: EnrollmentInfo | undefined = undefined;
    await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/Enrollment/${Number(enrollmentCookie.value)}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        enrollmentInfo = data;
      })
      .catch(e => {
        // TODO: log
      });

    return enrollmentInfo;
  } else {
    // TODO: log
    // throw new Error('Enrollment Cookie not found');
    return {
      data: {
        lastCompletedStep: 0,
        enrollmentId: 0,
        currentPage: 0,
      },
      errorMessage: 'Enrollment Cookie not found',
    };
  }
}

export async function GetPrimaryApplicant(enrollment: EnrollmentInfo): Promise<ApplicantInfo | undefined> {
  const applicantDetails = enrollment.data.applicantDetails;
  if (!applicantDetails) {
    throw new Error('ApplicantDetails not found');
  }

  const primaryApplicant = applicantDetails.find(applicant => applicant.applicantType === ApplicantTypeEnum.Primary);

  return primaryApplicant;
}

export async function GetJointApplicant(enrollment: EnrollmentInfo): Promise<ApplicantInfo | undefined> {
  if (enrollment.data.applicationType !== ApplicantTypeEnum.Joint) {
    throw new Error('Not a joint application');
  }

  const applicantDetails = enrollment.data.applicantDetails;
  if (!applicantDetails) {
    throw new Error('ApplicantDetails not found');
  }

  const jointApplicant = applicantDetails.find(applicant => applicant.applicantType === ApplicantTypeEnum.Joint);

  return jointApplicant;
}

export async function SubmitKBA(
  enrollmentId: number | undefined,
  applicantId: number | null | undefined,
  kbaRequests: KBARequest[]
): Promise<ApplicantKBAAnswers | undefined> {
  if (!enrollmentId || !applicantId) {
    throw new Error('Enrollment ID or Applicant ID is missing');
  }

  await Log(
    TransactionTypeEnum.KBA,
    JSON.stringify({
      event: 'KBA Request',
      enrollmentId,
      applicantId,
      requests: kbaRequests,
    })
  );

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Enrollment/${enrollmentId}/applicant/${applicantId}/KBA`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kbaRequests),
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    await Log(
      TransactionTypeEnum.KBA,
      JSON.stringify({
        event: 'KBA Submission Failed',
        status: response.status,
        statusText: response.statusText,
        responseBody: errorText,
        enrollmentId,
        applicantId,
      })
    );

    redirect('/Error?errorMsg=Failure completing applicant questions');
  }

  const responseJson = await response.json();
  const responseData: ApplicantKBAAnswers = responseJson.data;

  await Log(
    TransactionTypeEnum.KBA,
    JSON.stringify({
      event: 'KBA Response',
      enrollmentId,
      applicantId,
      response: responseData,
    })
  );

  return responseData;
}

export async function AddApplicantToEnrollment(
  enrollmentId: number,
  applicant: ApplicantInfo
): Promise<EnrollmentInfo | undefined> {
  const applicantResponse = await fetch(
    process.env.NEXT_PUBLIC_API_BASE_URL + `/api/Enrollment/${enrollmentId}/Applicant`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicant),
      credentials: 'include',
    }
  );

  // redirect to error if unsuccessful post?
  const applicantEnrollment: EnrollmentInfo | undefined = applicantResponse.ok
    ? await applicantResponse.json()
    : undefined;

  return applicantEnrollment;
}

export async function InitializeApplicant(
  enrollment: EnrollmentInfo,
  applicantType: ApplicantTypeEnum
): Promise<EnrollmentInfo | undefined> {
  try {
    if (!enrollment) {
      throw new Error('No enrollment found');
    }

    const applicant: ApplicantInfo = {
      applicantType: applicantType,
      id: null,
    };

    const response = await AddApplicantToEnrollment(enrollment.data.enrollmentId, applicant);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function CreateAccount(enrollmentId: number): Promise<EnrollmentInfo | undefined> {
  const accountResponse = await fetch(
    process.env.NEXT_PUBLIC_API_BASE_URL + `/api/Enrollment/${enrollmentId}/Account`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  const enrollment: EnrollmentInfo | undefined = accountResponse.ok ? await accountResponse.json() : undefined;

  return enrollment;
}

export async function ApplicantFormHandler(
  prevData: { currentApplicant?: Partial<ApplicantInfo> } | undefined,
  formData: ApplicantInfoFormValues
): Promise<AddApplicantResponse | undefined> {
  const enrollmentCookie = await GetCookie('enrollment');
  if (enrollmentCookie) {
    const enrollmentId: number = Number(enrollmentCookie.value);
    const currentApplicant: ApplicantInfo = {
      id: prevData?.currentApplicant?.id ?? null,
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthdate: prevData?.currentApplicant?.birthdate,
      email: formData.emailAddress,
      phone: formData.phone,
      applicantType: formData.applicantType,
      usePhysicalAddress: formData.usePhysicalAddress,
      address: {
        streetName: formData.physicalAddress,
        city: formData.physicalCity,
        state: formData.physicalState,
        zipCode: formData.physicalZip,
      },
      mailingAddress: formData.usePhysicalAddress
        ? {
            streetName: formData.physicalAddress,
            city: formData.physicalCity,
            state: formData.physicalState,
            zipCode: formData.physicalZip,
          }
        : {
            streetName: formData.mailingAddress,
            city: formData.mailingCity,
            state: formData.mailingState,
            zipCode: formData.mailingZip,
          },
      verificationType: prevData?.currentApplicant?.verificationType,
      usePrimaryAddressForJoint: formData.usePrimaryAddressForJoint,
    };

    // perform server-side validation
    let showValidation: boolean = true;

    const applicantEnrollment: EnrollmentInfo | undefined = await AddApplicantToEnrollment(
      enrollmentId,
      currentApplicant
    );

    // revalidate zip code
    if (currentApplicant.applicantType === ApplicantTypeEnum.Primary && !formData.skipZipValidation) {
      await UpdateEnrollmentKeyValue({ key: 'EnrollmentZipCode', value: formData.physicalZip.toString() });
      const shoppingCart = await GetShoppingCartByEnrollmentId(enrollmentId);

      const zipCodeValidation = await validateZipCodeForProducts(formData.physicalZip, shoppingCart);
      if (!zipCodeValidation.isValid) {
        redirect('/ZipError?redirect=Applicant');
      }
    }

    if (!applicantEnrollment?.errorMessage) {
      // save applicant
      //applicantEnrollment = await AddApplicantToEnrollment(enrollmentId, applicant);
      showValidation = false;
      if (applicantEnrollment) {
        redirect(`/ConfirmIdentity`);
      }
    }

    return {
      showValidation: showValidation,
      applicantEnrollment: applicantEnrollment,
    };
  }
}

export async function UpdateEnrollmentKeyValue({
  key,
  value,
}: {
  key: string;
  value: string | undefined;
}): Promise<EnrollmentInfo | undefined> {
  const enrollmentCookie = await GetCookie('enrollment');
  if (enrollmentCookie) {
    const enrollmentId: string = enrollmentCookie.value;
    const response = await fetch(process.env.API_BASE_URL + `/api/Enrollment/${enrollmentId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: key, value: value }),
      credentials: 'include',
    }).catch(e => {
      console.error('Error updating enrollment key');
    });

    if (response && !response.ok) {
      const errorText = await response.text();
      console.error('Unsuccessful response updating enrollment key:', errorText);
    } else {
      if (response) {
        const data: EnrollmentInfo = await response.json();
        return data;
      }
    }
  }
}

export async function GetDisclosuresForEnrollment(): Promise<DisclosureInfo | undefined> {
  const enrollmentCookie = await GetCookie('enrollment');
  if (!enrollmentCookie) {
    throw new Error('Enrollment Cookie not found');
  }

  let disclosureInfo: DisclosureInfo[] | undefined = undefined;
  await fetch(process.env.API_BASE_URL + `/api/Enrollment/${Number(enrollmentCookie.value)}/Disclosure`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      if (data.isSuccess) {
        disclosureInfo = data.data;
      }
    });

  return disclosureInfo;
}

export async function GetDisclosureDocument(disclosureId: number | undefined): Promise<DisclosureFile | undefined> {
  const response = await fetch(process.env.API_BASE_URL + `/api/Enrollment/Disclosure/${disclosureId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    console.error('Error loading disclosure');
  }

  const data = await response.json();
  const ret: DisclosureFile = data.data;

  return ret;
}

export async function ResumeApplicantForm(formData: ApplicantInfoFormValues) {
  const enrollment = await GetEnrollment();
  if (!enrollment) {
    throw new Error('No enrollment found');
  }

  return await ApplicantFormHandler({ currentApplicant: enrollment.data.applicantDetails?.[0] }, formData);
}
