import { EnrollmentProductType, ProductType } from './ProductType';

export interface DisclosureInfo {
  applicationDisclosures?: ApplicationDisclosureInfo[];
  enrollmentProducts?: EnrollmentProductInfo[];
}

export interface ApplicationDisclosureInfo {
  disclosureId?: number;
  disclosureType?: number;
  isAccepted?: boolean;
  disclosureName?: string;
  disclosureUrl?: string;
}

export interface EnrollmentProductInfo {
  product?: ProductType;
  accountNumber?: string;
  // TODO: add remaining EnrollmentProduct properties
  disclosureItems?: ProductDisclosureItem[];
}

export interface ProductDisclosureItem {
  disclosureId?: number;
  disclosureType?: number;
  isAccepted?: boolean;
  documentTitle?: string;
  displayName?: string;
  isESign?: boolean;
  pdfCode?: string;
}

export interface DisclosureFile {
  base64Data?: string;
}

export interface DisclosureDocuSignInfo {
  url?: string;
}

export interface DisclosureDocuSignInfo {
  url?: string;
}

export interface DisclosureAcceptRequest {
  disclosureType?: number;
  disclosureId?: number;
  disclosureGroup?: string;
  isAccepted?: boolean;
}

export interface ApplicantAddress {
  streetName?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export enum ApplicantTypeEnum {
  NA,
  Primary,
  Joint,
  Minor,
}

export function stringToApplicantTypeEnum(value: string): ApplicantTypeEnum {
  switch (value.toLowerCase()) {
    case 'primary':
      return ApplicantTypeEnum.Primary;
    case 'joint':
      return ApplicantTypeEnum.Joint;
    case 'minor':
      return ApplicantTypeEnum.Minor;
    default:
      return ApplicantTypeEnum.NA;
  }
}

export enum VerificationTypeEnum {
  manual,
  document,
}

export interface ApplicantInfo {
  id: number | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  householdIncome?: string;
  applicantType?: ApplicantTypeEnum;
  applicantOrder?: number;
  address?: ApplicantAddress;
  mailingAddress?: ApplicantAddress;
  usePhysicalAddress?: boolean;
  usePrimaryAddressForJoint?: boolean;
  ssn?: string;
  citizenshipStatus?: CitizenshipStatusEnum;
  isApplicationScreeningAccepted?: boolean;
  identificationDetails?: IdentificationDetails;
  occupation?: ApplicantOccupation;
  verificationType?: VerificationTypeEnum;
}

export interface IdentificationDetails {
  identificationType: string;
  identificationNumber: string;
  stateIssued: string;
  countryIssued: Country;
  issueDate: string;
  expirationDate: string;
}

export interface ApplicantOccupation {
  occupationId?: number;
  occupationName?: string;
  occupationDetails?: string;
}

export interface AdditionalQuestions {
  applicantKBAQuestions?: ApplicantQuestions[];
  isQualified: string;
}

export interface ApplicantQuestions {
  id: number;
  applicantId?: number;
  prompt?: string;
  answer?: string[];
}

export interface KBARequest {
  id?: number;
  answer?: string;
  applicantId?: number;
  enrollmentId?: number;
}

export interface ApplicantKBAAnswers {
  idologyQueryId: number;
  summaryResultKey?: string;
  summaryResultMessage?: string;
  resultsKey?: string;
  resultsMessage?: string;
  idliveqResultsKey?: string;
  idliveqResultsMessage?: string;
  iqSummaryResult?: string;
  idScanRequired?: boolean;
  answersReceived?: number;
}

export interface EnrollmentInfoData {
  enrollmentId: number;
  applicantDetails?: ApplicantInfo[];
  productInfos?: EnrollmentProductType[];
  disclosureInfos?: DisclosureInfo[];
  enrollmentZipCode?: string;
  isPrimaryExistingCustomer?: boolean;
  applicationType?: ApplicantTypeEnum;
  IDologyQueryId?: number;
  meridianLinkApplicationNumber?: number;
  lastCompletedStep: EnrollmentStepEnum;
  currentPage: EnrollmentPageEnum;
}

export interface EnrollmentInfo {
  data: EnrollmentInfoData;
  errorMessage: string;
}

export interface AddApplicantResponse {
  showValidation: boolean;
  applicantEnrollment: EnrollmentInfo | undefined;
}

export interface Country {
  id: number;
  name: string;
  isPassportAllowed: boolean;
}

export enum TransactionTypeEnum {
  NA,
  ZipCodeSearch,
  ExistingCustomerLogin,
  PageLoad,
  SelectedProduct,
  ManualVerification,
  DocumentVerification,
  CheckingCompanion,
  AddToCart,
  AddressValidation,
  KBA,
}

export enum FundingTypeEnum {
  NA,
  CreditCard,
  ExternalTransfer,
  InternalTransfer,
  Plaid,
}

export enum EnrollmentStepEnum {
  InitialVisit,
  ProductSelection,
  PrimaryVerificationSelection,
  PrimaryDetails,
  PrimaryConfirmIdentity,
  PrimaryKBA,
  PrimaryKYC,
  JointVerificationSelection,
  JointDetails,
  JointConfirmIdentity,
  JointKBA,
  JointKYC,
  Funding,
  Disclosures,
  Decision,
}

export enum EnrollmentPageEnum {
  Home,
  GettingStarted,
  Products,
  ProductMenu,
  SelectVerification,
  ScanVerification,
  ApplicantInfo,
  ConfirmIdentity,
  KYCQuestions,
  KBAQuestions,
  SelectJoint,
  Funding,
  Disclosures,
  Decision,
}
export enum CitizenshipStatusEnum {
  USCitizen,
  PermanentResident,
  NonPermanentResident,
}
