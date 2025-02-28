'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import MobileStepper from '@mui/material/MobileStepper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { StepIndexes, stepItems } from '@/app/(OpenAccount)/StepIndexes';
import { EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';
import Typography from '@mui/material/Typography';

interface Props {
  currentPage: EnrollmentPageEnum;
}

const stepMapping: Record<EnrollmentPageEnum, number> = {
  [EnrollmentPageEnum.Home]: StepIndexes.Products,
  [EnrollmentPageEnum.GettingStarted]: StepIndexes.Products,
  [EnrollmentPageEnum.ProductMenu]: StepIndexes.Products,
  [EnrollmentPageEnum.Products]: StepIndexes.Products,
  [EnrollmentPageEnum.SelectVerification]: StepIndexes.ApplicantInfo,
  [EnrollmentPageEnum.ScanVerification]: StepIndexes.ApplicantInfo,
  [EnrollmentPageEnum.ApplicantInfo]: StepIndexes.ApplicantInfo,
  [EnrollmentPageEnum.ConfirmIdentity]: StepIndexes.ApplicantInfo,
  [EnrollmentPageEnum.KYCQuestions]: StepIndexes.ApplicantInfo,
  [EnrollmentPageEnum.KBAQuestions]: StepIndexes.ApplicantInfo,
  [EnrollmentPageEnum.SelectJoint]: StepIndexes.ApplicantInfo,
  [EnrollmentPageEnum.Funding]: StepIndexes.Funding,
  [EnrollmentPageEnum.Disclosures]: StepIndexes.Disclosures,
  [EnrollmentPageEnum.Decision]: StepIndexes.Disclosures, // [JL] This might need to be changed
};

const DesktopStepper = ({ currentPage }: Props) => {
  const activeStep = stepMapping[currentPage];
  const isDecisionStep = currentPage === EnrollmentPageEnum.Decision;

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        bottom: '-30px',
        '& .MuiStepConnector-line': {
          position: 'relative',
          top: '2.75px',
          borderTopWidth: '1px',
          borderColor: 'black',
        },
        '& .MuiStepConnector-root': {
          left: 'calc(-50%)',
          right: 'calc(50%)',
        },
        '& .MuiStepLabel-label': {
          marginTop: '-56px !important',
          color: 'black !important',
          fontSize: '.75rem',
        },
        '& .MuiStepLabel-iconContainer': {
          borderRadius: '50%',
          padding: '4px',
          position: 'relative',
          zIndex: 2,
        },
        '& circle': {
          fill: 'white',
          stroke: '#ebebeb',
          strokeWidth: '1.2',
          r: '11.5',
        },
        '& .MuiStepIcon-text': {
          fill: 'black',
          fontFamily: 'inherit',
        },
        '& .MuiStepConnector-root.Mui-disabled .MuiStepConnector-line': {
          display: 'none',
        },
        '& .MuiSvgIcon-root.Mui-completed': {
          background: 'white',
          borderRadius: '50%',
        },
        '& .MuiSvgIcon-root.Mui-completed path': {
          fill: '#cb4a20',
          stroke: 'white',
          strokeWidth: '.5',
        },
        '& .MuiSvgIcon-root.Mui-active circle': {
          stroke: '#cb4a20',
        },
      }}
    >
      <Stepper activeStep={activeStep} alternativeLabel>
        {stepItems.map(({ title }, index) => (
          <Step completed={index < activeStep || (isDecisionStep && index === activeStep)} key={title}>
            <StepLabel>{title}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

const CompactStepper = ({ currentPage }: Props) => {
  const activeStep = stepMapping[currentPage];
  const totalSteps = stepItems.length;

  return (
    <Box sx={{ width: '100%', padding: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body2">{`STEP ${activeStep + 1}: ${stepItems[activeStep].title}`}</Typography>
      </Box>
      <MobileStepper
        variant="dots"
        steps={totalSteps}
        position="static"
        activeStep={activeStep}
        sx={{
          backgroundColor: 'transparent',
          '& .MuiMobileStepper-dots': {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          },
          '& .MuiMobileStepper-dot': {
            backgroundColor: 'white',
            margin: '0 2px',
            border: '1px solid gray',
          },
          '& .MuiMobileStepper-dot.MuiMobileStepper-dotActive': {
            backgroundColor: 'white',
            border: '1px solid #cb4a20',
          },
          [`& .MuiMobileStepper-dot:nth-child(-n+${activeStep})`]: {
            backgroundColor: '#cb4a20',
            border: '1px solid #cb4a20',
          },
        }}
        nextButton={null}
        backButton={null}
      />
    </Box>
  );
};

export default function ResponsiveWizard(props: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return isMobile ? <CompactStepper {...props} /> : <DesktopStepper {...props} />;
}
