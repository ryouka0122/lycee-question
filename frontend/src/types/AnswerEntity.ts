import type { AnswerId } from "./common.ts";

export type AnswerEntity = {
  // 回答ID
  id: AnswerId;
  // 内容
  description: string;
};
