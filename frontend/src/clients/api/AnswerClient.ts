import { createApiClient } from "@/clients/api/ApiClient";
import { HEADER_KEY } from "@/constants";
import { ApiClient } from "@/clients/api/base/api_client";
import type {
  AnswerId,
  QuestionId,
  SpaceId,
  UserId,
} from "../../types/common.ts";
import type {
  AnswerAllGetResponse,
  AnswerSummaryResponse,
} from "../../types/api.ts";
import type { AxiosResponse } from "axios";

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

  async readAllInSpace(): Promise<AxiosResponse<AnswerAllGetResponse>> {
    return this.client.get(
      this.base_endpoint + "/all",
      {},
      this.createHeader(),
    );
  }

  async summaryInSpace(
    spaceId: SpaceId,
  ): Promise<AxiosResponse<AnswerSummaryResponse>> {
    return this.client.get(
      this.base_endpoint + `/summary/${spaceId}`,
      {},
      this.createHeader(),
    );
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
