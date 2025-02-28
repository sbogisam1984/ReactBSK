export enum IdentificationTypeEnum {
  DriversLicense = "Driver's License",
  StateIssuedId = 'State Issued Id',
  MilitaryId = 'Military Id',
  Passport = 'Passport',
}

/**
 * Maps a string value to its corresponding IdentificationTypeEnum value.
 * First attempts to match the string directly with enum values, then with enum keys.
 * If no match is found, returns IdentificationTypeEnum.DriversLicense as default.
 *
 * @param type - The string value to map to an IdentificationTypeEnum
 * @returns The matched IdentificationTypeEnum value or IdentificationTypeEnum.DriversLicense if no match found
 *
 * @example
 * // Returns IdentificationTypeEnum.DriversLicense
 * mapIdentificationType('DriversLicense')
 */
export const mapIdentificationType = (type: string | undefined): IdentificationTypeEnum => {
  const enumValues = Object.values(IdentificationTypeEnum);
  const enumKeys = Object.keys(IdentificationTypeEnum);

  const matchedValue = enumValues.find(value => value === type);
  if (matchedValue) return matchedValue;

  const matchedKey = enumKeys.find(key => key === type);
  if (matchedKey) return IdentificationTypeEnum[matchedKey as keyof typeof IdentificationTypeEnum];

  return IdentificationTypeEnum.DriversLicense; // Default value
};
