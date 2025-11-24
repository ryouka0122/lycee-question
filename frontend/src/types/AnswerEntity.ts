import type { AnswerId } from "./common.ts";

export class AnswerEntity {
  // 回答ID
  id: AnswerId;
  // 内容
  text: string;

  constructor(id: AnswerId, text: string) {
    this.id = id;
    this.text = text;
  }
}
