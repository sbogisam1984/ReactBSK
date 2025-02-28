export interface AddressComponent {
  componentName: ComponentName;
  confirmationLevel: ConfirmationLevel;
  inferred: boolean;
  spellCorrected: boolean;
  replaced: boolean;
  unexpected: boolean;
  componentType: string;
}
enum ConfirmationLevel {
  CONFIRMATION_LEVEL_UNSPECIFIED = 'CONFIRMATION_LEVEL_UNSPECIFIED',
  CONFIRMED = 'CONFIRMED',
  UNCONFIRMED_BUT_PLAUSIBLE = 'UNCONFIRMED_BUT_PLAUSIBLE',
  UNCONFIRMED_AND_SUSPICIOUS = 'UNCONFIRMED_AND_SUSPICIOUS',
}

interface ComponentName {
  text: string;
  languageCode: string;
}

export interface ValidatedAddress {
  formattedAddress: string;
  postalAddress: PostalAddress;
  addressComponents: AddressComponent[];
  missingComponentTypes: string[];
  unconfirmedComponentTypes: string[];
  unresolvedTokens: string[];
}

export interface BasicAddress {
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface AddressValidationState {
  physical?: {
    originalAddress: BasicAddress;
    validatedAddress: ValidatedAddress;
    action: AddressAction;
  };
  mailing?: {
    originalAddress: {
      address: string;
      city: string;
      state: string;
      zip: string;
    };
    validatedAddress: ValidatedAddress;
    action: AddressAction;
  };
}

export interface PostalAddress {
  revision: number;
  regionCode: string;
  languageCode: string;
  postalCode: string;
  sortingCode: string;
  administrativeArea: string;
  locality: string;
  sublocality: string;
  addressLines: string[];
  recipients: string[];
  organization: string;
}

export interface ValidationError {
  error: string;
}

export enum AddressAction {
  FIX = 'FIX',
  CONFIRM = 'CONFIRM',
  ACCEPT = 'ACCEPT',
}

export interface ValidatedAddressResponse {
  action: AddressAction;
  validatedAddress: ValidatedAddress;
  inputAddress: string;
}

export type ValidateAddressResponse = ValidatedAddressResponse | ValidationError;

export enum AddressValidationGranularity {
  GRANULARITY_UNSPECIFIED = 'GRANULARITY_UNSPECIFIED',
  SUB_PREMISE = 'SUB_PREMISE',
  PREMISE = 'PREMISE',
  PREMISE_PROXIMITY = 'PREMISE_PROXIMITY',
  BLOCK = 'BLOCK',
  ROUTE = 'ROUTE',
  OTHER = 'OTHER',
}

interface AddressValidationVerdict {
  inputGranularity: AddressValidationGranularity;
  validationGranularity: AddressValidationGranularity;
  geocodeGranularity: AddressValidationGranularity;
  addressComplete: boolean;
  hasUnconfirmedComponents: boolean;
  hasInferredComponents: boolean;
  hasReplacedComponents: boolean;
}

interface AddressMetadata {
  business: boolean;
  poBox: boolean;
  residential: boolean;
}

interface UspsAddress {
  firstAddressLine: string;
  firm: string;
  secondAddressLine: string;
  urbanization: string;
  cityStateZipAddressLine: string;
  city: string;
  state: string;
  zipCode: string;
  zipCodeExtension: string;
}

interface UspsData {
  standardizedAddress: UspsAddress;
  deliveryPointCode: string;
  deliveryPointCheckDigit: string;
  dpvConfirmation: string;
  dpvFootnote: string;
  dpvCmra: string;
  dpvVacant: string;
  dpvNoStat: string;
  dpvNoStatReasonCode: number;
  dpvDrop: string;
  dpvThrowback: string;
  dpvNonDeliveryDays: string;
  dpvNonDeliveryDaysValues: number;
  dpvNoSecureLocation: string;
  dpvPbsa: string;
  dpvDoorNotAccessible: string;
  dpvEnhancedDeliveryCode: string;
  carrierRoute: string;
  carrierRouteIndicator: string;
  ewsNoMatch: boolean;
  postOfficeCity: string;
  postOfficeState: string;
  abbreviatedCity: string;
  fipsCountyCode: string;
  county: string;
  elotNumber: string;
  elotFlag: string;
  lacsLinkReturnCode: string;
  lacsLinkIndicator: string;
  poBoxOnlyPostalCode: boolean;
  suitelinkFootnote: string;
  pmbDesignator: string;
  pmbNumber: string;
  addressRecordType: string;
  defaultAddress: boolean;
  errorMessage: string;
  cassProcessed: boolean;
}

export interface AddressValidationResult {
  verdict: AddressValidationVerdict;
  address: ValidatedAddress;
  geocode: any;
  metadata: AddressMetadata;
  uspsData: UspsData;
}

export interface AddressValidationAPIResponse {
  result: AddressValidationResult;
  responseId: string;
}

export enum AddressComponentTypeEnum {
  ADMINISTRATIVE_AREA_LEVEL_1 = 'administrative_area_level_1',
  ADMINISTRATIVE_AREA_LEVEL_2 = 'administrative_area_level_2',
  ADMINISTRATIVE_AREA_LEVEL_3 = 'administrative_area_level_3',
  ADMINISTRATIVE_AREA_LEVEL_4 = 'administrative_area_level_4',
  ADMINISTRATIVE_AREA_LEVEL_5 = 'administrative_area_level_5',
  ADMINISTRATIVE_AREA_LEVEL_6 = 'administrative_area_level_6',
  ADMINISTRATIVE_AREA_LEVEL_7 = 'administrative_area_level_7',
  ARCHIPELAGO = 'archipelago',
  COLLOQUIAL_AREA = 'colloquial_area',
  CONTINENT = 'continent',
  COUNTRY = 'country',
  ESTABLISHMENT = 'establishment',
  FINANCE = 'finance',
  FLOOR = 'floor',
  FOOD = 'food',
  GENERAL_CONTRACTOR = 'general_contractor',
  GEOCODE = 'geocode',
  HEALTH = 'health',
  INTERSECTION = 'intersection',
  LANDMARK = 'landmark',
  LOCALITY = 'locality',
  NATURAL_FEATURE = 'natural_feature',
  NEIGHBORHOOD = 'neighborhood',
  PLACE_OF_WORSHIP = 'place_of_worship',
  PLUS_CODE = 'plus_code',
  POINT_OF_INTEREST = 'point_of_interest',
  POLITICAL = 'political',
  POST_BOX = 'post_box',
  POSTAL_CODE = 'postal_code',
  POSTAL_CODE_PREFIX = 'postal_code_prefix',
  POSTAL_CODE_SUFFIX = 'postal_code_suffix',
  POSTAL_TOWN = 'postal_town',
  PREMISE = 'premise',
  ROOM = 'room',
  ROUTE = 'route',
  STREET_ADDRESS = 'street_address',
  STREET_NUMBER = 'street_number',
  SUBLOCALITY = 'sublocality',
  SUBLOCALITY_LEVEL_1 = 'sublocality_level_1',
  SUBLOCALITY_LEVEL_2 = 'sublocality_level_2',
  SUBLOCALITY_LEVEL_3 = 'sublocality_level_3',
  SUBLOCALITY_LEVEL_4 = 'sublocality_level_4',
  SUBLOCALITY_LEVEL_5 = 'sublocality_level_5',
  SUBPREMISE = 'subpremise',
  TOWN_SQUARE = 'town_square',
}
