'use client';

import React from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import useAddressAutocomplete from '@/app/_hooks/useAddressAutocomplete';

interface AddressAutocompleteProps {
  onSelect: (address: { streetAddress: string; city: string; state: string; zip: string }) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelect,
  placeholder = 'Enter address',
  className,
  value,
  onChange,
  error,
  helperText,
  required,
  disabled,
}) => {
  const {
    input,
    setInput,
    predictions,
    handleSelect,
    isLoading,
    error: autocompleteError,
  } = useAddressAutocomplete(onSelect, value) as {
    input: string;
    setInput: (value: string) => void;
    predictions: Array<{
      placePrediction: {
        structuredFormat: { mainText: { text: string }; secondaryText?: { text: string } };
        placeId: string;
      };
    }>;
    handleSelect: (option: any) => void;
    isLoading: boolean;
    error: string | null;
  };

  return (
    <Autocomplete
      freeSolo
      options={predictions}
      getOptionLabel={option =>
        typeof option === 'string' ? option : option.placePrediction.structuredFormat.mainText.text
      }
      filterOptions={x => x}
      value={value}
      disabled={disabled}
      inputValue={value}
      onChange={(event, newValue) => {
        if (newValue && typeof newValue !== 'string') {
          handleSelect(newValue);
        } else {
          onChange(newValue || '');
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInput(newInputValue);
        onChange(newInputValue);
      }}
      renderInput={params => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="outlined"
          fullWidth
          required={required}
          label="Street Address"
          error={error || !!autocompleteError}
          helperText={helperText || autocompleteError}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderOption={(props, option, { inputValue }) => {
        const matches = match(option.placePrediction.structuredFormat.mainText.text, inputValue, { insideWords: true });
        const parts = parse(option.placePrediction.structuredFormat.mainText.text, matches);

        return (
          <li {...props} key={option.placePrediction.placeId}>
            <div className="flex items-center py-1 px-2 cursor-pointer transition-colors duration-150">
              <div className="flex items-center mr-2">
                <LocationOnIcon className="text-base text-cbnaOrange" />
              </div>
              <div className="flex flex-col">
                <div>
                  {parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ))}
                </div>
                <small className="text-gray-600 leading-tight">
                  {option.placePrediction.structuredFormat.secondaryText?.text}
                </small>
              </div>
            </div>
          </li>
        );
      }}
      className={className}
    />
  );
};

export default AddressAutocomplete;
