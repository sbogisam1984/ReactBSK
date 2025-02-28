'use server';

import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import {} from '../_types/Plaid';
import { GetCookie, SetCookie } from './cookieUtils';
import { redirect } from 'next/navigation';
import { ProductFunding } from '../_types/ProductType';

interface PlaidAccountDetails {
  AccountId: string;
  Mask: string;
  AccountName: string;
  AccountSubtype: string;
  AccountType?: string;
  VerificationStatus: string;
  InstitutionId: string | undefined;
  InstitutionName: string | undefined;
}

interface PlaidFudingDetails {
  enrollmentId: number;
  productFunding: ProductFunding[] | undefined;
  PlaidAccountDetails: PlaidAccountDetails;
  LinkSessionId: string;
  PublicToken: string;
}

export async function GetTransactions(details: string) {
  let enrollmentId: number = 0;

  console.log(`CreateEnrollment: ${details}`);
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
    });

  return { enrollmentId: enrollmentId };
}

export async function CreateLinkToken(): Promise<string | undefined> {
  console.log(`Create Link Token from Plaid`);
  const linkToken = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/PlaidLink`, {
    method: 'GET',
  });

  // redirect to error if unsuccessful post?
  if (linkToken.ok) {
    const link_token = await linkToken.json();
    console.log(link_token);
    return link_token;
  }

  return 'null';
}

export async function HandleOnSuccess(
  plaidMetaData: PlaidLinkOnSuccessMetadata,
  publicToken: string,
  productFunding: ProductFunding[] | undefined
) {
  const enrollmentCookie = await GetCookie('enrollment');
  const currentAccount = plaidMetaData.accounts[0];
  const currentInstitution = plaidMetaData.institution;
  const plaidAccountDetails: PlaidAccountDetails = {
    AccountId: currentAccount.id,
    Mask: currentAccount.mask,
    AccountName: currentAccount.name,
    AccountSubtype: currentAccount.subtype,
    AccountType: currentAccount.type,
    VerificationStatus: currentAccount.verification_status,
    InstitutionId: currentInstitution?.institution_id,
    InstitutionName: currentInstitution?.name,
  };

  const data: PlaidFudingDetails = {
    enrollmentId: Number(enrollmentCookie?.value),
    productFunding: productFunding,
    PlaidAccountDetails: plaidAccountDetails,
    LinkSessionId: plaidMetaData.link_session_id,
    PublicToken: publicToken,
  };

  //console.log(`CreateEnrollment: ${details}`);
  const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/PlaidLink`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    return errorData.detail;
  }

  redirect('/Disclosures');
}

export async function HandleOnExit(details: string) {
  let enrollmentId: number = 0;

  console.log(`CreateEnrollment: ${details}`);
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
    });

  return { enrollmentId: enrollmentId };
}
