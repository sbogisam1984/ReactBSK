/**
 * Formats a string into a Social Security Number (SSN) pattern (XXX-XX-XXXX).
 * Removes all non-digit characters and applies proper hyphenation.
 *
 * @param value - The input string to be formatted as an SSN
 * @returns The formatted SSN string in XXX-XX-XXXX format, partially formatted if incomplete, or empty string if no valid input
 *
 * @example
 * formatSSN('123456789') // returns '123-45-6789'
 * formatSSN('12345') // returns '123-45'
 * formatSSN('123') // returns '123'
 * formatSSN('') // returns ''
 */
export const formatSSN = (value: string) => {
  const input = value.replace(/\D/g, ''); // Remove all non-digit characters
  const ssn = input.substring(0, 9); // Limit to 9 digits

  const part1 = ssn.substring(0, 3);
  const part2 = ssn.substring(3, 5);
  const part3 = ssn.substring(5, 9);

  if (part3) {
    return `${part1}-${part2}-${part3}`;
  } else if (part2) {
    return `${part1}-${part2}`;
  } else if (part1) {
    return part1;
  }

  return '';
};

/**
 * Formats a string value as US currency (USD).
 *
 * @param value - The string value to format. All non-digit characters will be removed before formatting.
 * @returns A formatted string representing the value in USD currency format (e.g., "$1,234")
 *
 * @example
 * formatCurrency("1234") // Returns "$1,234"
 * formatCurrency("12.34") // Returns "$12"
 * formatCurrency("abc123") // Returns "$123"
 * formatCurrency("") // Returns "$0"
 */
export const formatCurrency = (value: string) => {
  const numberValue = value.replace(/\D/g, ''); // Remove all non-digit characters
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(parseInt(numberValue) || 0); // Divide by 100 to shift decimal point

  return formattedValue;
};

/**
 * Formats a date string into YYYY-MM-DD format suitable for HTML date input fields
 * @param dateString - The date string to format, or undefined
 * @returns A date string in YYYY-MM-DD format, or an empty string if input is undefined
 * @example
 * formatDateForInput("2023-12-25T12:00:00Z") // Returns "2023-12-25"
 * formatDateForInput(undefined) // Returns ""
 */
export const formatDateForInput = (dateString: string | undefined) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Formats a phone number string into a standardized US phone number format.
 *
 * @param value - The input phone number string to format.
 * @returns A formatted phone number string in the format "(XXX) XXX-XXXX" or partial format based on input length.
 *
 * @example
 * formatPhoneNumber("1234567890") // returns "(123) 456-7890"
 * formatPhoneNumber("123456") // returns "(123) 456"
 * formatPhoneNumber("123") // returns "123"
 */
export const formatPhoneNumber = (value: string) => {
  const phoneNumber = value.replace(/\D/g, ''); // Remove all non-digit characters
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

/**
 * Removes all non-numeric characters from a string
 * @param value - The input string
 * @returns A string containing only numbers
 * @example
 * formatNumber("123abc") // Returns "123"
 * formatNumber("$1,234") // Returns "1234"
 */
export const formatNumber = (value: string) => {
  return value.replace(/\D/g, '');
};
