export enum KYCQuestionType {
  Select,
  Boolean,
  NumberText,
  MoneyText,
}

export interface KYCQuestion {
  id: number;
  prompt: string;
  type: KYCQuestionType;
  isActive: boolean;
  answers: KYCAnswer[];
  parentQuestionId?: number;
}

export interface KYCAnswer {
  id: number;
  questionId: number;
  answerText: string;
  customAnswer?: string;
}

export interface KYCApplicantResponse {
  id: number;
  customAnswer?: string;
  questionId: number;
  answerId: number;
}
