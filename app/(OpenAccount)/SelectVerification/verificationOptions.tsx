'use client';
import { Box, Button, Grid2 as Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  ApplicantInfo,
  ApplicantTypeEnum,
  EnrollmentInfo,
  TransactionTypeEnum,
  VerificationTypeEnum,
} from '@/app/_types/EnrollmentInfo';
import CustomDivider from '@/app/_components/CustomDivider/CustomDivider';
import { verificationOptionHandler } from '@/app/_utils/verificationUtils';
import { useState } from 'react';

interface Props {
  enrollment: EnrollmentInfo;
  currentApplicant: ApplicantInfo;
  isMobile: boolean;
}

export default function VerificationOptions({ enrollment, currentApplicant, isMobile }: Props) {
  const isJointApplicant = currentApplicant.applicantType === ApplicantTypeEnum.Joint;
  const scanRequirements = ["Driver's License", 'State Issued ID', 'Passport'];
  const manualRequirements = ['Name', 'Address, Email, Phone', 'Identification Details'];

  const [isDocumentLoading, setIsDocumentLoading] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);

  const handleClick = async (transactionType: TransactionTypeEnum, verificationType: VerificationTypeEnum) => {
    const isDocument = verificationType === VerificationTypeEnum.document;
    isDocument ? setIsDocumentLoading(true) : setIsManualLoading(true);

    try {
      await verificationOptionHandler(
        enrollment.data.enrollmentId,
        currentApplicant,
        transactionType,
        verificationType
      );
    } finally {
      isDocument ? setIsDocumentLoading(false) : setIsManualLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h2" color="primary">
        Verify your{isJointApplicant ? " joint applicant's" : ''} identity
        {!isMobile && ' two ways:'}
      </Typography>

      <CustomDivider />

      <Box>
        <Grid container spacing={2}>
          {/* Document Upload Section */}
          <Grid size={12}>
            <Grid container spacing={1} alignItems="center">
              <Grid>
                <LoadingButton
                  variant="contained"
                  onClick={() => handleClick(TransactionTypeEnum.DocumentVerification, VerificationTypeEnum.document)}
                  loading={isDocumentLoading}
                  disabled={isManualLoading}
                >
                  Mobile Document Upload
                </LoadingButton>
              </Grid>
              {!isMobile && (
                <Grid>
                  <Typography variant="subtitle1">(RECOMMENDED)</Typography>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid size={12}>
            <Typography>
              Use your mobile device to securely scan and upload one of the following approved government documents:
            </Typography>
            <List>
              {scanRequirements.map((req, index, arr) => (
                <ListItem disablePadding key={index}>
                  <ListItemText>
                    {index + 1}. {req} {index !== arr.length - 1 && 'OR'}
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Manual Entry Section - Only show on non-mobile devices */}
          {!isMobile && (
            <>
              <Grid size={12}>
                <Grid container spacing={1} alignItems="center">
                  <Grid>
                    <LoadingButton
                      variant="outlined"
                      onClick={() => handleClick(TransactionTypeEnum.ManualVerification, VerificationTypeEnum.manual)}
                      loading={isManualLoading}
                      disabled={isDocumentLoading}
                    >
                      Manual Data Entry
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={12}>
                <Typography variant="body1">Manually enter the following information:</Typography>
                <List>
                  {manualRequirements.map((req, index) => (
                    <ListItem disablePadding key={index}>
                      <ListItemText>
                        {index + 1}. {req}
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
