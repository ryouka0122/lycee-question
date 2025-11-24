import type {
  AnswerId,
  QuestionId,
  QuestionType,
  SpaceId,
  UserId,
} from "./common.ts";

// ===========================================
// User API
export type UserGetResponse = {
  userId: UserId;
};

export type UserRegisterResponse = {
  userId: UserId;
};

// ===========================================
// Space API
export type SpaceGetOneResponse = {
  id: SpaceId;
  ownerId: UserId;
  name: string;
  openedTime: Date;
  closeTime: Date;
};
export type SpaceInfo = {
  id: SpaceId;
  ownerId: UserId;
  name: string;
  openedTime: Date;
  closeTime: Date;
};

export type SpaceGetListResponse = {
  spaces: SpaceInfo[];
};

export type SpacePostRequest = {
  name: string;
  closeTime: Date;
};

export type SpacePostResponse = {
  spaceId: SpaceId;
};

// ===========================================
// Question API
export type QuestionAnswerInfo = {
  answerId: AnswerId;
  no: number;
  description: string;
  isAnswered: boolean;
};

export type QuestionInfo = {
  spaceId: SpaceId;
  questionId: QuestionId;
  order: number;
  type: QuestionType;
  description: string;
  endTime: Date;
  answers: QuestionAnswerInfo[];
};

export type QuestionGetResponse = {
  questions: QuestionInfo[];
};

export type QuestionPostRequest = {
  type: QuestionType;
  description: string;
  endTime: Date;
  answers: string[];
};

// ===========================================
// Answer API
export type AnswerInfo = {
  questionId: QuestionId;
  answerId: AnswerId;
  no: number;
  description: string;
};

export type AnswerHistoryInfo = {
  userId: UserId;
  questionId: QuestionId;
  answers: AnswerId[];
};

export type AnswerAllGetResponse = {
  history: AnswerHistoryInfo[];
};

export type AnswerGetResponse = {
  answers: AnswerInfo[];
  selectedAnswerId: AnswerId[];
};

export type AnswerSummaryInfo = {
  questionId: QuestionId;
  answers: Record<AnswerId, number>;
};

export type AnswerSummaryResponse = {
  history: AnswerSummaryInfo[];
};
