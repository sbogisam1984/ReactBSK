'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  MenuItem,
  FormHelperText,
  InputAdornment,
  IconButton,
  Grid2 as Grid,
  Typography,
  Alert,
} from '@mui/material';
import { formatDateForInput, formatSSN } from '@/app/_utils/formattingUtils';
import { IdentificationTypeEnum, mapIdentificationType } from '@/app/_types/IdentificationTypeEnum';
import { theme } from '@/theme/theme';
import { Occupation } from '@/app/_types/OccupationType';
import { ApplicantInfo, ApplicantTypeEnum, CitizenshipStatusEnum, Country } from '@/app/_types/EnrollmentInfo';
import StateDropdown from '@/app/_components/StateDropdown/stateDropdown';
import { confirmIdentity } from '@/app/_utils/confirmIdentityUtils';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useVisibilityToggle } from '@/app/_hooks/useVisibilityToggle';
import { ProcessIdIQResult } from '@/app/_utils/enrollmentUtils';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { VerificationType } from '@/app/_types/VerificationType';
import { IdIQResult } from '../../../_types/IdIQResult';
import { HouseholdIncomeRange, mapFormattedIncomeToRangeId } from '@/app/_types/HouseholdIncomeType';

const CITIZENSHIP_STATUS_LABELS = {
  [CitizenshipStatusEnum.USCitizen]: 'U.S. Citizen',
  [CitizenshipStatusEnum.PermanentResident]: 'Permanent Resident',
  [CitizenshipStatusEnum.NonPermanentResident]: 'Non-Permanent Resident',
} as const;

interface FormValues {
  citizenshipStatus: CitizenshipStatusEnum | '';
  ssn: string;
  dob: string;
  occupationId: number | '';
  occupationDetails?: string;
  householdIncome?: string;
  identificationType: string;
  identificationNumber: string;
  stateIssued: string;
  countryIssuedId: number | '';
  issueDate: string;
  expirationDate: string;
  isApplicationScreeningAccepted: boolean;
  applicantId?: number;
  enrollmentId?: number;
  skipVerifications: string[];
}

interface Props {
  occupations: Occupation[];
  applicant: ApplicantInfo;
  enrollmentId: number;
  enrollmentZipCode: string;
  verifications: VerificationType[];
  householdIncomeRanges: HouseholdIncomeRange[];
  countries: Country[];
}

const ConfirmIdentity: React.FC<Props> = ({
  occupations,
  enrollmentId,
  applicant,
  verifications,
  householdIncomeRanges,
  countries,
}: Props) => {
  const [selectedIdType, setSelectedIdType] = useState<IdentificationTypeEnum | ''>(
    mapIdentificationType(applicant?.identificationDetails?.identificationType) || ''
  );
  const { isVisible: showSSN, toggleVisibility: toggleSSN } = useVisibilityToggle();
  const [verificationName, setverificationName] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ssn, setSSN] = useState<string>(applicant?.ssn || '');

  const workflowStepIds: string[] = [];

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    trigger,
    setValue,
    getValues,
    reset,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: {
      citizenshipStatus: applicant?.citizenshipStatus ?? '',
      ssn: applicant?.ssn || '',
      dob: applicant?.birthdate ? formatDateForInput(applicant.birthdate) : '',
      occupationId: applicant?.occupation?.occupationId || '',
      occupationDetails: applicant?.occupation?.occupationDetails || '',
      householdIncome: mapFormattedIncomeToRangeId(applicant?.householdIncome, householdIncomeRanges) || '',
      identificationType: mapIdentificationType(applicant?.identificationDetails?.identificationType) || '',
      identificationNumber: applicant?.identificationDetails?.identificationNumber || '',
      stateIssued: applicant?.identificationDetails?.stateIssued || '',
      countryIssuedId: applicant.identificationDetails?.countryIssued?.id || '',
      issueDate: applicant?.identificationDetails?.issueDate
        ? formatDateForInput(applicant.identificationDetails.issueDate)
        : '',
      expirationDate: applicant?.identificationDetails?.expirationDate
        ? formatDateForInput(applicant.identificationDetails.expirationDate)
        : '',
      isApplicationScreeningAccepted: false, // This should always start as false
    },
    mode: 'onBlur', // This will trigger validation on change
  });

  const watchOccupation = watch('occupationId') as number | '';

  const handleSSNChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const formattedSSN = formatSSN(event.target.value);
    setSSN(formattedSSN);
  };

  const occupationRequiresDetails = useCallback(
    (occupationId: number | '') => {
      const selectedOccupation = occupations.find(occ => occ.id === occupationId);
      return selectedOccupation?.requiresDetails || false;
    },
    [occupations]
  );

  const validateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      return 'Please enter a valid date';
    }

    if (birthDate > today) {
      return 'Date of Birth cannot be in the future';
    }

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (age < 18 || (age === 18 && monthDiff < 0)) {
      return 'Applicant must be at least 18 years old';
    }

    return true;
  };

  const validateIssueDate = (issueDate: string) => {
    const issueDateObj = new Date(issueDate);
    const today = new Date();
    if (issueDateObj >= today) {
      return 'ID issue date must be in the past';
    }
    return true;
  };

  const validateExpirationDate = (expirationDate: string) => {
    const expirationDateObj = new Date(expirationDate);
    const today = new Date();
    if (expirationDateObj <= today) {
      return 'ID expiration date must be in the future';
    }
    return true;
  };

  const validateDateOrder = (data: FormValues) => {
    const issueDate = new Date(data.issueDate);
    const expirationDate = new Date(data.expirationDate);
    if (expirationDate <= issueDate) {
      return 'ID expiration date must be after the issue date';
    }
    return true;
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    if (data.identificationType !== IdentificationTypeEnum.Passport) {
      const usCountry = countries.find(c => c.name === 'United States');
      if (usCountry) {
        data.countryIssuedId = usCountry.id;
      }
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    if (applicant?.id) {
      formData.append('applicantId', applicant.id.toString());
    }

    if (enrollmentId) {
      formData.append('enrollmentId', enrollmentId.toString());
    }

    try {
      verificationName.forEach(name => {
        const stepId: string = verifications.find(y => y.name == name)?.workflowStepId.toString() || '';
        workflowStepIds.push(stepId);
      });
      formData.append('skipVerifications', workflowStepIds.toLocaleString());

      // Handle successful submission (e.g., redirect)
      const response: number = await confirmIdentity(formData);

      const idIQResult: IdIQResult | undefined = await ProcessIdIQResult(applicant.id ?? undefined, workflowStepIds);
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleChange = (event: SelectChangeEvent<typeof verificationName>) => {
    const {
      target: { value },
    } = event;
    setverificationName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  useEffect(() => {
    if (applicant?.ssn) {
      setSSN(formatSSN(applicant.ssn));
    }
  }, [applicant]);

  useEffect(() => {
    if (applicant?.identificationDetails?.identificationType) {
      setSelectedIdType(mapIdentificationType(applicant.identificationDetails.identificationType));
    }
  }, [applicant]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'occupationId' && value.occupationId && !occupationRequiresDetails(value.occupationId)) {
        setValue('occupationDetails', '');
        clearErrors('occupationDetails');
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, clearErrors, occupationRequiresDetails]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleIdTypeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newType = event.target.value as IdentificationTypeEnum;
    setSelectedIdType(newType);

    // Reset the form fields for the identification section
    const fieldsToReset = {
      identificationNumber: '',
      expirationDate: '',
      issueDate: '',
      stateIssued: '',
      countryIssuedId: '' as const,
      identificationType: newType,
    };

    // Use reset to clear the fields while maintaining other form values
    reset(
      formValues => ({
        ...formValues,
        ...fieldsToReset,
      }),
      {
        keepDefaultValues: true,
        keepDirty: true,
        keepErrors: false,
      }
    );

    // Clear any existing errors
    clearErrors(['identificationNumber', 'expirationDate', 'issueDate', 'stateIssued', 'countryIssuedId']);
  };

  const renderIdFields = () => {
    return (
      <>
        {selectedIdType === IdentificationTypeEnum.DriversLicense ||
        selectedIdType === IdentificationTypeEnum.StateIssuedId ? (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="identificationNumber"
                control={control}
                rules={{ required: 'ID Number is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ID Number"
                    variant="outlined"
                    required
                    error={!!errors.identificationNumber}
                    helperText={errors?.identificationNumber?.message || '\u00a0'}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="stateIssued"
                control={control}
                rules={{ required: 'State Issued is required' }}
                render={({ field }) => (
                  <StateDropdown
                    {...field}
                    label="State Issued"
                    error={!!errors.stateIssued}
                    helperText={errors?.stateIssued?.message || '\u00a0'}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="issueDate"
                control={control}
                rules={{ required: 'Issue Date is required', validate: validateIssueDate }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Issue Date"
                    type="date"
                    variant="outlined"
                    required
                    error={!!errors.issueDate}
                    helperText={errors?.issueDate?.message || '\u00a0'}
                    fullWidth
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="expirationDate"
                control={control}
                rules={{
                  required: 'Expiration Date is required',
                  validate: (value, formValues) =>
                    validateExpirationDate(value) === true
                      ? validateDateOrder(formValues as FormValues)
                      : validateExpirationDate(value),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expiration Date"
                    type="date"
                    variant="outlined"
                    required
                    error={!!errors.expirationDate}
                    helperText={errors?.expirationDate?.message || '\u00a0'}
                    fullWidth
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        ) : selectedIdType === IdentificationTypeEnum.MilitaryId ? (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="identificationNumber"
                control={control}
                rules={{ required: 'ID Number is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ID Number"
                    variant="outlined"
                    required
                    error={!!errors.identificationNumber}
                    helperText={errors?.identificationNumber?.message || '\u00a0'}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="ID Country" variant="outlined" value="United States" disabled fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="expirationDate"
                control={control}
                rules={{
                  required: 'Expiration Date is required',
                  validate: validateExpirationDate,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expiration Date"
                    type="date"
                    variant="outlined"
                    required
                    error={!!errors.expirationDate}
                    helperText={errors?.expirationDate?.message || '\u00a0'}
                    fullWidth
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        ) : selectedIdType === IdentificationTypeEnum.Passport ? (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="identificationNumber"
                control={control}
                rules={{ required: 'Passport Number is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Passport Number"
                    variant="outlined"
                    required
                    error={!!errors.identificationNumber}
                    helperText={errors?.identificationNumber?.message || '\u00a0'}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="countryIssuedId"
                control={control}
                rules={{ required: 'Country is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Country"
                    variant="outlined"
                    required
                    error={!!errors.countryIssuedId}
                    helperText={errors?.countryIssuedId?.message || '\u00a0'}
                    fullWidth
                  >
                    {countries.map(country => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="issueDate"
                control={control}
                rules={{ required: 'Issue Date is required', validate: validateIssueDate }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Issue Date"
                    type="date"
                    variant="outlined"
                    required
                    error={!!errors.issueDate}
                    helperText={errors?.issueDate?.message || '\u00a0'}
                    fullWidth
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="expirationDate"
                control={control}
                rules={{
                  required: 'Expiration Date is required',
                  validate: (value, formValues) =>
                    validateExpirationDate(value) === true
                      ? validateDateOrder(formValues as FormValues)
                      : validateExpirationDate(value),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expiration Date"
                    type="date"
                    variant="outlined"
                    required
                    error={!!errors.expirationDate}
                    helperText={errors?.expirationDate?.message || '\u00a0'}
                    fullWidth
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        ) : null}
      </>
    );
  };

  return (
    <section>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1 },
        }}
        className="mt-8 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <section className="p-4 mb-4">
          <Typography variant="h2" sx={{ mb: 3 }}>
            Please Confirm {applicant?.applicantType === ApplicantTypeEnum.Primary ? 'Primary' : 'Joint'}{' '}
            Applicant&apos;s Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="ssn"
                control={control}
                defaultValue={applicant?.ssn || ''}
                rules={{
                  required: 'SSN is required',
                  pattern: {
                    value: /^\d{3}-?\d{2}-?\d{4}$/,
                    message: 'Please enter a valid SSN',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Social Security Number"
                    value={ssn}
                    onChange={e => {
                      handleSSNChange(e);
                      field.onChange(e);
                    }}
                    variant="outlined"
                    required
                    error={!!errors.ssn}
                    helperText={errors?.ssn?.message || '\u00a0'}
                    fullWidth
                    slotProps={{
                      htmlInput: { maxLength: 11 },
                      input: {
                        type: showSSN ? 'text' : 'password',
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle ssn visibility"
                              onClick={toggleSSN}
                              onMouseDown={e => e.preventDefault()}
                              onMouseUp={e => e.preventDefault()}
                              edge="end"
                            >
                              {showSSN ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="dob"
                control={control}
                defaultValue={formatDateForInput(applicant?.birthdate) || ''}
                rules={{ required: 'Date of Birth is required', validate: validateAge }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date of Birth"
                    type="date"
                    variant="outlined"
                    required
                    error={!!errors.dob}
                    helperText={errors?.dob?.message || '\u00a0'}
                    onChange={e => {
                      field.onChange(e);
                      if (!!errors.dob) {
                        trigger('dob');
                      }
                    }}
                    fullWidth
                    slotProps={{
                      htmlInput: { max: '9999-12-31' },
                      inputLabel: { shrink: true },
                    }}
                    onBlur={() => {
                      field.onBlur();
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="occupationId"
                control={control}
                defaultValue={applicant?.occupation?.occupationId || ''}
                rules={{ required: 'Occupation is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    select
                    label="Occupation"
                    variant="outlined"
                    required
                    error={!!errors.occupationId}
                    helperText={errors?.occupationId?.message || '\u00a0'}
                    value={value}
                    onChange={onChange}
                    fullWidth
                    slotProps={{
                      select: {
                        MenuProps: {
                          slotProps: {
                            paper: {
                              style: {
                                maxHeight: 200,
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select an occupation
                    </MenuItem>
                    {occupations.map(occupation => (
                      <MenuItem key={occupation.id} value={occupation.id}>
                        {occupation.occupationName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="occupationDetails"
                control={control}
                defaultValue={applicant?.occupation?.occupationDetails || ''}
                rules={{
                  required: occupationRequiresDetails(watchOccupation) ? 'Occupation details are required' : false,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Occupation Details"
                    variant="outlined"
                    required={occupationRequiresDetails(watchOccupation)}
                    disabled={!occupationRequiresDetails(watchOccupation)}
                    error={!!errors.occupationDetails}
                    helperText={
                      errors?.occupationDetails?.message ||
                      (occupationRequiresDetails(watchOccupation) ? '\u00a0' : 'Not required for this occupation')
                    }
                    fullWidth
                    sx={{
                      '& .MuiFormHelperText-root': {
                        position: 'static',
                        minHeight: '1.5em',
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="householdIncome"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    helperText={'\u00a0'}
                    label="Household Income (Optional)"
                    variant="outlined"
                    fullWidth
                    slotProps={{
                      select: {
                        MenuProps: {
                          slotProps: {
                            paper: {
                              style: {
                                maxHeight: 300,
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select income range
                    </MenuItem>
                    {householdIncomeRanges.map(range => (
                      <MenuItem key={range.id} value={range.id}>
                        {range.range}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="citizenshipStatus"
                control={control}
                rules={{ required: 'Citizenship status is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Citizenship Status"
                    variant="outlined"
                    required
                    error={!!errors.citizenshipStatus}
                    helperText={errors?.citizenshipStatus?.message || '\u00a0'}
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Please select
                    </MenuItem>
                    {Object.entries(CitizenshipStatusEnum)
                      .filter(([key]) => isNaN(Number(key))) // Filter out numeric keys
                      .map(([_, value]) => (
                        <MenuItem key={value} value={value}>
                          {CITIZENSHIP_STATUS_LABELS[value as CitizenshipStatusEnum]}
                        </MenuItem>
                      ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </section>

        <section className="p-4 mb-4">
          <Typography variant="h2" sx={{ mb: 3 }}>
            Identification Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="identificationType"
                control={control}
                rules={{ required: 'Identification Type is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Identification Type"
                    variant="outlined"
                    error={!!errors.identificationType}
                    helperText={errors?.identificationType?.message || '\u00a0'}
                    onChange={e => {
                      field.onChange(e);
                      handleIdTypeChange(e);
                    }}
                    fullWidth
                    slotProps={{
                      select: {
                        MenuProps: {
                          disableScrollLock: true,
                        },
                      },
                    }}
                  >
                    {Object.values(IdentificationTypeEnum).map(idType => (
                      <MenuItem value={idType} key={idType}>
                        {idType}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
          {renderIdFields()}
        </section>

        <section className=" p-4">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Controller
                    name="isApplicationScreeningAccepted"
                    control={control}
                    defaultValue={false}
                    rules={{ required: 'Authorization is required' }}
                    render={({ field }) => <Checkbox {...field} checked={field.value} />}
                  />
                }
                label="I authorize the bank to obtain reports and/or account information from credit or information service agencies. This is required to verify the information I provided in this application and to facilitate the processing of my account application."
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              {errors.isApplicationScreeningAccepted && (
                <FormHelperText style={{ color: theme.palette.error.main }}>
                  {errors.isApplicationScreeningAccepted.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </section>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid size={{ xs: 6 }} sx={{ mb: 2 }}>
            <Alert
              severity="warning"
              sx={{
                '& .MuiAlert-message': { width: '100%' },
                backgroundColor: '#fff3e0',
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Testing Controls
              </Typography>
              <FormControl sx={{ width: '100%', maxWidth: 400 }} error>
                <InputLabel id="multiple-checkbox-label">Skip Verifications</InputLabel>
                <Select
                  labelId="multiple-checkbox-label"
                  id="skipVerifications"
                  multiple
                  value={verificationName}
                  onChange={handleChange}
                  input={<OutlinedInput label="Skip Verifications" />}
                  renderValue={selected => selected.join(', ')}
                >
                  {verifications.map(verification => (
                    <MenuItem key={verification.workflowStepId} value={verification.name}>
                      <Checkbox checked={verificationName.includes(verification.name)} />
                      <ListItemText primary={verification.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Alert>
          </Grid>
          <Grid container size={6} alignItems={'center'} justifyContent={'end'}>
            <Grid>
              <LoadingButton loading={isLoading} disabled={!isValid} type="submit" variant="contained" color="primary">
                Submit
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </section>
  );
};

export default ConfirmIdentity;
