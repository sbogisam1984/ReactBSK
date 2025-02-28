import { AdditionalServicesType, ProductFeatureType, ProductType, ProductTypeEnum } from '../_types/ProductType';

/**
 * Validates if a given string is a valid ProductTypeEnum value.
 * @param value The string to validate.
 * @returns The validated ProductTypeEnum value or throws error if invalid.
 */
export function validateProductType(value: string | undefined): ProductTypeEnum {
  const values = Object.values(ProductTypeEnum);
  if (values.includes(value as ProductTypeEnum)) {
    return value as ProductTypeEnum;
  } else {
    throw new Error(`Invalid ProductTypeEnum: ${value}`);
  }
}

export function ProductConverter(data: any): ProductType | undefined {
  //console.log(`ProductConverter ${data}`)
  return {
    productId: data.productId,
    productName: data.productName,
    productCode: data.productCode,
    productType: data.productType,
    displaySequence: data.displaySequence,
    features: data.features?.map((f: any): ProductFeatureType => {
      return {
        id: f.featureId,
        feature: f.feature,
        displaySequence: f.displaySequence,
      };
    }),
    additionalServices: data.services?.map((a: any) => AdditionalServiceConverter(a)),
    minDeposit: data.minDeposit,
    productDescription: data.productDescription,
    freeGiftDescription: data.freeGiftDescription,
    rate: data.rate,
    apy: data.apy,
    term: data.term,
    isServicemarkRequired: data.isServicemarkRequired,
  };
}

export const getProductNameWithServicemark = (name: string | undefined, isServicemarkRequired: boolean | undefined) => {
  const productName = name ?? '';
  return isServicemarkRequired ?? false ? `${productName}℠` : productName;
};

export function AdditionalServiceConverter(data: any): AdditionalServicesType | undefined {
  //console.log(`AdditionalServiceConverter: ${JSON.stringify(data, null, 5)}`)
  return {
    id: data.additionalServiceId,
    additionalServiceName: data.additionalServiceName,
    additionalServiceDescription: data.additionalServiceDescription,
    additionalServicesType: data.additionalServiceType,
    additionalServicesOptionType: data.additionalServiceOptionType,
    cost: data.cost,
    quantity: data.quantity,
  };
}
