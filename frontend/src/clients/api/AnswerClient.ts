import { createApiClient } from "@/clients/api/ApiClient";
import { HEADER_KEY } from "@/constants";
import { ApiClient } from "@/clients/api/base/api_client";
import type {
  AnswerId,
  QuestionId,
  Result,
  SpaceId,
  UserId,
} from "../../types/common.ts";
import type {
  AnswerAllGetResponse,
  AnswerSummaryResponse,
} from "../../types/api.ts";
import type { AxiosResponse } from "axios";
import type {
  AnswerResultEntity,
  AnswerSummaryEntity,
} from "../../types/AnswerHistoryEntity.ts";

export class AnswerClient {
  base_endpoint = "/answer";

  // APIクライアント
  client: ApiClient;
  // ユーザID
  userId: UserId;
  // スペースID
  spaceId: SpaceId;

  constructor(userId: UserId, spaceId: SpaceId) {
    this.client = createApiClient();
    this.userId = userId;
    this.spaceId = spaceId;
  }

  async readAllInSpace(): Promise<Result<AnswerResultEntity[]>> {
    return this.client
      .get<
        AnswerAllGetResponse,
        object
      >(this.base_endpoint + "/all", {}, this.createHeader())
      .then((response) => {
        if (response.status !== 200) {
          return {
            ok: false,
            errorCode: "E-A999",
            message: "Fail fetch question information",
          };
        }
        const resultList = response.data.history.map((e) => {
          return {
            userId: e.userId,
            questionId: e.questionId,
            answers: e.answers,
          } as AnswerResultEntity;
        });
        return {
          ok: true,
          data: resultList,
        };
      });
  }

  async summaryInSpace(
    spaceId: SpaceId,
  ): Promise<Result<AnswerSummaryEntity[]>> {
    return this.client
      .get<
        AnswerSummaryResponse,
        object
      >(this.base_endpoint + `/summary/${spaceId}`, {}, this.createHeader())
      .then((response) => {
        if (response.status !== 200) {
          return {
            ok: false,
            errorCode: "E-A999",
            message: "Fail fetch question information",
          };
        }
        const summaryList = response.data.history.map((e) => {
          return {
            questionId: e.questionId,
            answers: e.answers,
          } as AnswerSummaryEntity;
        });
        return {
          ok: true,
          data: summaryList,
        };
      });
  }

  async answer(
    questionId: QuestionId,
    answers: AnswerId[],
  ): Promise<AxiosResponse<string, AnswerId[]>> {
    return this.client.post(
      this.createEndpoint(questionId),
      answers,
      this.createHeader(),
    );
  }

  createEndpoint(questionId: QuestionId): string {
    return `${this.base_endpoint}/${questionId}`;
  }

  createHeader(): Record<string, string> {
    const header: Record<string, string> = {};
    header[HEADER_KEY.USER_ID] = this.userId;
    header[HEADER_KEY.SPACE_ID] = this.spaceId;
    return header;
  }
}
