import type { AnswerId, QuestionId, UserId } from "./common.ts";

export type AnswerSummaryEntity = {
  questionId: QuestionId;
  answers: Record<AnswerId, number>;
};

export type AnswerResultEntity = {
  userId: UserId;
  questionId: QuestionId;
  answers: AnswerId[];
};

export type AnswerHistoryEntity = AnswerSummaryEntity | AnswerResultEntity;
