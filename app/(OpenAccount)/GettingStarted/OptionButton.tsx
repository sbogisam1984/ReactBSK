import CircleArrowDown from '@/app/_components/Icons/CircleArrowDown';
import CircleArrowRight from '@/app/_components/Icons/CircleArrowRight';
import { Box, Typography } from '@mui/material';
import React from 'react';

// export type UserOption = 'existing' | 'new' | '';

export enum UserOption {
  existing,
  new,
  none,
}

interface OptionButtonProps {
  value: UserOption;
  label: string;
  subLabel: string;
  selectedOption: UserOption;
  onSelect: (option: UserOption) => void;
}

export default function OptionButton({ value, label, subLabel, selectedOption, onSelect }: OptionButtonProps) {
  const isSelected = selectedOption === value;
  const isUnselected = selectedOption !== UserOption.none && !isSelected;

  return (
    <Box
      onClick={() => onSelect(value)}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        mb: 2,
        // opacity: isUnselected ? 0.5 : 1,
      }}
    >
      <Box
        sx={{
          mr: 1,
          cursor: 'pointer',
          '&:hover': {
            opacity: 1,
          },
          '&:hover ~ .text-box > .label': {
            textDecoration: 'underline',
            textDecorationColor: '#cb4a20',
            color: '#cb4a20',
          },
          '&:hover ~ .text-box > .sublabel': {
            textDecoration: 'underline',
            textDecorationColor: 'currentColor',
          },
        }}
      >
        {isSelected ? <CircleArrowDown /> : <CircleArrowRight />}
      </Box>
      <Box
        className={'text-box'}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            opacity: 1,
            color: 'primary.main',
          },
          '&:hover > *': {
            textDecoration: 'underline',
            textDecorationColor: 'currentColor',
          },
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        <Typography
          className="label"
          variant="body1"
          sx={{
            color: isSelected ? 'primary.main' : 'inherit',
            textDecoration: isSelected ? 'underline' : 'none',
          }}
        >
          {label}
        </Typography>
        <Typography
          className="sublabel"
          variant="body2"
          sx={{
            color: 'text.secondary',
            textDecoration: isSelected ? 'underline' : 'none',
          }}
        >
          {subLabel}
        </Typography>
      </Box>
    </Box>
  );
}
