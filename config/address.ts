import { ENV } from './constants';

export interface AddressValidationConfig {
  enableFixValidation: boolean;
  environment: string;
}

function getAddressValidationConfig(): AddressValidationConfig {
  return {
    enableFixValidation: process.env.ENABLE_ADDRESS_FIX_VALIDATION === 'true',
    environment: process.env.NODE_ENV || ENV.development,
  };
}

// Cached configuration instance
let configInstance: AddressValidationConfig | null = null;

export function getAddressConfig(): AddressValidationConfig {
  if (!configInstance) {
    configInstance = getAddressValidationConfig();
  }
  return configInstance;
}
