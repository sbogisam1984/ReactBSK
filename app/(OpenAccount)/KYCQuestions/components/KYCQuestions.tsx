'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormHelperText from '@mui/material/FormHelperText';
import { ApplicantTypeEnum } from '@/app/_types/EnrollmentInfo';
import { useRouter } from 'next/navigation';
import { KYCAnswer, KYCQuestion, KYCQuestionType } from '@/app/_types/KYCQuestionType';
import { SubmitKYCQuestions } from '@/app/_utils/kycUtils';
import { FormLabel, TextField, InputAdornment, useMediaQuery, Theme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { formatCurrency, formatNumber } from '@/app/_utils/formattingUtils';

interface KYCFormValues {
  [key: string]: string | number;
}

interface Props {
  applicantId: number;
  applicantType: ApplicantTypeEnum;
  questions: KYCQuestion[];
  previousAnswers: KYCAnswer[];
}

export default function KYCQuestions({ applicantId, applicantType, questions, previousAnswers }: Props) {
  const router = useRouter();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Create default values from the answers prop
  const defaultValues: KYCFormValues = {};
  previousAnswers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);

    // For numberText and moneyText types, use customAnswer
    if (question?.type === KYCQuestionType.NumberText || question?.type === KYCQuestionType.MoneyText) {
      defaultValues[`question_${answer.questionId}`] = answer.customAnswer || '';
    } else {
      // For other types (Select, Boolean), use the answer id
      defaultValues[`question_${answer.questionId}`] = answer.id || '';
    }
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<KYCFormValues>({
    defaultValues,
    mode: 'onChange',
  });

  // Clear child answers when parent changes
  const clearChildAnswers = useCallback(
    (parentQuestionId: number) => {
      const childQuestions = questions.filter(q => q.parentQuestionId === parentQuestionId);
      childQuestions.forEach(question => {
        setValue(`question_${question.id}`, '');
        // Recursively clear nested children if any
        clearChildAnswers(question.id);
      });
    },
    [questions, setValue]
  );

  const getYesAnswerId = useCallback(
    (questionId: number): number | null => {
      const question = questions.find(q => q.id === questionId);
      if (question?.type === KYCQuestionType.Boolean) {
        const yesAnswer = question.answers.find(a => a.answerText.toLowerCase().trim() === 'yes');
        return yesAnswer?.id ?? null;
      }
      return null;
    },
    [questions]
  );

  // Watch for changes to all boolean questions
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change' && name) {
        const questionId = parseInt(name.replace('question_', ''));
        const question = questions.find(q => q.id === questionId);

        if (question?.type === KYCQuestionType.Boolean) {
          const yesAnswerId = getYesAnswerId(questionId);
          if (String(value[name]) !== String(yesAnswerId)) {
            clearChildAnswers(questionId);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [clearChildAnswers, getYesAnswerId, questions, watch]);

  const formValues = watch();

  const isQuestionVisible = (question: KYCQuestion): boolean => {
    if (!question.parentQuestionId) return true;

    const parentAnswer = formValues[`question_${question.parentQuestionId}`];
    const yesAnswerId = getYesAnswerId(question.parentQuestionId);

    return String(parentAnswer) === String(yesAnswerId);
  };

  const onSubmit = async (data: KYCFormValues) => {
    setIsLoading(true);
    const formData = new FormData();

    questions.forEach(question => {
      const key = `question_${question.id}`;
      const value = isQuestionVisible(question) ? data[key]?.toString() : null;
      formData.append(key, value ?? '');
    });

    formData.append('applicantId', applicantId.toString());

    try {
      const response = await SubmitKYCQuestions(formData, questions);

      if (response.isSuccess) {
        if (applicantType === ApplicantTypeEnum.Primary) {
          router.push('/SelectJoint');
        } else {
          router.push('/Funding');
        }
      } else {
        console.error(response.validationErrors);
      }
    } catch (error) {
      console.error('Error: ', error);
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        U.S. Government regulations require that we gather certain information about how you intend to use your new
        Community Bank, N.A. account.
      </Typography>
      <Typography variant="body2" gutterBottom>
        While we understand that the information below may vary from month to month, please approximate the level of
        anticipated usage.
      </Typography>

      {questions.map(
        (question, index) =>
          isQuestionVisible(question) && (
            <Controller
              key={question.id}
              name={`question_${question.id}`}
              control={control}
              defaultValue={defaultValues[`question_${question.id}`] || ''}
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors[`question_${question.id}`]}>
                  {question.type === KYCQuestionType.Select ? (
                    <>
                      <FormLabel
                        sx={{
                          display: { xs: 'block', sm: 'none' },
                          mb: 1,
                        }}
                      >
                        {question.prompt} *
                      </FormLabel>
                      <TextField
                        {...field}
                        label={isMobile ? '' : question.prompt + ' *'}
                        variant="outlined"
                        select
                        error={!!errors[`question_${question.id}`]}
                        helperText={errors[`question_${question.id}`]?.message}
                      >
                        {question.answers.map(answer => (
                          <MenuItem key={answer.id} value={answer.id}>
                            {answer.answerText}
                          </MenuItem>
                        ))}
                      </TextField>
                    </>
                  ) : question.type === KYCQuestionType.Boolean ? (
                    <>
                      <FormLabel component="legend">{question.prompt} *</FormLabel>
                      <RadioGroup row {...field}>
                        {question.answers.map(answer => (
                          <FormControlLabel
                            key={answer.id}
                            value={answer.id}
                            control={<Radio />}
                            label={answer.answerText}
                          />
                        ))}
                      </RadioGroup>
                      {errors[`question_${question.id}`] && (
                        <FormHelperText error>{errors[`question_${question.id}`]?.message}</FormHelperText>
                      )}
                    </>
                  ) : question.type === KYCQuestionType.MoneyText ? (
                    <>
                      <FormLabel
                        sx={{
                          display: { xs: 'block', sm: 'none' },
                          mb: 1,
                        }}
                      >
                        {question.prompt} *
                      </FormLabel>
                      <TextField
                        {...field}
                        label={isMobile ? '' : question.prompt + ' *'}
                        variant="outlined"
                        onChange={e => {
                          const formatted = formatCurrency(e.target.value);
                          field.onChange(formatted);
                        }}
                        error={!!errors[`question_${question.id}`]}
                        helperText={errors[`question_${question.id}`]?.message}
                      />
                    </>
                  ) : question.type === KYCQuestionType.NumberText ? (
                    <>
                      <FormLabel
                        sx={{
                          display: { xs: 'block', sm: 'none' },
                          mb: 1,
                        }}
                      >
                        {question.prompt} *
                      </FormLabel>
                      <TextField
                        {...field}
                        label={isMobile ? '' : question.prompt + ' *'}
                        variant="outlined"
                        onChange={e => {
                          const formatted = formatNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                        error={!!errors[`question_${question.id}`]}
                        helperText={errors[`question_${question.id}`]?.message}
                      />
                    </>
                  ) : null}
                </FormControl>
              )}
            />
          )
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <LoadingButton type="submit" variant="contained" color="primary" sx={{ mt: 3 }} loading={isLoading}>
          Submit
        </LoadingButton>
      </Box>
    </Box>
  );
}
