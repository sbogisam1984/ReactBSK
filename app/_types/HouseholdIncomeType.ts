export interface HouseholdIncomeRange {
  id: number;
  range: string;
}

/**
 * Maps a formatted income range string to its corresponding HouseholdIncomeRange ID
 * @param formattedRange - Income range string in format "$X to $Y" or "Over $X"
 * @param ranges - Array of HouseholdIncomeRange objects with id and range properties
 * @returns matching range ID or undefined if no match found
 */
export const mapFormattedIncomeToRangeId = (
  formattedRange: string | undefined,
  ranges: HouseholdIncomeRange[]
): string | undefined => {
  if (!formattedRange) return undefined;

  // Normalize the input string by removing '$' and ',' and converting to lowercase
  const normalizedInput = formattedRange.toLowerCase().replace(/[\$,]/g, '');

  // Find matching range by normalizing and comparing each range string
  const matchingRange = ranges.find(range => {
    const normalizedRange = range.range.toLowerCase().replace(/[\$,]/g, '');
    return normalizedInput === normalizedRange;
  });

  return matchingRange?.id.toString();
};

/**
 * Gets the formatted range string for a given household income range ID
 * @param rangeId - Household income range ID
 * @param ranges - Array of HouseholdIncomeRange objects
 * @returns formatted range string or undefined if ID not found
 */
export const getFormattedIncomeRange = (
  rangeId: string | undefined,
  ranges: HouseholdIncomeRange[]
): string | undefined => {
  if (!rangeId) return undefined;

  const range = ranges.find(r => r.id.toString() === rangeId);
  return range?.range;
};
