'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, FormControlLabel, TextField, Grid2 as Grid, Alert } from '@mui/material';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  AddApplicantResponse,
  ApplicantInfo,
  ApplicantTypeEnum,
  TransactionTypeEnum,
} from '../../../../_types/EnrollmentInfo';
import AddressAutocomplete from '@/app/_components/AddressAutocomplete/AddressAutocomplete';
import { getStateAbbreviation } from '@/app/_types/StateEnum';
import StateDropdown from '@/app/_components/StateDropdown/stateDropdown';
import { formatPhoneNumber } from '@/app/_utils/formattingUtils';
import { LoadingButton } from '@mui/lab';
import { validateAddress } from '@/app/_utils/addressValidationUtils';
import {
  AddressAction,
  AddressComponent,
  AddressComponentTypeEnum,
  AddressValidationState,
} from '@/app/_types/AddressValidationType';
import AddressCorrectionModal, { AddressSelections } from '../AddressCorrectionModal';
import ZipCodeInput from '@/app/_components/ZipCodeInput/ZipCodeInput';
import { Log } from '@/app/_utils/logUtils';

export interface ApplicantInfoFormValues {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phone: string;
  physicalAddress: string;
  physicalZip: string;
  physicalCity: string;
  physicalState: string;
  usePhysicalAddress: boolean;
  mailingAddress: string;
  mailingZip: string;
  mailingCity: string;
  mailingState: string;
  applicantType: ApplicantTypeEnum;
  skipZipValidation?: boolean;
  usePrimaryAddressForJoint?: boolean;
}

type AddressPrefix = 'physical' | 'mailing';

interface ApplicantInfoProps {
  enrollmentZipCode: string | undefined;
  currentApplicant: ApplicantInfo | undefined;
  action: (
    prevData:
      | {
          currentApplicant?: Partial<ApplicantInfo>;
        }
      | undefined,
    formData: ApplicantInfoFormValues
  ) => Promise<AddApplicantResponse | undefined>;
  applicationType: ApplicantTypeEnum;
  primaryApplicant?: ApplicantInfo;
}

const ApplicationInfo = ({ currentApplicant, action, enrollmentZipCode, primaryApplicant }: ApplicantInfoProps) => {
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usePrimaryAddress, setUsePrimaryAddress] = useState(currentApplicant?.usePrimaryAddressForJoint || false);
  const [addressValidationState, setAddressValidationState] = useState<AddressValidationState>({});
  const defaultValues = useMemo(
    () => ({
      firstName: currentApplicant?.firstName || '',
      lastName: currentApplicant?.lastName || '',
      emailAddress: currentApplicant?.email || '',
      phone: currentApplicant?.phone || '',
      physicalAddress: currentApplicant?.address?.streetName || '',
      physicalCity: currentApplicant?.address?.city || '',
      physicalState: getStateAbbreviation(currentApplicant?.address?.state) || '',
      physicalZip: currentApplicant?.address?.zipCode || enrollmentZipCode || '',
      mailingAddress: currentApplicant?.mailingAddress?.streetName || '',
      mailingCity: currentApplicant?.mailingAddress?.city || '',
      mailingState: getStateAbbreviation(currentApplicant?.mailingAddress?.state) || '',
      mailingZip: currentApplicant?.mailingAddress?.zipCode || '',
      applicantType: currentApplicant?.applicantType,
      usePhysicalAddress: currentApplicant?.address?.streetName === currentApplicant?.mailingAddress?.streetName,
      skipZipValidation: false,
      usePrimaryAddressForJoint: currentApplicant?.usePrimaryAddressForJoint || false,
    }),
    [currentApplicant, enrollmentZipCode]
  );

  const methods = useForm<ApplicantInfoFormValues>({
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control,
    watch,
    setValue,
    clearErrors,
    setError,
    reset,
    getValues,
  } = methods;

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleFormSubmit = async (formData: ApplicantInfoFormValues) => {
    setSubmissionError(null);
    clearErrors();
    setIsLoading(true);

    try {
      const submissionData = { ...formData };
      if (submissionData.usePhysicalAddress) {
        submissionData.mailingAddress = submissionData.physicalAddress;
        submissionData.mailingCity = submissionData.physicalCity;
        submissionData.mailingState = submissionData.physicalState;
        submissionData.mailingZip = submissionData.physicalZip;
      }

      const validationState = await validateAddresses(submissionData);

      // If we have addresses to validate, show modal
      if (Object.keys(validationState).length > 0) {
        setAddressValidationState(validationState);
        setIsModalOpen(true);
        return;
      }

      // If we get here and have no validation state, proceed with submission
      await submitForm(submissionData);
    } catch (error: unknown) {
      console.error('Form submission error:', error);
      // Don't set submission error for PO Box errors since we're showing field error
      if (typeof error === 'string' && !error.includes('PO Box')) {
        setSubmissionError('An unexpected error occurred. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const submitForm = async (formData: ApplicantInfoFormValues) => {
    try {
      const response = await action({ currentApplicant }, formData);
      if (response?.applicantEnrollment?.errorMessage) {
        setSubmissionError(response.applicantEnrollment.errorMessage);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmissionError('An unexpected error occurred. Please try again.');
    }
  };

  const validateAddresses = async (formData: ApplicantInfoFormValues): Promise<AddressValidationState> => {
    const validationState: AddressValidationState = {};

    // Validate physical address
    const physicalAddressFormData = new FormData();
    const physicalAddressString = `${formData.physicalAddress}, ${formData.physicalCity}, ${formData.physicalState} ${formData.physicalZip}`;
    physicalAddressFormData.append('address', physicalAddressString);
    physicalAddressFormData.append('addressType', 'physical');

    await Log(TransactionTypeEnum.AddressValidation, 'Validating physical address');
    const physicalAddressValidation = await validateAddress(physicalAddressFormData);

    if ('error' in physicalAddressValidation) {
      // Set error and wait for it to be reflected
      await new Promise<void>(resolve => {
        setError('physicalAddress', {
          type: 'manual',
          message: physicalAddressValidation.error,
        });
        resolve();
      });
      return Promise.reject(physicalAddressValidation.error);
    }

    if (physicalAddressValidation.action !== AddressAction.ACCEPT) {
      validationState.physical = {
        originalAddress: {
          address: formData.physicalAddress,
          city: formData.physicalCity,
          state: formData.physicalState,
          zip: formData.physicalZip,
        },
        validatedAddress: physicalAddressValidation.validatedAddress,
        action: physicalAddressValidation.action,
      };
    }

    // Validate mailing address if different from physical
    if (!formData.usePhysicalAddress) {
      const mailingAddressFormData = new FormData();
      const mailingAddressString = `${formData.mailingAddress}, ${formData.mailingCity}, ${formData.mailingState} ${formData.mailingZip}`;
      mailingAddressFormData.append('address', mailingAddressString);
      mailingAddressFormData.append('addressType', 'mailing');

      await Log(TransactionTypeEnum.AddressValidation, 'Validating mailing address');
      const mailingAddressValidation = await validateAddress(mailingAddressFormData);

      if ('error' in mailingAddressValidation) {
        // Set error and wait for it to be reflected
        await new Promise<void>(resolve => {
          setError('mailingAddress', {
            type: 'manual',
            message: mailingAddressValidation.error,
          });
          resolve();
        });
        return Promise.reject(mailingAddressValidation.error);
      }
      if (mailingAddressValidation.action !== AddressAction.ACCEPT) {
        validationState.mailing = {
          originalAddress: {
            address: formData.mailingAddress,
            city: formData.mailingCity,
            state: formData.mailingState,
            zip: formData.mailingZip,
          },
          validatedAddress: mailingAddressValidation.validatedAddress,
          action: mailingAddressValidation.action,
        };
      }
    }

    return validationState;
  };

  const handleAddressSelect =
    (prefix: AddressPrefix) => (address: { streetAddress: string; city: string; state: string; zip: string }) => {
      const updateFields: Partial<Record<keyof ApplicantInfoFormValues, string>> = {
        [`${prefix}Address`]: address.streetAddress,
        [`${prefix}City`]: address.city,
        [`${prefix}State`]: getStateAbbreviation(address.state), // Convert to abbreviation
        [`${prefix}Zip`]: address.zip,
      };

      Object.entries(updateFields).forEach(([key, value]) => {
        setValue(key as keyof ApplicantInfoFormValues, value);
      });
    };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = async (selections: AddressSelections) => {
    // Update form values if validated addresses were selected
    if (selections.physical && !selections.physical.useOriginal && addressValidationState.physical) {
      const components = addressValidationState.physical.validatedAddress.addressComponents;
      updateAddressFields('physical', components);

      // If using physical address as mailing, update mailing fields too
      if (watch('usePhysicalAddress')) {
        updateAddressFields('mailing', components);
      }
    }

    if (selections.mailing && !selections.mailing.useOriginal && addressValidationState.mailing) {
      const components = addressValidationState.mailing.validatedAddress.addressComponents;
      updateAddressFields('mailing', components);
    }

    setIsModalOpen(false);

    // Get the current form values after updates
    const updatedFormData = getValues();

    // Ensure mailing address matches physical if usePhysicalAddress is true
    if (updatedFormData.usePhysicalAddress) {
      updatedFormData.mailingAddress = updatedFormData.physicalAddress;
      updatedFormData.mailingCity = updatedFormData.physicalCity;
      updatedFormData.mailingState = updatedFormData.physicalState;
      updatedFormData.mailingZip = updatedFormData.physicalZip;
    }

    // Submit directly without triggering validation again
    await submitForm(updatedFormData);
  };

  const updateAddressFields = (prefix: 'physical' | 'mailing', components: AddressComponent[]) => {
    const poBoxComponent = components.find(c => c.componentType === AddressComponentTypeEnum.POST_BOX);

    if (poBoxComponent) {
      // If it's a PO Box, use that as the street address
      setValue(`${prefix}Address`, poBoxComponent.componentName.text);
    } else {
      // Otherwise use normal street address components
      const streetNumber =
        components.find(c => c.componentType === AddressComponentTypeEnum.STREET_NUMBER)?.componentName.text || '';
      const route = components.find(c => c.componentType === AddressComponentTypeEnum.ROUTE)?.componentName.text || '';
      const subPremise =
        components.find(c => c.componentType === AddressComponentTypeEnum.SUBPREMISE)?.componentName.text || '';

      // Include sub-premise in the street address if present
      const streetAddress = [`${streetNumber} ${route}`.trim(), subPremise ? `${subPremise}` : '']
        .filter(Boolean)
        .join(', ');

      setValue(`${prefix}Address`, streetAddress);
    }

    // Set other address components as normal
    const city = components.find(c => c.componentType === AddressComponentTypeEnum.LOCALITY)?.componentName.text || '';
    const state =
      components.find(c => c.componentType === AddressComponentTypeEnum.ADMINISTRATIVE_AREA_LEVEL_1)?.componentName
        .text || '';
    const zip =
      components.find(c => c.componentType === AddressComponentTypeEnum.POSTAL_CODE)?.componentName.text || '';
    const zipSuffix = components.find(c => c.componentType === AddressComponentTypeEnum.POSTAL_CODE_SUFFIX)
      ?.componentName.text;

    setValue(`${prefix}City`, city);
    setValue(`${prefix}State`, state);
    setValue(`${prefix}Zip`, zipSuffix ? `${zip}-${zipSuffix}` : zip);
  };

  const handleUsePrimaryAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setUsePrimaryAddress(checked);
    setValue('usePrimaryAddressForJoint', checked);

    if (checked && primaryApplicant) {
      // Update physical address
      setValue('physicalAddress', primaryApplicant.address?.streetName || '');
      setValue('physicalCity', primaryApplicant.address?.city || '');
      setValue('physicalState', getStateAbbreviation(primaryApplicant.address?.state) || '');
      setValue('physicalZip', primaryApplicant.address?.zipCode || '');
      setValue('usePhysicalAddress', primaryApplicant.usePhysicalAddress || false);

      // Update mailing if different
      if (!primaryApplicant.usePhysicalAddress) {
        setValue('mailingAddress', primaryApplicant.mailingAddress?.streetName || '');
        setValue('mailingCity', primaryApplicant.mailingAddress?.city || '');
        setValue('mailingState', getStateAbbreviation(primaryApplicant.mailingAddress?.state) || '');
        setValue('mailingZip', primaryApplicant.mailingAddress?.zipCode || '');
      }
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4">
      <FormProvider {...methods}>
        <form className="mt-8" noValidate autoComplete="off" onSubmit={handleSubmit(handleFormSubmit)}>
          {submissionError && <div className="text-red-500 mb-4">{submissionError}</div>}

          <h2 className="text-2xl md:text-3xl mb-6">
            {currentApplicant?.applicantType === ApplicantTypeEnum.Joint ? 'Joint' : 'Primary'} Applicant Details
          </h2>

          <input type="hidden" {...register('applicantType')} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                id="firstName"
                required
                label="First name"
                variant="outlined"
                error={!!errors.firstName}
                helperText={errors?.firstName?.message || '\u00a0'}
                {...register('firstName', { required: 'First name is required' })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                id="lastName"
                required
                label="Last name"
                variant="outlined"
                error={!!errors.lastName}
                helperText={errors?.lastName?.message || '\u00a0'}
                {...register('lastName', { required: 'Last name is required' })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                id="emailAddress"
                label="Email address"
                required
                variant="outlined"
                error={!!errors.emailAddress}
                helperText={errors?.emailAddress?.message || '\u00a0'}
                {...register('emailAddress', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email',
                  },
                })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: 'Phone number is required',
                  validate: value =>
                    value.replace(/\D/g, '').length === 10 || 'Please enter a valid 10-digit phone number',
                }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    id="phone"
                    label="Phone number"
                    variant="outlined"
                    required
                    error={!!errors.phone}
                    helperText={errors?.phone?.message || '\u00a0'}
                    value={formatPhoneNumber(field.value)}
                    onChange={e => field.onChange(e.target.value.replace(/\D/g, ''))}
                    slotProps={{
                      htmlInput: {
                        maxLength: 14,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {currentApplicant?.applicantType === ApplicantTypeEnum.Joint && primaryApplicant && (
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={<Checkbox checked={usePrimaryAddress} onChange={handleUsePrimaryAddress} />}
                  label="Use primary applicant's address"
                />
              </Grid>
            )}

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="physicalAddress"
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <AddressAutocomplete
                    onSelect={handleAddressSelect('physical')}
                    placeholder="Enter address"
                    required
                    value={value}
                    onChange={newValue => onChange(newValue)}
                    error={!!error}
                    helperText={error?.message || '\u00a0'}
                    disabled={usePrimaryAddress}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ZipCodeInput
                control={control}
                name="physicalZip"
                label="ZIP code"
                required
                variant="outlined"
                fullWidth
                disabled={usePrimaryAddress}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                id="physicalCity"
                label="City"
                required
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: !!watch('physicalCity'),
                  },
                }}
                error={!!errors.physicalCity}
                helperText={errors?.physicalCity?.message || '\u00a0'}
                disabled={usePrimaryAddress}
                {...register('physicalCity', { required: 'City is required' })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="physicalState"
                control={control}
                rules={{ required: 'State is required' }}
                render={({ field }) => (
                  <StateDropdown
                    {...field}
                    label="State"
                    error={!!errors.physicalState}
                    helperText={errors.physicalState?.message || '\u00a0'}
                    required
                    disabled={usePrimaryAddress}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="usePhysicalAddress"
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Mailing address is the same as physical address"
                    disabled={usePrimaryAddress}
                  />
                )}
              />
            </Grid>

            {!watch('usePhysicalAddress') && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="mailingAddress"
                    control={control}
                    rules={{ required: 'Mailing address is required' }}
                    render={({ field }) => (
                      <AddressAutocomplete
                        onSelect={handleAddressSelect('mailing')}
                        placeholder="Enter mailing address"
                        value={field.value}
                        onChange={value => field.onChange(value)}
                        error={!!errors.mailingAddress}
                        helperText={errors.mailingAddress?.message || '\u00a0'}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ZipCodeInput
                    control={control}
                    name="mailingZip"
                    label="ZIP code"
                    required
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    id="mailingCity"
                    label="City"
                    required
                    variant="outlined"
                    error={!!errors.mailingCity}
                    helperText={errors?.mailingCity?.message || '\u00a0'}
                    slotProps={{
                      inputLabel: {
                        shrink: !!watch('mailingCity'),
                      },
                    }}
                    {...register('mailingCity', { required: 'City is required' })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="mailingState"
                    control={control}
                    rules={{ required: 'State is required' }}
                    render={({ field }) => (
                      <StateDropdown
                        {...field}
                        label="State"
                        error={!!errors.mailingState}
                        helperText={errors.mailingState?.message || '\u00a0'}
                        required
                      />
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>

          <Grid container justifyContent={'right'}>
            <Grid size={{ xs: 6 }}>
              <Alert severity="warning" className="mb-4">
                <FormControlLabel
                  control={<Checkbox {...register('skipZipValidation')} />}
                  label="Skip ZIP code validation (testing only)"
                />
              </Alert>
            </Grid>
          </Grid>

          <div className="flex justify-end mt-6">
            <LoadingButton
              loading={isLoading}
              disabled={!isValid}
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              Submit
            </LoadingButton>
          </div>
        </form>
      </FormProvider>

      <AddressCorrectionModal
        validationState={addressValidationState}
        open={isModalOpen}
        handleClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </section>
  );
};

export default ApplicationInfo;
