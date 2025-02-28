'use server';

import { revalidatePath } from 'next/cache';
import { EnrollmentPageEnum, TransactionTypeEnum } from '../_types/EnrollmentInfo';
import { GetEnrollment, UpdateEnrollmentKeyValue } from './enrollmentUtils';
import { Log } from './logUtils';

export async function getCurrentPage() {
  const enrollment = await GetEnrollment();

  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  const currentPage = enrollment.data.currentPage;

  return currentPage ?? 0;
}

/**
 * Sets the current page in the enrollment process and logs the page change.
 *
 * @param {EnrollmentPageEnum} value - The enum value representing the current page.
 * @param {Record<string, any>} [additionalValues] - Optional object containing additional key-value pairs to be included in the log.
 * @returns {Promise<void>}
 *
 * @example
 * // Set page without additional values
 * await setCurrentPage(EnrollmentPageEnum.PersonalInfo);
 *
 * @example
 * // Set page with additional values
 * await setCurrentPage(EnrollmentPageEnum.ReviewApplication, { userId: '123', timestamp: Date.now() });
 */
export async function setCurrentPage(value: EnrollmentPageEnum, additionalValues?: Record<string, any>) {
  await UpdateEnrollmentKeyValue({
    key: 'CurrentPage',
    value: value.toString(),
  });

  const logData = {
    page: EnrollmentPageEnum[value as EnrollmentPageEnum],
    ...additionalValues,
  };

  await Log(TransactionTypeEnum.PageLoad, JSON.stringify(logData));
}
