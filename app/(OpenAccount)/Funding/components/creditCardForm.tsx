import { useFormState } from 'react-dom';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { CreditCardFormHandler } from '../../../_utils/fundingUtils';
import { Box, Button, TextField } from '@mui/material';
import { ProductFunding } from '../../../_types/ProductType';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import VisaLogo from '@/public/img/logos/visa/Visa_Inc._logo.svg';
import MastercardLogo from '@/public/img/logos/mastercard/Artwork/mc_symbol.svg';
import Image from 'next/image';

export interface CreditCardFormValues {
  fundingAmounts: ProductFunding[];
  nameOnCard: string;
  creditCardNumber: string;
  expirationDate: string;
  CVV: string;
  creditCardType?: string;
}

export default function CreditCardForm({
  productFunding,
  reset,
}: {
  productFunding: ProductFunding[] | undefined;
  reset: () => void;
}) {
  const [formState, formAction] = useFormState(CreditCardFormHandler, undefined);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useForm<CreditCardFormValues>({
    defaultValues: {
      fundingAmounts: productFunding?.map(item => ({
        shoppingCartItemId: item.shoppingCartItemId,
        fundingAmount: item.fundingAmount,
      })),
    },
  });

  const [expirationDateValue, setExpirationDateValue] = useState('');
  const [creditCardType, setCreditCardType] = useState<string | null>(null);

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { value } = e.target;
    value = value.replace(/\D/g, '');

    if (value.length > 6) {
      value = value.slice(0, 6);
    }

    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 6)}`;
    }

    setExpirationDateValue(value);
  };

  const handleCreditCardNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: any) => {
    let { value } = e.target;
    value = value.replace(/\D/g, '');
    field.onChange(value);

    if (value.startsWith('4')) {
      setCreditCardType('visa');
    } else if (value.startsWith('5')) {
      setCreditCardType('mastercard');
    } else {
      setCreditCardType(null);
    }
  };

  const { fields } = useFieldArray({
    control,
    name: 'fundingAmounts',
  });

  return (
    <>
      <p>Enter your credit card information:</p>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1 },
        }}
        className="mt-4 flex flex-col"
        onSubmit={handleSubmit(formAction)}
        noValidate
        autoComplete="off"
      >
        {fields.map((item, index) => (
          <Controller
            key={item.id}
            name={`fundingAmounts.${index}.fundingAmount`}
            control={control}
            render={({ field }) => <input type="hidden" {...field} />}
          />
        ))}
        <div className="flex flex-col space-y-4">
          <div>
            <Controller
              name="nameOnCard"
              control={control}
              defaultValue=""
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Card Holder Name"
                  variant="outlined"
                  required
                  error={!!errors.nameOnCard}
                  helperText={errors?.nameOnCard?.message}
                  className="w-[40%]"
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              )}
            />
          </div>
          <div>
            <div className="flex flex-row">
              <Controller
                name="creditCardNumber"
                control={control}
                defaultValue=""
                rules={{ required: 'Credit Card Number is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Credit Card Number"
                    variant="outlined"
                    required
                    error={!!errors.creditCardNumber}
                    helperText={errors?.creditCardNumber?.message}
                    className="w-[40%]"
                    onChange={e => handleCreditCardNumberChange(e, field)}
                    slotProps={{
                      htmlInput: { maxLength: 16 },
                      inputLabel: { shrink: true },
                    }}
                  />
                )}
              />
              {creditCardType && (
                <div className="ml-2 flex items-center">
                  <Image
                    src={creditCardType === 'visa' ? VisaLogo : MastercardLogo}
                    alt={creditCardType === 'visa' ? 'Visa' : 'MasterCard'}
                    width={40}
                    height={24}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-[40%]">
            <Controller
              name="expirationDate"
              control={control}
              defaultValue=""
              rules={{
                required: 'Expiration Date is required',
                minLength: 7,
                maxLength: 7,
                pattern: { value: /^\d{2}\/\d{4}$/, message: 'Invalid format' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={expirationDateValue}
                  label="Expiration Date"
                  placeholder="mm/yyyy"
                  variant="outlined"
                  required
                  error={!!errors.expirationDate}
                  helperText={errors?.expirationDate?.message}
                  className="w-[40%]"
                  onChange={e => {
                    handleExpirationDateChange(e);
                    field.onChange(e);
                  }}
                  slotProps={{
                    htmlInput: { maxLength: 7 },
                    inputLabel: { shrink: true },
                  }}
                />
              )}
            />
          </div>
          <div className="w-[40%]">
            <Controller
              name="CVV"
              control={control}
              defaultValue=""
              rules={{ required: 'CVV is required', pattern: { value: /^\d{3}$/, message: 'Invalid format' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="CVV"
                  variant="outlined"
                  required
                  error={!!errors.CVV}
                  helperText={errors?.CVV?.message}
                  className="w-[40%]"
                  onChange={e => {
                    const { value } = e.target;
                    field.onChange(value.replace(/\D/g, '')); // Allow only digits
                  }}
                  slotProps={{
                    htmlInput: { maxLength: 3 },
                    inputLabel: { shrink: true },
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end my-2 gap-8">
          <Button variant="contained" onClick={() => reset()}>
            Reset
          </Button>
          <LoadingButton loading={isSubmitting} type="submit" variant="contained" color="primary">
            Next
          </LoadingButton>
        </div>
      </Box>
      {formState?.errors && <p>Failure submitting credit card details</p>}
    </>
  );
}
