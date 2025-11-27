export type UserId = string;
export type SpaceId = string;
export type QuestionId = string;
export type AnswerId = string;

export type QuestionType = string;

// ===========================================
// APIの型とは別のフロント側共通型
export type Ok<T> = {
  ok: true;
  data: T;
};

export type Err = {
  ok: false;
  errorCode: string;
  message: string;
};

export type Result<T> = Ok<T> | Err;
