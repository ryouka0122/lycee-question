import { createApiClient } from "@/clients/api/ApiClient";
import { ApiClient } from "@/clients/api/base/api_client";
import type { UserGetResponse } from "../../types/api.ts";
import type { AxiosResponse } from "axios";

export class UserClient {
  endpoint = "/user";

  // APIクライアント
  client: ApiClient;

  constructor() {
    this.client = createApiClient();
  }

  async publishId(): Promise<AxiosResponse<UserGetResponse>> {
    return this.client.post(this.endpoint, {}, {});
  }
}
