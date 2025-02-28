'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Box,
} from '@mui/material';
import {
  AddressAction,
  AddressValidationState,
  ValidatedAddress,
  AddressComponentTypeEnum,
  BasicAddress,
} from '@/app/_types/AddressValidationType';

export interface AddressSelection {
  useOriginal: boolean;
  address: string;
}

export interface AddressSelections {
  physical?: AddressSelection;
  mailing?: AddressSelection;
}

export interface AddressCorrectionModalProps {
  open: boolean;
  handleClose: () => void;
  validationState: AddressValidationState;
  onConfirm: (selections: AddressSelections) => void;
}
const AddressCorrectionModal: React.FC<AddressCorrectionModalProps> = ({
  open,
  handleClose,
  validationState,
  onConfirm,
}) => {
  const [selectedPhysicalAddress, setSelectedPhysicalAddress] = useState<string>('');
  const [selectedMailingAddress, setSelectedMailingAddress] = useState<string>('');

  useEffect(() => {
    if (!open) {
      setSelectedPhysicalAddress('');
      setSelectedMailingAddress('');
    }
  }, [open]);

  const handleConfirm = () => {
    const selections = {
      physical: validationState.physical
        ? {
            useOriginal: selectedPhysicalAddress === formatAddress(validationState.physical.originalAddress),
            address: selectedPhysicalAddress,
          }
        : undefined,
      mailing: validationState.mailing
        ? {
            useOriginal: selectedMailingAddress === formatAddress(validationState.mailing.originalAddress),
            address: selectedMailingAddress,
          }
        : undefined,
    };
    onConfirm(selections);
  };

  // Check if either address needs fixing
  const physicalNeedsFix = validationState.physical?.action === AddressAction.FIX;
  const mailingNeedsFix = validationState.mailing?.action === AddressAction.FIX;
  const anyAddressNeedsFix = physicalNeedsFix || mailingNeedsFix;

  // Check if addresses are identical
  const getAreAddressesIdentical = (validation: {
    originalAddress: BasicAddress;
    validatedAddress: ValidatedAddress;
  }) => {
    const originalFormatted = formatAddress(validation.originalAddress);
    const standardizedFormatted = formatValidatedAddress(validation.validatedAddress);
    return originalFormatted === standardizedFormatted;
  };

  const physicalAddressesIdentical = validationState.physical
    ? getAreAddressesIdentical(validationState.physical)
    : false;

  const mailingAddressesIdentical = validationState.mailing ? getAreAddressesIdentical(validationState.mailing) : false;

  // Auto-select the address if they're identical
  useEffect(() => {
    if (validationState.physical && !physicalNeedsFix) {
      setSelectedPhysicalAddress(formatValidatedAddress(validationState.physical.validatedAddress));
    }
    if (validationState.mailing && !mailingNeedsFix) {
      setSelectedMailingAddress(formatValidatedAddress(validationState.mailing.validatedAddress));
    }
  }, [validationState, physicalNeedsFix, mailingNeedsFix]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Address Validation Required</DialogTitle>
      <DialogContent>
        {anyAddressNeedsFix ? (
          // Show error message for addresses that need fixing
          <>
            <Alert variant="standard" severity="error" sx={{ mb: 2 }}>
              The following address(es) appear to have errors and need to be corrected:
            </Alert>
            <Alert variant="outlined" severity="warning" sx={{ mb: 2 }}>
              If you live in an apartment or unit, please make sure your unit number is included in the address.
            </Alert>
          </>
        ) : (
          <>
            <Alert variant="standard" severity="info" sx={{ mb: 2 }}>
              Please review the suggested address corrections below. You can choose to use either your original address
              or the standardized version for accurate delivery.
            </Alert>
            <Alert variant="outlined" severity="info" sx={{ mb: 2 }}>
              If you live in an apartment or unit, please make sure your unit number is included in the address.
            </Alert>
          </>
        )}

        {validationState.physical && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Physical Address
            </Typography>
            {physicalNeedsFix ? (
              <>
                <Alert variant="outlined" severity="error" sx={{ mb: 2 }}>
                  There appears to be an error with this address. Please go back and correct it:
                </Alert>
                <Box>
                  <Typography variant="body2">
                    <strong>Original Address: </strong>
                    {formatAddress(validationState.physical.originalAddress)}
                  </Typography>
                </Box>
              </>
            ) : physicalAddressesIdentical ? (
              <>
                <Alert variant="outlined" severity="success" sx={{ mb: 2 }}>
                  Please verify that this address is correct:
                </Alert>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2">{formatAddress(validationState.physical.originalAddress)}</Typography>
                </Box>
              </>
            ) : (
              <>
                <Alert variant="outlined" severity="warning" sx={{ mb: 2 }}>
                  We found a standardized version of this address.
                </Alert>
                <RadioGroup value={selectedPhysicalAddress} onChange={e => setSelectedPhysicalAddress(e.target.value)}>
                  <FormControlLabel
                    value={formatAddress(validationState.physical.originalAddress)}
                    control={<Radio />}
                    disabled={anyAddressNeedsFix}
                    label={
                      <Box>
                        <Typography variant="subtitle2">Original Address:</Typography>
                        <Typography variant="body2">
                          {formatAddress(validationState.physical.originalAddress)}
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value={formatValidatedAddress(validationState.physical.validatedAddress)}
                    control={<Radio />}
                    disabled={anyAddressNeedsFix}
                    label={
                      <Box>
                        <Typography variant="subtitle2">Standardized Address:</Typography>
                        <Typography variant="body2">
                          {formatValidatedAddress(validationState.physical.validatedAddress)}
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </>
            )}
          </Box>
        )}

        {validationState.mailing && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Mailing Address
            </Typography>
            {mailingNeedsFix ? (
              <>
                <Alert variant="outlined" severity="error" sx={{ mb: 2 }}>
                  There appears to be an error with this address. Please go back and correct it:
                </Alert>
                <Typography variant="body1" sx={{ ml: 2 }}>
                  <Box>
                    <Typography variant="subtitle2">Original Address:</Typography>
                    <Typography variant="body2">{formatAddress(validationState.mailing.originalAddress)}</Typography>
                  </Box>
                </Typography>
              </>
            ) : mailingAddressesIdentical ? (
              <>
                <Alert variant="outlined" severity="success" sx={{ mb: 2 }}>
                  Please verify that this address is correct:
                </Alert>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2">{formatAddress(validationState.mailing.originalAddress)}</Typography>
                </Box>
              </>
            ) : (
              <>
                <Alert variant="outlined" severity="warning" sx={{ mb: 2 }}>
                  We found a standardized version of this address.
                </Alert>
                <RadioGroup value={selectedMailingAddress} onChange={e => setSelectedMailingAddress(e.target.value)}>
                  <FormControlLabel
                    value={formatAddress(validationState.mailing.originalAddress)}
                    control={<Radio />}
                    disabled={anyAddressNeedsFix}
                    label={
                      <Box>
                        <Typography variant="subtitle2">Original Address:</Typography>
                        <Typography variant="body2">
                          {formatAddress(validationState.mailing.originalAddress)}
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value={formatValidatedAddress(validationState.mailing.validatedAddress)}
                    control={<Radio />}
                    disabled={anyAddressNeedsFix}
                    label={
                      <Box>
                        <Typography variant="subtitle2">Standardized Address:</Typography>
                        <Typography variant="body2">
                          {formatValidatedAddress(validationState.mailing.validatedAddress)}
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Go Back
        </Button>
        {!anyAddressNeedsFix && (
          <Button
            onClick={handleConfirm}
            color="primary"
            disabled={
              (validationState.physical?.action === AddressAction.CONFIRM && !selectedPhysicalAddress) ||
              (validationState.mailing?.action === AddressAction.CONFIRM && !selectedMailingAddress)
            }
          >
            Confirm
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Utility function to format address consistently
const formatAddress = (address: { address: string; city: string; state: string; zip: string }) => {
  return `${address.address}, ${address.city}, ${address.state} ${address.zip}`;
};

// Utility function to format validated address without country
const formatValidatedAddress = (validatedAddress: ValidatedAddress): string => {
  // Get PO Box component if it exists
  const poBoxComponent = validatedAddress.addressComponents.find(
    c => c.componentType === AddressComponentTypeEnum.POST_BOX
  );

  if (poBoxComponent) {
    // Use PO Box as street address
    const city =
      validatedAddress.addressComponents.find(c => c.componentType === AddressComponentTypeEnum.LOCALITY)?.componentName
        .text || '';

    const state =
      validatedAddress.addressComponents.find(
        c => c.componentType === AddressComponentTypeEnum.ADMINISTRATIVE_AREA_LEVEL_1
      )?.componentName.text || '';

    const zip =
      validatedAddress.addressComponents.find(c => c.componentType === AddressComponentTypeEnum.POSTAL_CODE)
        ?.componentName.text || '';

    const zipSuffix = validatedAddress.addressComponents.find(
      c => c.componentType === AddressComponentTypeEnum.POSTAL_CODE_SUFFIX
    )?.componentName.text;

    const zipCode = zipSuffix ? `${zip}-${zipSuffix}` : zip;

    return `${poBoxComponent.componentName.text}, ${city}, ${state} ${zipCode}`;
  }

  // Otherwise, remove country suffix if present and return formatted address
  return validatedAddress.formattedAddress.replace(/, USA$/, '');
};

export default AddressCorrectionModal;
