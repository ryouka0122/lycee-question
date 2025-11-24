import { createApiClient } from "@/clients/api/ApiClient";
import { HEADER_KEY } from "@/constants";
import { formatDate } from "@/utils";
import type { ApiClient } from "./base/api_client.ts";
import type { SpaceId, UserId } from "../../types/common.ts";
import type {
  QuestionGetResponse,
  QuestionPostRequest,
} from "../../types/api.ts";
import type { AxiosResponse } from "axios";

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

  async readAll(): Promise<AxiosResponse<QuestionGetResponse>> {
    return this.client.get(this.endpoint, {}, this.createHeader());
  }

  async create(question: QuestionPostRequest): Promise<AxiosResponse<string>> {
    return this.client.post(
      this.endpoint,
      {
        type: question.type,
        description: question.description,
        answers: question.answers,
        endTime: formatDate(question.endTime),
      },
      this.createHeader(),
    );
  }

  createHeader() {
    const header: Record<string, string> = {};
    header[HEADER_KEY.USER_ID] = this.userId;
    return header;
  }
}
