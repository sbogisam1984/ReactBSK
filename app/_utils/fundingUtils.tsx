'use server';
import { z } from 'zod';
import { GetCookie } from './cookieUtils';
import { ProductFunding } from '../_types/ProductType';
import { redirect } from 'next/navigation';
import { FundingTypeEnum } from '../_types/EnrollmentInfo';
import { CreditCardFormValues } from '../(OpenAccount)/Funding/components/creditCardForm';

const ExternalTransferSchema = z.object({
  RoutingNumber: z.string().regex(/^\d{9}$/, 'Invalid routing number'),
  AccountNumber: z.string().regex(/^\d{9,10}$/, 'Invalid account number'),
  AccountType: z.string().optional(),
  NameOnAccount: z.string(),
  BankName: z.string(),
  BankState: z.string(),
});

const CreditCardSchema = z.object({
  NameOnCard: z.string(),
  CreditCardNumber: z.string().regex(/^\d{16}$/, 'Invalid credit card number'),
  // ExpirationDate: z.string().regex(/^["01", "1", "02", "2", "03", "3", "04", "4", "05", "5", "06", "6", "07", "7", "08", "8", "09", "9", "10", "11", "12"]\/["2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034"]$/, "Date must be in mm-yyyy format"),
  ExpirationDate: z
    .string()
    .regex(
      /^(01|1|02|2|03|3|04|4|05|5|06|6|07|7|08|8|09|9|10|11|12)\/(2024|2025|2026|2027|2028|2029|2030|2031|2032|2033|2034")$/,
      'Date must be in mm-yyyy format'
    ),
  CVV: z.string().regex(/^\d{3}$/, 'Invalid CVV'),
});

interface ExternalTransfer {
  RoutingNumber: string;
  AccountNumber: string;
  AccountType: string;
  BankName?: string;
  BankState?: string;
  NameOnAccount?: string;
}

interface CreditCard {
  NameOnCard: string;
  CreditCardNumber: string;
  ExpirationDate: string;
  CVV: string;
  CreditCardType?: string;
}

interface FundingDetails {
  FundingType: FundingTypeEnum;
  ExternalTransfer?: ExternalTransfer;
  CreditCard?: CreditCard;
  ProductFunding?: ProductFunding[];
}

interface ValidationState {
  isValid: boolean;
  errors?: string[];
}

type FormState =
  | {
      isValid: false;
      errors: string[] | undefined;
    }
  | {
      isValid: true;
      errors: string;
    }
  | undefined;

async function ValidateFundingAmounts(fundingAmounts: ProductFunding[]): Promise<ValidationState> {
  let isValid: boolean = true;
  const errors: string[] = [];

  for (let i = 0; i < fundingAmounts.length; i++) {
    if (fundingAmounts[i].fundingAmount < 50) {
      isValid = false;
      errors.push('Invalid funding amount');
    }
  }

  return { isValid: isValid, errors: errors };
}

export async function CreditCardFormHandler(prevState: FormState, formData: CreditCardFormValues) {
  const nameOnCard = formData.nameOnCard;
  const creditCardNumber = formData.creditCardNumber;
  const expirationDate = formData.expirationDate;
  const CVV = formData.CVV;

  const data: CreditCard = {
    NameOnCard: nameOnCard,
    CreditCardNumber: creditCardNumber,
    ExpirationDate: expirationDate,
    CVV: CVV,
  };

  const fundingValidation = await ValidateFundingAmounts(formData.fundingAmounts);
  if (!fundingValidation.isValid) {
    return { isValid: fundingValidation.isValid, errors: fundingValidation.errors };
  }

  try {
    CreditCardSchema.parse(data);

    const body: FundingDetails = {
      FundingType: FundingTypeEnum.CreditCard,
      CreditCard: data,
      ProductFunding: formData.fundingAmounts,
    };

    const enrollmentCookie = await GetCookie('enrollment');
    if (enrollmentCookie) {
      const enrollmentId = enrollmentCookie.value;

      const response = await fetch(`${process.env.API_BASE_URL}/api/Enrollment/${enrollmentId}/Funding`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred while posting funding details');
      }

      redirect('/Disclosures');
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return { isValid: fundingValidation.isValid, errors: error.issues.map(x => x.message).join() };
    }
    console.error('Credit card funding error:', error);
    throw error;
  }
}
