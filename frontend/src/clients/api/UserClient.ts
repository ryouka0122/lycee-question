import { createApiClient } from "@/clients/api/ApiClient";
import { ApiClient } from "@/clients/api/base/api_client";
import type { UserRegisterResponse } from "../../types/api.ts";
import type { AxiosResponse } from "axios";
import type { Result, UserId } from "../../types/common.ts";

export type PublishIdResult = {
  userId: UserId;
};

export class UserClient {
  endpoint = "/user";

  // APIクライアント
  client: ApiClient;

  constructor() {
    this.client = createApiClient();
  }

  async publishId(): Promise<Result<PublishIdResult>> {
    return this.client
      .post<UserRegisterResponse, object>(this.endpoint, {}, {})
      .then((response: AxiosResponse<UserRegisterResponse>) => {
        if (response.status === 200) {
          return {
            ok: true,
            data: {
              userId: response.data.userId,
            },
          };
        } else {
          return {
            ok: false,
            errorCode: "E-U999",
            message: "Failure publish userId.",
          };
        }
      });
  }
}
