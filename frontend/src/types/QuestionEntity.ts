import type { QuestionId, QuestionType } from "./common.ts";
import type { AnswerEntity } from "./AnswerEntity.ts";

export type QuestionEntity = {
  // 質問ID
  id: QuestionId;

  // 質問タイプ
  type: QuestionType;

  // 質問内容
  content: string;

  // 回答群
  answers: AnswerEntity[];

  // 複数回答フラグ
  isMultiple: boolean;

  // 回答期限
  closeTime: Date;
};
