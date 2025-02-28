import React, { forwardRef } from 'react';
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  TextField,
  createFilterOptions,
} from '@mui/material';
import { StateEnum } from '@/app/_types/StateEnum';

interface StateOption {
  label: string;
  value: string;
}

const stateOptions = Object.entries(StateEnum).map(([abbr, name]) => ({
  label: name,
  value: abbr,
}));

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  stringify: (option: StateOption) => `${option.label} ${option.value}`,
});

interface StateDropdownProps {
  value: string | null;
  label?: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  className?: string;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
}

const StateDropdown = forwardRef<HTMLDivElement, StateDropdownProps>(
  ({ value, label, onChange, error, helperText, required, className, disabled, onBlur, name }, ref) => {
    // Helper function to convert string value to StateOption
    const getCurrentValue = () => {
      if (!value) return null;
      return stateOptions.find(option => option.value === value) || null;
    };

    const handleChange = (
      event: React.SyntheticEvent,
      value: string | StateOption | null,
      reason: AutocompleteChangeReason,
      details?: AutocompleteChangeDetails<StateOption>
    ) => {
      // Handle the different possible value types
      if (typeof value === 'string') {
        // Handle free text input
        onChange(value);
      } else if (value && 'value' in value) {
        // Handle selecting an option
        onChange(value.value);
      } else {
        // Handle clearing (null case)
        onChange('');
      }
    };

    return (
      <Autocomplete
        options={stateOptions}
        filterOptions={filterOptions}
        value={getCurrentValue()}
        onChange={handleChange}
        className={className}
        freeSolo
        clearOnBlur
        disabled={disabled}
        handleHomeEndKeys
        renderInput={params => (
          <TextField
            {...params}
            inputRef={ref}
            label={label}
            error={error}
            helperText={helperText}
            required={required}
            onBlur={onBlur}
            name={name}
          />
        )}
        isOptionEqualToValue={(option, value) => {
          if (!value) return false;
          return option.value === value.value;
        }}
      />
    );
  }
);

StateDropdown.displayName = 'StateDropdown';

export default StateDropdown;
