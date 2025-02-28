import { FormControl, FormControlLabel, Radio, RadioGroup, Typography, Box } from '@mui/material';
import { ChangeEvent } from 'react';

interface KBARadioButtonsProps {
  questionId: number;
  question: string | undefined;
  answers: string[] | undefined;
  onAnswerChange: (questionId: number, answer: string) => void;
  selectedAnswer?: string;
}

export default function KBARadioButtons({
  questionId,
  question,
  answers,
  onAnswerChange,
  selectedAnswer,
}: KBARadioButtonsProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onAnswerChange(questionId, event.target.value);
  };

  return (
    <Box component="li" sx={{ mb: 3 }}>
      <FormControl sx={{ width: '100%' }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
          {question}
        </Typography>
        <RadioGroup name={`kba-question-${questionId}`} value={selectedAnswer || ''} onChange={handleChange}>
          {answers?.map((option, index) => (
            <FormControlLabel
              key={`${questionId}-${index}`}
              value={option}
              control={<Radio />}
              label={option}
              sx={{
                '& .MuiFormControlLabel-label': {
                  color: 'text.primary',
                },
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
