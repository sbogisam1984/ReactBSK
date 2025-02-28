'use client';

import React, { useState, useMemo } from 'react';
import { ApplicantInfo, ApplicantKBAAnswers, ApplicantQuestions, ApplicantTypeEnum, KBARequest } from '@/app/_types/EnrollmentInfo';
import { Typography, Box, Alert, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import KBARadioButtons from '@/app/(OpenAccount)/KBAQuestions/components/KBARadioButtons';
import { ProcessLiveQResult, SubmitKBA } from '@/app/_utils/enrollmentUtils';
import { IdIQResult } from '../../../_types/IdIQResult';

interface Answer {
  questionId: number;
  answer: string;
  applicantId: number | undefined;
}

interface Props {
  questions: ApplicantQuestions[] | undefined;
  enrollmentId: number | undefined;
  applicant: ApplicantInfo | undefined;
  applicationType: ApplicantTypeEnum | undefined;
  enrollmentZipCode: string | undefined;
}

type FormValues = {
  [key: `answers_${number}`]: string;
};

const KBAQuestions: React.FC<Props> = ({ questions, enrollmentId, applicant }: Props) => {
  const [answers, setAnswers] = useState<Map<number, Answer>>(new Map());

  // Initialize default values from questions
  const defaultValues = useMemo(() => {
    const values: FormValues = {};
    questions?.forEach(question => {
      values[`answers_${question.id}`] = '';
    });
    return values;
  }, [questions]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid, isDirty, isSubmitSuccessful },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
  });

  const isFormComplete = questions?.length === answers.size;

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev =>
      new Map(prev).set(questionId, {
        questionId,
        answer,
        applicantId: applicant?.id ?? undefined,
      })
    );
  };

  const onSubmit = async (data: any) => {
    try {
      const kbaRequests: KBARequest[] = Array.from(answers.values()).map(answer => ({
        id: answer.questionId,
        answer: answer.answer,
        applicantId: answer.applicantId,
        enrollmentId: enrollmentId,
      }));

      const kbaResult: ApplicantKBAAnswers | undefined = await SubmitKBA(enrollmentId, applicant?.id, kbaRequests);

      if (kbaResult !== undefined) {
        const liveQResult: IdIQResult | undefined = await ProcessLiveQResult(applicant?.id ?? undefined);
      }
    } catch (err) {
      console.error('Error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Identity Verification Questions
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ mb: 3 }}>
        Please answer the following questions to verify your identity. These questions are based on your credit history
        and other public records.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        {applicant?.firstName} {applicant?.lastName}
      </Typography>

      {isSubmitting && (
        <Alert icon={<CircularProgress size={20} />} severity="info">
          Submitting your answers...
        </Alert>
      )}

      {!isValid && isDirty && <Alert severity="warning">Please complete all required fields</Alert>}

      {isSubmitSuccessful && <Alert severity="success">Answers submitted successfully!</Alert>}

      <Box component="ul" sx={{ listStyle: 'none', p: 0, mb: 3 }}>
        {questions?.map(question => (
          <Controller
            key={question.id}
            name={`answers_${question.id}`}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <KBARadioButtons
                questionId={question.id}
                question={question.prompt}
                answers={question.answer}
                selectedAnswer={field.value}
                onAnswerChange={(questionId, answer) => {
                  field.onChange(answer);
                  handleAnswerChange(questionId, answer);
                }}
              />
            )}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={isSubmitting}
          disabled={!isFormComplete}
          sx={{ mt: 3 }}
        >
          Submit Answers
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default KBAQuestions;
