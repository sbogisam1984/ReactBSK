'use server';

import { redirect } from 'next/navigation';
import {
  ApplicantInfo,
  ApplicantTypeEnum,
  EnrollmentInfo,
  EnrollmentInfoData,
  TransactionTypeEnum,
  VerificationTypeEnum,
} from '../_types/EnrollmentInfo';
import { ScanDetails } from '../_types/ScanDetailType';
import { GetCookie, SetCookie } from './cookieUtils';
import { AddApplicantToEnrollment } from './enrollmentUtils';
import { Log } from './logUtils';

export async function HandleScanDocument(): Promise<ScanDetails | undefined> {
  let ret: ScanDetails | undefined;
  const enrollment = await GetCookie('enrollment');
  const applId = await GetCookie('applId');
  await fetch(
    process.env.NEXT_PUBLIC_API_BASE_URL + `/api/DigitalUnity/GetIDScanURL/${enrollment?.value}/${applId?.value}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  )
    .then(resp => {
      console.log(resp);
      return resp.json();
    })
    .then(data => {
      // ret = { queryId: data.id, idScanUrl: "https://localhost:3001/DigitalUnity" }
      ret = {
        queryId: data.id,
        applicantId: data.applicantId,
        idScanUrl: data.scanURL,
        isPrimary: data.isPrimary ? true : false,
      };
      console.log(ret);
    });

  return ret;
}

export async function HandleScanResult(scanDetails: ScanDetails | undefined) {
  let enrollmentInfo: EnrollmentInfoData | undefined;
  const enrollment = await GetCookie('enrollment');
  console.log('enrollmentvalue');
  if (enrollment) {
    await fetch(
      process.env.API_BASE_URL +
        `/api/DigitalUnity/GetIDScanResult/${enrollment.value}/${scanDetails?.queryId}/${scanDetails?.applicantId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then(resp => {
        console.log(resp);
        return resp.json();
      })
      .then(data => {
        enrollmentInfo = data;
      });

    if (
      enrollmentInfo &&
      enrollmentInfo.applicationType == ApplicantTypeEnum.Joint &&
      enrollmentInfo.applicantDetails?.length == 1
    ) {
      redirect('/ScanVerification');
    } else {
      redirect('/Applicant');
    }
  }
}

export async function verificationOptionHandler(
  enrollmentId: number,
  applicant: ApplicantInfo,
  transType: TransactionTypeEnum,
  verificationType: VerificationTypeEnum
) {
  await Log(transType, 'option');

  await AddApplicantToEnrollment(enrollmentId, {
    ...applicant,
    verificationType: verificationType,
  });

  if (applicant.id) {
    await SetCookie('applId', applicant.id.toString());
  }

  if (verificationType === VerificationTypeEnum.document) {
    redirect(`/ScanVerification`);
  } else {
    redirect('/Applicant');
  }
}

