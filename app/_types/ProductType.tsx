import { FundingTypeEnum } from './EnrollmentInfo';

export interface ProductType {
  productId: number;
  productType?: string;
  productName?: string;
  productCode?: string;
  displaySequence?: number;
  features?: ProductFeatureType[];
  additionalServices?: AdditionalServicesType[];
  minDeposit?: number;
  productDescription?: string;
  freeGiftDescription?: string;
  rate?: number;
  apy?: number;
  term?: string;
  isServicemarkRequired?: boolean;
}

export interface ProductFeatureType {
  id: number;
  feature: string;
  displaySequence: number;
}

export interface AdditionalServicesType {
  id: number;
  additionalServiceName: string;
  additionalServiceDescription?: string;
  additionalServicesType: AdditionalServicesTypeEnum;
  additionalServicesOptionType: AdditionalServicesOptionTypeEnum;
  cost?: number;
  quantity?: number;
}

export enum AdditionalServicesTypeEnum {
  NA,
  ATM,
  DebitCard,
  Checks,
  EStatement,
  OnlineBanking,
  OverdraftProtection,
}

export enum AdditionalServicesOptionTypeEnum {
  NA,
  Optional,
  Required,
  PreSelected,
}

export enum ProductTypeEnum {
  Checking = 'Checking',
  Savings = 'Savings',
  MoneyMarket = 'Money Market',
  CertificateOfDeposit = 'Certificate of Deposit',
  Other = 'Other',
}
export type AlsoBuyProduct = {
  category: ProductTypeEnum;
  products: ProductType[];
};

export interface ProductMenuContent {
  title: string;
  checkingText: string;
  checkingDescription: string;
  savingsText: string;
  savingsDescription: string;
  moneyMarketText: string;
  moneyMarketDescription: string;
  cdText: string;
  cdDescription: string;
}

export interface ProductFunding {
  shoppingCartItemId?: number;
  fundingAmount: number;
}

export interface EnrollmentProductType {
  product: ProductType;
  fundingType?: FundingTypeEnum;
  fundingAmount?: number;
  accountNumber?: string;
  totalItemCost?: number;
}
