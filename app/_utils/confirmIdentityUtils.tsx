'use server';

import { z } from 'zod';
import { IdentificationTypeEnum } from '../_types/IdentificationTypeEnum';
import { CitizenshipStatusEnum } from '../_types/EnrollmentInfo';

export interface ConfirmIdentityModel {
  CitizenshipStatus: CitizenshipStatusEnum;
  SSN: string;
  DOB: string;
  OccupationId: number;
  OccupationDetails?: string | null;
  HouseholdIncomeId?: number;
  IdentificationType: string;
  IdentificationNumber: string;
  StateIssued: string;
  CountryIssuedId?: number;
  IssueDate: string;
  ExpirationDate: string;
  IsApplicationScreeningAccepted: boolean;
  skipVerifications: string[];
}

const baseSchema = z.object({
  CitizenshipStatus: z.nativeEnum(CitizenshipStatusEnum),
  SSN: z.string().regex(/^\d{9}$/, 'SSN must be 9 digits'),
  DOB: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(date => {
      const dob = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      return age > 18 || (age === 18 && monthDiff >= 0);
    }, 'Applicant must be over 18 years old'),
  OccupationId: z.number().min(1, 'Occupation is required'),
  OccupationDetails: z.string().nullable(),
  HouseholdIncome: z.string().optional().nullable(),
  IdentificationType: z.enum([
    IdentificationTypeEnum.DriversLicense,
    IdentificationTypeEnum.StateIssuedId,
    IdentificationTypeEnum.MilitaryId,
    IdentificationTypeEnum.Passport,
  ]),
  IdentificationNumber: z.string(),
  IsApplicationScreeningAccepted: z.boolean(),
});

const driversLicenseSchema = z.object({
  IdentificationType: z.literal(IdentificationTypeEnum.DriversLicense),
  StateIssued: z.string(),
  IssueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(date => {
      const issueDate = new Date(date);
      const today = new Date();
      return issueDate < today;
    }, 'ID issue date must be in the past'),
  ExpirationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(date => {
      const expirationDate = new Date(date);
      const today = new Date();
      return expirationDate > today;
    }, 'ID expiration date must be in the future'),
});

const stateIssuedIdSchema = driversLicenseSchema.extend({
  IdentificationType: z.literal(IdentificationTypeEnum.StateIssuedId),
});

const militaryIdSchema = z.object({
  IdentificationType: z.literal(IdentificationTypeEnum.MilitaryId),
  ExpirationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(date => {
      const expirationDate = new Date(date);
      const today = new Date();
      return expirationDate > today;
    }, 'ID expiration date must be in the future'),
  CountryIssuedId: z.number(),
});

const passportSchema = z.object({
  IdentificationType: z.literal(IdentificationTypeEnum.Passport),
  IssueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(date => {
      const issueDate = new Date(date);
      const today = new Date();
      return issueDate < today;
    }, 'Passport issue date must be in the past'),
  ExpirationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(date => {
      const expirationDate = new Date(date);
      const today = new Date();
      return expirationDate > today;
    }, 'Passport expiration date must be in the future'),
  CountryIssuedId: z.number(),
});

const ConfirmIdentitySchema = z
  .discriminatedUnion('IdentificationType', [
    baseSchema.merge(driversLicenseSchema),
    baseSchema.merge(stateIssuedIdSchema),
    baseSchema.merge(militaryIdSchema),
    baseSchema.merge(passportSchema),
  ])
  .refine(
    data => {
      if (
        data.IdentificationType === IdentificationTypeEnum.DriversLicense ||
        data.IdentificationType === IdentificationTypeEnum.StateIssuedId ||
        data.IdentificationType === IdentificationTypeEnum.Passport
      ) {
        const issueDate = new Date(data.IssueDate);
        const expirationDate = new Date(data.ExpirationDate);
        return expirationDate > issueDate;
      }
      return true;
    },
    {
      message: 'ID expiration date must be after the issue date',
      path: ['ExpirationDate'],
    }
  );

export async function confirmIdentity(formData: FormData) {
  const citizenshipStatus = Number(formData.get('citizenshipStatus'));
  const ssn = (formData.get('ssn') as string).replace(/-/g, '');
  const dob = formData.get('dob') as string;
  const occupationId = Number(formData.get('occupationId'));
  const occupationDetails = formData.get('occupationDetails') as string;
  const householdIncomeId = Number(formData.get('householdIncome'));
  const identificationType = formData.get('identificationType') as string;
  const identificationNumber = formData.get('identificationNumber') as string;
  const issueDate = formData.get('issueDate') as string;
  const expirationDate = formData.get('expirationDate') as string;
  const stateIssued = formData.get('stateIssued') as string;
  const countryIssuedId = Number(formData.get('countryIssuedId'));
  const isApplicationScreeningAccepted = formData.get('isApplicationScreeningAccepted') === 'true';
  const enrollmentId = Number(formData.get('enrollmentId'));
  const applicantId = Number(formData.get('applicantId'));
  const verifications = formData.get('skipVerifications') as unknown as string[];

  const confirmIdentityModel: ConfirmIdentityModel = {
    CitizenshipStatus: citizenshipStatus,
    SSN: ssn,
    DOB: dob,
    OccupationId: occupationId,
    OccupationDetails: occupationDetails,
    HouseholdIncomeId: householdIncomeId,
    IdentificationType: identificationType,
    IdentificationNumber: identificationNumber,
    IsApplicationScreeningAccepted: isApplicationScreeningAccepted,
    ExpirationDate: expirationDate,
    IssueDate: issueDate,
    StateIssued: stateIssued,
    CountryIssuedId: countryIssuedId,
    skipVerifications: verifications,
  };

  try {
    // Validate the data
    ConfirmIdentitySchema.parse(confirmIdentityModel);

    confirmIdentityModel.IdentificationType = confirmIdentityModel.IdentificationType.replace(/[' ]+/g, '');
    console.log('body', JSON.stringify(confirmIdentityModel));

    // [JL] Using server-side only env variable
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/Enrollment/${enrollmentId}/Applicant/${applicantId}/Identification`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(confirmIdentityModel),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'An error occurred while confirming identity');
    }

    return response.status;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      throw new Error(`Invalid input data`);
    }
    console.error('Error confirming identity:', error);
    throw error;
  }
}

export async function fetchOccupations() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/Enrollment/Occupation`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch occupations');
    }

    const responseJson = await response.json();
    const occupations = responseJson.data;
    return occupations;
  } catch (error) {
    console.error('Error fetching occupations:', error);
    throw error;
  }
}

export async function fetchHouseholdIncomeRanges() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/Enrollment/HouseholdIncome`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch household income ranges');
    }

    const responseJson = await response.json();
    const incomeRanges = responseJson.data;
    return incomeRanges;
  } catch (error) {
    console.error('Error fetching household income ranges:', error);
    throw error;
  }
}

export async function fetchVerifications(verificationType: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/Enrollment/Verifications/${verificationType}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch verifications');
    }

    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error('Error fetching verifications:', error);
    throw error;
  }
}

export async function fetchAllowedCountries() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/Enrollment/AllowedCountry`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch allowed countries');
    }

    const countries = await response.json();
    return countries;
  } catch (error) {
    console.error('Error fetching allowed countries:', error);
    throw error;
  }
}
