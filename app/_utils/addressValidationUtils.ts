'use server';

import { z } from 'zod';
import {
  AddressValidationAPIResponse,
  ValidateAddressResponse,
  AddressAction,
  ValidatedAddressResponse,
  ValidationError,
  AddressValidationResult,
  AddressValidationGranularity,
  AddressComponentTypeEnum,
  AddressComponent,
} from '../_types/AddressValidationType';
import { getAddressConfig } from '@/config';
import { Log } from './logUtils';
import { TransactionTypeEnum } from '../_types/EnrollmentInfo';

const addressSchema = z.object({
  address: z.string().min(1),
});

export async function validateAddress(formData: FormData): Promise<ValidateAddressResponse> {
  const parsedData = addressSchema.parse({
    address: formData.get('address'),
  });
  const addressType = formData.get('addressType') as 'physical' | 'mailing';

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;

  const requestBody = {
    address: { addressLines: [parsedData.address], regionCode: 'us' },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      await Log(
        TransactionTypeEnum.AddressValidation,
        JSON.stringify({
          request: requestBody,
          error: errorMessage,
        })
      );
      throw new Error(`HTTP error! status: ${errorMessage}`);
    }

    const data = await response.json();
    const result: AddressValidationResult = data.result;

    await Log(
      TransactionTypeEnum.AddressValidation,
      JSON.stringify({
        request: requestBody,
        response: data,
      })
    );

    // Verify it's a US address
    const isUsAddress = result.address.addressComponents.some(
      (component: AddressComponent) =>
        component.componentType === AddressComponentTypeEnum.COUNTRY &&
        component.componentName.text.toUpperCase() === 'USA'
    );

    if (!isUsAddress) {
      return { error: 'Only US addresses are supported' };
    }

    // Check if address is a PO Box using metadata
    const isPoBox = result.metadata?.poBox;

    // If it's a physical address and a PO Box, return error
    if (addressType === 'physical' && isPoBox) {
      return {
        error: 'Physical address cannot be a PO Box. Please enter your street address.',
      };
    }

    const validatedAddress: ValidatedAddressResponse = {
      action: determineAction(result, parsedData.address),
      validatedAddress: result.address,
      inputAddress: parsedData.address,
    };
    return validatedAddress;
  } catch (error: any) {
    console.error('Error validating address:', error);
    await Log(
      TransactionTypeEnum.AddressValidation,
      JSON.stringify({
        request: requestBody,
        error: error.message,
      })
    );
    return { error: 'Internal server error' };
  }
}

function determineAction(result: AddressValidationResult, inputAddress: string): AddressAction {
  const { verdict, uspsData } = result;
  const config = getAddressConfig();

  // Check if address would qualify for FIX
  const needsFix =
    !verdict.addressComplete ||
    verdict.validationGranularity === AddressValidationGranularity.OTHER ||
    (uspsData.dpvConfirmation && uspsData.dpvConfirmation === 'N') ||
    (uspsData.dpvConfirmation && uspsData.dpvConfirmation === 'D') ||
    !uspsData.dpvConfirmation;

  // If address needs fixing, either return FIX or log warning based on config
  if (needsFix) {
    if (config.enableFixValidation) {
      return AddressAction.FIX;
    } else {
      console.warn(
        `[ADDRESS VALIDATION WARNING] Address "${inputAddress}" has critical validation issues but FIX action was bypassed due to disabled validation.\n` +
          `Issues detected: ${[
            !verdict.addressComplete && 'Incomplete address',
            verdict.validationGranularity === AddressValidationGranularity.OTHER && 'Invalid granularity',
            uspsData.dpvConfirmation === 'N' && 'USPS DPV: No match',
            uspsData.dpvConfirmation === 'D' && 'USPS DPV: Default record match',
            !uspsData.dpvConfirmation && 'Missing USPS DPV confirmation',
          ]
            .filter(Boolean)
            .join(', ')}\n` +
          'Please ensure enableFixValidation is enabled for production environments to maintain compliance.'
      );
      // Continue to check for CONFIRM conditions
    }
  }

  const addressWithoutCountry = result.address.formattedAddress.replace(/, USA$/, '');
  // Check for less significant issues (CONFIRM)
  if (
    verdict.hasInferredComponents ||
    verdict.hasReplacedComponents ||
    (uspsData.dpvConfirmation && uspsData.dpvConfirmation === 'S') ||
    verdict.validationGranularity === AddressValidationGranularity.PREMISE_PROXIMITY ||
    verdict.validationGranularity === AddressValidationGranularity.ROUTE ||
    addressWithoutCountry !== inputAddress
  ) {
    return AddressAction.CONFIRM;
  }

  // If no issues, accept the address
  return AddressAction.ACCEPT;
}
