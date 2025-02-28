'use client';

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface ZipCodeInputProps extends Omit<TextFieldProps, 'onChange'> {
  control: Control<any>;
  name: string;
}

const ZipCodeInput = ({ control, name, ...props }: ZipCodeInputProps) => {
  const formatZipCode = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Handle the formatting based on length
    if (digits.length <= 5) {
      return digits;
    } else if (digits.length <= 9) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else {
      return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: 'ZIP code is required',
        pattern: {
          value: /^\d{5}(-\d{4})?$/,
          message: 'Please enter a valid ZIP code',
        },
      }}
      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
        <TextField
          {...props}
          {...field}
          value={value || ''}
          onChange={e => {
            const formatted = formatZipCode(e.target.value);
            onChange(formatted);
          }}
          error={!!error}
          disabled={props.disabled}
          helperText={error?.message}
          slotProps={{
            htmlInput: {
              maxLength: 10,
            },
          }}
        />
      )}
    />
  );
};

export default ZipCodeInput;
