import type {QuestionId, QuestionType} from "./common.ts";
import type {AnswerEntity} from "./AnswerEntity.ts";

export class QuestionEntity {
  // 質問ID
  id: QuestionId

  // 質問タイプ
  type: QuestionType

  // 質問内容
  content: string

  // 回答群
  answers: AnswerEntity[]

  // 複数回答フラグ
  isMultiple: boolean

  // 回答期限
  closeTime: Date

  constructor (
    id: QuestionId,
    type: QuestionType,
    content: string,
    answers: AnswerEntity[],
    isMultiple: boolean,
    closeTime: Date) {

    this.id = id
    this.type = type
    this.content = content
    this.answers = answers
    this.isMultiple = isMultiple
    this.closeTime = closeTime
  }
}

