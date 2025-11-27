import { createApiClient } from "@/clients/api/ApiClient";
import { HEADER_KEY } from "@/constants";
import { formatDate } from "@/utils";
import type { ApiClient } from "./base/api_client.ts";
import type {
  QuestionType,
  Result,
  SpaceId,
  UserId,
} from "../../types/common.ts";
import type { QuestionGetResponse } from "../../types/api.ts";
import type { QuestionEntity } from "../../types/QuestionEntity.ts";
import { QUESTION_TYPE } from "../../constants.ts";
import { parseDate } from "../../utils.ts";

export class QuestionClient {
  base_endpoint = "/question";

  // APIエンドポイント
  endpoint: string;
  // APIクライアント
  client: ApiClient;
  // ユーザID
  userId: UserId;

  constructor(userId: UserId, spaceId: SpaceId) {
    this.client = createApiClient();
    this.userId = userId;
    this.endpoint = `${this.base_endpoint}/${spaceId}`;
  }

  async readAll(): Promise<Result<QuestionEntity[]>> {
    return this.client
      .get<QuestionGetResponse, object>(this.endpoint, {}, this.createHeader())
      .then((response) => {
        if (response.status !== 200) {
          return {
            ok: false,
            errorCode: "E-Q999",
            message: "failed fetch question information",
          };
        }
        const questionList = response.data.questions.map((it) => {
          return {
            id: it.questionId,
            type: it.type,
            content: it.description,
            answers: it.answers.map((a) => {
              return {
                id: a.answerId,
                description: a.description,
              };
            }),
            isMultiple: it.type === QUESTION_TYPE.MULTIPLE,
            closeTime: parseDate(it.endTime)!,
          };
        });

        return {
          ok: true,
          data: questionList,
        };
      });
  }

  async create(
    questionType: QuestionType,
    description: string,
    answers: string[],
    closeTime: Date,
  ): Promise<Result<string>> {
    return this.client
      .post(
        this.endpoint,
        {
          type: questionType,
          description: description,
          answers: answers,
          endTime: formatDate(closeTime),
        },
        this.createHeader(),
      )
      .then((response) => {
        if (response.status !== 200) {
          return {
            ok: false,
            errorCode: "E-Q999",
            message: "failed submit answer",
          };
        }
        return {
          ok: true,
          data: "ok",
        };
      });
  }

  createHeader() {
    const header: Record<string, string> = {};
    header[HEADER_KEY.USER_ID] = this.userId;
    return header;
  }
}
