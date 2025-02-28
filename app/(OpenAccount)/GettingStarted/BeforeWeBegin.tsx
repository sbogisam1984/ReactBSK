'use client';
import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import CustomDivider from '@/app/_components/CustomDivider/CustomDivider';
import OpeningToday from '@/app/_components/OpeningToday/OpeningToday';
import OptionButton, { UserOption } from './OptionButton';
import { useRouter } from 'next/navigation';
import { Log } from '@/app/_utils/logUtils';
import { TransactionTypeEnum } from '@/app/_types/EnrollmentInfo';
import { UpdateEnrollmentKeyValue } from '@/app/_utils/enrollmentUtils';
import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import { SubmitHandler, useForm } from 'react-hook-form';
import { getZipCodeFromCoords } from '@/app/_utils/geolocationUtils';
import { LocationOn } from '@mui/icons-material';
import { validateZipCodeForProducts } from '@/app/_utils/zipCodeUtils';

interface ZipForm {
  zipCode: string;
}

export default function BeforeWeBegin() {
  const [selectedOption, setSelectedOption] = useState<UserOption>(UserOption.none);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
  } = useForm<ZipForm>({ mode: 'onChange' });
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleOptionChange = (option: UserOption) => {
    setSelectedOption(option === selectedOption ? UserOption.none : option);
  };

  const handleLogInClick = async () => {
    await Log(TransactionTypeEnum.ExistingCustomerLogin, 'existing customer');
    router.push('https://localhost:8080/api/auth/authGardenFi');
  };

  const handleGeolocation = () => {
    setIsLoading(true);
    setError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          try {
            const zipCode: string = await getZipCodeFromCoords(position.coords.latitude, position.coords.longitude);
            setValue('zipCode', zipCode, { shouldValidate: true });
            setIsLoading(false);
          } catch (error) {
            console.error('Error getting zip code:', error);
            setError('Failed to get zip code from location. Please enter manually.');
            setIsLoading(false);
          }
        },
        error => {
          console.error('Geolocation error:', error);
          setError('Unable to get location. Please enter zip code manually.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter zip code manually.');
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<ZipForm> = async data => {
    setIsLoading(true);
    try {
      await Log(TransactionTypeEnum.ZipCodeSearch, JSON.stringify({ zipCode: data.zipCode }));
      await UpdateEnrollmentKeyValue({ key: 'EnrollmentZipCode', value: data.zipCode });
      const zipCodeValidation = await validateZipCodeForProducts(data.zipCode);
      if (!zipCodeValidation.isValid) {
        router.push('/ZipError?redirect=GettingStarted');
      } else {
        router.push('/ProductMenu');
      }
    } catch (error) {
      console.error('Error submitting zip code:', error);
      setIsLoading(false);
    } finally {
    }
  };

  return (
    <Box>
      {/* <OpeningToday /> */}
      <Typography variant="h3" fontWeight={'light'} color={'primary'} gutterBottom>
        Before we begin, which best describes you?
      </Typography>
      <CustomDivider />
      <Box component="fieldset" sx={{ border: 'none', p: 0, m: 0 }}>
        <OptionButton
          value={UserOption.existing}
          label="Existing Community Bank Customer"
          subLabel="Sign in or enroll in online banking to apply."
          selectedOption={selectedOption}
          onSelect={handleOptionChange}
        />
        <OptionButton
          value={UserOption.new}
          label="New to Community Bank"
          subLabel="Apply for your first account here."
          selectedOption={selectedOption}
          onSelect={handleOptionChange}
        />

        {selectedOption === UserOption.new && (
          <Box sx={{ mt: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container>
                <Grid size={12}>
                  <Typography variant="body2" color="primary.main" gutterBottom>
                    Enter your zip code to find your local products and rates:
                  </Typography>
                </Grid>
                <Grid container spacing={2} size={{ sm: 8, lg: 6 }}>
                  <Grid size={7}>
                    <TextField
                      {...register('zipCode', {
                        required: 'Zip code is required',
                        pattern: {
                          value: /^\d{5}(-\d{4})?$/,
                          message: 'Invalid zip code format',
                        },
                      })}
                      variant="outlined"
                      placeholder="12345"
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.message}
                      slotProps={{
                        htmlInput: {
                          maxLength: '5',
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '40px',
                          padding: 0,
                        },
                        '& .MuiOutlinedInput-input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 100px #fff inset',
                          WebkitTextFillColor: '#000',
                          caretColor: '#000',
                          borderRadius: 'inherit',
                        },
                      }}
                    />
                    <Button
                      onClick={handleGeolocation}
                      disabled={isLoading}
                      startIcon={<LocationOn />}
                      variant="text"
                      sx={{
                        textTransform: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      Use current location
                    </Button>
                  </Grid>
                  <Grid size={5}>
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={!isValid || isSubmitting || isLoading}
                      loading={isLoading}
                    >
                      CONTINUE
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}
        {selectedOption === UserOption.existing && (
          <Box sx={{ mt: 3 }}>
            <Grid container rowSpacing={1}>
              <Grid size={12}>
                <Button variant="contained" onClick={handleLogInClick}>
                  Log in
                </Button>
              </Grid>
              <Grid size={12}>
                <Button href="https://my.cbna.com/enroll" variant="outlined">
                  Enroll in online banking
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}
