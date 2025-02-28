'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, Container } from '@mui/material';
import { GetEnrollment, InitializeApplicant, UpdateEnrollmentKeyValue } from '@/app/_utils/enrollmentUtils';
import { ApplicantTypeEnum, EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';
import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Grid2';
import { updateLastCompletedStep } from '@/app/_utils/lastCompletedStepUtils';

interface Props {
  initializeJointApplicant: () => Promise<void>;
}

export default function SelectJointApplication({ initializeJointApplicant }: Props) {
  const [hasJointApplicant, setHasJointApplicant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const content = {
    title: 'Choose your application type',
    question: 'Will you have a joint applicant?',
    yesText: 'Yes, I will have a joint applicant',
    noText: 'No, I am the only applicant',
    confirmButton: 'Confirm and Continue',
    changeButton: 'Change Selection',
  };

  const handleSelection = (choice: string) => {
    setHasJointApplicant(choice);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (hasJointApplicant === 'yes') {
        await UpdateEnrollmentKeyValue({ key: 'ApplicationType', value: ApplicantTypeEnum.Joint.toString() });
        // InitializeApplicant
        await initializeJointApplicant();
        const enrollment = await GetEnrollment();
        if (enrollment)
          await updateLastCompletedStep({
            currentPage: EnrollmentPageEnum.SelectJoint,
            lastCompletedStep: enrollment.data.lastCompletedStep,
            isJointApplication: true,
          });
        router.push('/SelectVerification');
      } else if (hasJointApplicant === 'no') {
        router.push('/Funding');
      }
    } catch (error) {
      console.error('Error during confirmation:', error);
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" className="mt-5">
      <Grid container spacing={3}>
        <Grid size={12}>
          <Typography variant="h4" align="center" gutterBottom>
            {content.question}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 8, md: 6 }} sx={{ margin: 'auto' }}>
          {hasJointApplicant === null ? (
            <Grid container spacing={2}>
              <Grid size={12}>
                <Button variant="contained" onClick={() => handleSelection('yes')} fullWidth>
                  {content.yesText}
                </Button>
              </Grid>
              <Grid size={12}>
                <Button variant="contained" onClick={() => handleSelection('no')} fullWidth>
                  {content.noText}
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant="body1" align="center" gutterBottom>
                  <strong>You selected:</strong> {hasJointApplicant === 'yes' ? content.yesText : content.noText}
                </Typography>
              </Grid>
              <Grid size={12}>
                <LoadingButton
                  variant="contained"
                  onClick={handleConfirm}
                  color="primary"
                  fullWidth
                  loading={isLoading}
                >
                  {content.confirmButton}
                </LoadingButton>
              </Grid>
              <Grid size={12}>
                <Button variant="outlined" onClick={() => setHasJointApplicant(null)} fullWidth disabled={isLoading}>
                  {content.changeButton}
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
