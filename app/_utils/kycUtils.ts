'use server';
import { z } from 'zod';
import { KYCAnswer, KYCQuestion, KYCQuestionType } from '../_types/KYCQuestionType';

/** Base interface for API responses */
interface BusinessResponse {
  isSuccess: boolean;
  errorMessage?: string;
}

/** Response interface for KYC questions fetch operation */
interface FetchKYCQuestionResponse extends BusinessResponse {
  data?: KYCQuestion[];
}

/** Response interface for KYC answers fetch operation */
interface FetchKYCAnswerResponse extends BusinessResponse {
  data?: KYCAnswer[];
}

/** Response interface for KYC submission operation */
interface SubmitKYCResponse extends BusinessResponse {
  validationErrors?: Record<string, string>;
}

/**
 * Gets the ID of the "Yes" answer for a given boolean question
 * @param questionId - The ID of the question to check
 * @param questions - Array of all KYC questions
 * @returns The ID of the "Yes" answer or null if not found
 */
function getYesAnswerId(questionId: number, questions: KYCQuestion[]): number | null {
  const question = questions.find(q => q.id === questionId);
  if (question?.type === KYCQuestionType.Boolean) {
    const yesAnswer = question.answers.find(a => a.answerText.toLowerCase().trim() === 'yes');
    return yesAnswer?.id ?? null;
  }
  return null;
}

/**
 * Determines if a question should be visible based on its parent question's answer
 * @param questionId - The ID of the question to check
 * @param formData - The current form data
 * @param questions - Array of all KYC questions
 * @returns Boolean indicating if the question should be visible
 */
function isQuestionVisible(questionId: number, formData: Record<string, any>, questions: KYCQuestion[]): boolean {
  const question = questions.find(q => q.id === questionId);
  if (!question?.parentQuestionId) return true;

  const parentAnswer = formData[`question_${question.parentQuestionId}`];
  const yesAnswerId = getYesAnswerId(question.parentQuestionId, questions);

  return String(parentAnswer) === String(yesAnswerId);
}

/**
 * Creates a dynamic Zod schema based on visible questions and their types
 * @param questions - Array of KYC questions
 * @param formData - Current form data used to determine visibility
 * @returns Zod schema object for form validation
 */
function createDynamicSchema(questions: KYCQuestion[], formData: Record<string, any>) {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  questions.forEach(question => {
    // Only add validation for visible questions
    if (isQuestionVisible(question.id, formData, questions)) {
      switch (question.type) {
        case KYCQuestionType.Select:
          schemaShape[`question_${question.id.toString()}`] = z.string().min(1, `${question.prompt} is required`);
          break;
        case KYCQuestionType.Boolean:
          schemaShape[`question_${question.id.toString()}`] = z.string().min(1, `${question.prompt} is required`);
          break;
        case KYCQuestionType.NumberText:
          schemaShape[`question_${question.id.toString()}`] = z
            .string()
            .min(1, `${question.prompt} is required`)
            .regex(/^\d+$/, 'Must be a valid number');
          break;
        case KYCQuestionType.MoneyText:
          schemaShape[`question_${question.id.toString()}`] = z
            .string()
            .min(1, `${question.prompt} is required`)
            .regex(/^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/, 'Must be a valid money amount');
          break;
        default:
          schemaShape[`question_${question.id.toString()}`] = z.string().optional();
          break;
      }
    }
  });

  console.log('Schema', schemaShape);
  return z.object(schemaShape);
}

/**
 * Submits KYC questionnaire answers to the server
 * @param formData - FormData object containing the questionnaire responses
 * @param questions - Array of KYC questions used for validation
 * @returns Promise resolving to a SubmitKYCResponse
 * @throws Will throw an error if the submission fails
 */
export async function SubmitKYCQuestions(formData: FormData, questions: KYCQuestion[]): Promise<SubmitKYCResponse> {
  try {
    // Convert formData to an object
    const formDataObj: Record<string, any> = {};

    formData.forEach((value, key) => {
      if (value === 'true') {
        formDataObj[key] = true;
      } else if (value === 'false') {
        formDataObj[key] = false;
      } else {
        formDataObj[key] = value;
      }
    });

    const dynamicSchema = createDynamicSchema(questions, formDataObj);
    dynamicSchema.parse(formDataObj);

    // Transform formDataObj to match KYCResponse shape, filtering out invisible questions
    const kycResponse = {
      ApplicantId: parseInt(formDataObj['applicantId'], 10),
      Answers: questions.map(question => {
        const isVisible = isQuestionVisible(question.id, formDataObj, questions);
        if (!isVisible) {
          return {
            Id: 0,
            QuestionId: question.id,
            IsActive: true,
            AnswerText: null,
          };
        }

        const value = formDataObj[`question_${question.id}`];

        if (question.type === KYCQuestionType.MoneyText || question.type === KYCQuestionType.NumberText) {
          return {
            Id: 0,
            QuestionId: question.id,
            IsActive: true,
            AnswerText: value.toString(),
          };
        }

        const selectedAnswer = question.answers.find(a => a.id === parseInt(value, 10));
        return {
          Id: parseInt(value, 10),
          QuestionId: question.id,
          IsActive: true,
          AnswerText: selectedAnswer?.answerText || '',
        };
      }),
    };
    // Send to API using fetch
    const response = await fetch(process.env.API_BASE_URL + '/api/KYC', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kycResponse),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to submit KYC answers:', errorText);
      throw new Error(`Failed to submit KYC answers: ${errorText}`);
    }

    return { isSuccess: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed', error);
      const errors = error.errors.reduce(
        (acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        },
        {} as Record<string, string>
      );

      return { isSuccess: false, validationErrors: errors, errorMessage: error.message };
    }

    return { isSuccess: false };
  }
}

/**
 * Fetches KYC questions from the server
 * @returns Promise resolving to a FetchKYCQuestionResponse
 * @throws Will throw an error if the fetch operation fails
 */
export async function fetchKYCQuestions(): Promise<FetchKYCQuestionResponse> {
  try {
    const response = await fetch(process.env.API_BASE_URL + '/api/KYC', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch KYC questions: ${errorText}`);
    }

    const responseData = await response.json();
    return { isSuccess: true, errorMessage: 'KYC questions fetched successfully', data: responseData.data };
  } catch (error) {
    console.error('Error fetching KYC questions', error);
    return { isSuccess: false, errorMessage: 'An error occurred while fetching KYC questions' };
  }
}

/**
 * Fetches KYC answers for a specific applicant
 * @param applicantId - The ID of the applicant whose answers to fetch
 * @returns Promise resolving to a FetchKYCAnswerResponse
 * @throws Will throw an error if the fetch operation fails
 */
export async function fetchKYCAnswers(applicantId: number): Promise<FetchKYCAnswerResponse> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/KYC/answers/${applicantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch KYC answers');
    }

    const responseData = await response.json();
    return { isSuccess: true, data: responseData.data };
  } catch (error) {
    console.error('Error fetching KYC answers', error);
    return { isSuccess: false, errorMessage: 'An error occurred while fetching KYC answers' };
  }
}
