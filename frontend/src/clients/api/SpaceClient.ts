import { createApiClient } from "@/clients/api/ApiClient";
import { HEADER_KEY } from "@/constants";
import { formatDate } from "@/utils";
import type { ApiClient } from "./base/api_client.ts";
import type { SpaceId, UserId } from "../../types/common.ts";
import type { AxiosResponse } from "axios";
import type {
  SpaceGetListResponse,
  SpaceGetOneResponse,
  SpacePostRequest,
  SpacePostResponse,
} from "../../types/api.ts";

export class SpaceClient {
  endpoint = "/space";

  // APIクライアント
  client: ApiClient;
  // ユーザID
  userId: UserId;

  constructor(userId: UserId) {
    this.client = createApiClient();
    this.userId = userId;
  }

  async readAll(): Promise<AxiosResponse<SpaceGetListResponse>> {
    return this.client.get(this.endpoint, {}, this.createHeader());
  }

  async readOne(spaceId: SpaceId): Promise<AxiosResponse<SpaceGetOneResponse>> {
    return this.client.get(
      `${this.endpoint}/${spaceId}`,
      {},
      this.createHeader(),
    );
  }

  async create(
    info: SpacePostRequest,
  ): Promise<AxiosResponse<SpacePostResponse>> {
    return this.client.post(
      this.endpoint,
      {
        name: info.name,
        closeTime: formatDate(info.closeTime),
      },
      this.createHeader(),
    );
  }

  async join(spaceId: SpaceId): Promise<AxiosResponse<string>> {
    return this.client.post(
      `${this.endpoint}/join/${spaceId}`,
      {},
      this.createHeader(),
    );
  }

  createHeader() {
    const header: Record<string, string> = {};
    header[HEADER_KEY.USER_ID] = this.userId;
    return header;
  }
}
