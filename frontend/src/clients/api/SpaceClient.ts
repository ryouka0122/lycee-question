import { createApiClient } from "@/clients/api/ApiClient";
import { HEADER_KEY } from "@/constants";
import { formatDate } from "@/utils";
import type { ApiClient } from "./base/api_client.ts";
import type { Result, SpaceId, UserId } from "../../types/common.ts";
import type { AxiosResponse } from "axios";
import type {
  SpaceGetListResponse,
  SpaceGetOneResponse,
} from "../../types/api.ts";
import { SpaceEntity } from "../../types/SpaceEntity.ts";

type SpaceJoinStatus = "Joined" | "AlreadyJoined" | "Closed" | "Error";

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

  async readAll(): Promise<Result<SpaceEntity[]>> {
    return this.client
      .get<SpaceGetListResponse, object>(this.endpoint, {}, this.createHeader())
      .then((response) => {
        if (response.status !== 200) {
          return {
            ok: false,
            errorCode: "E-U999",
            message: "APIエラー",
          };
        }

        const spaceList = response.data.spaces.map(SpaceEntity.from);
        return {
          ok: true,
          data: spaceList,
        };
      });
  }

  async readOne(spaceId: SpaceId): Promise<Result<SpaceEntity>> {
    return this.client
      .get<
        SpaceGetOneResponse,
        object
      >(`${this.endpoint}/${spaceId}`, {}, this.createHeader())
      .then((response) => {
        if (response.status !== 200) {
          return {
            ok: false,
            errorCode: "E-U999",
            message: "スペース情報取得エラー",
          };
        }

        return {
          ok: true,
          data: SpaceEntity.from(response.data),
        };
      });
  }

  async create(name: string, closeTime: Date): Promise<Result<string>> {
    return this.client
      .post(
        this.endpoint,
        {
          name: name,
          closeTime: formatDate(closeTime),
        },
        this.createHeader(),
      )
      .then((response) => {
        if (response.status === 201) {
          return {
            ok: true,
            data: "",
          };
        } else {
          return {
            ok: false,
            errorCode: "E-S999",
            message: "Failure create space",
          };
        }
      });
  }

  async join(spaceId: SpaceId): Promise<Result<SpaceJoinStatus>> {
    return this.client
      .post(`${this.endpoint}/join/${spaceId}`, {}, this.createHeader())
      .then((response) => {
        switch (response.status) {
          case 200:
            return {
              ok: true,
              data: "Joined",
            };
          case 204:
            return {
              ok: true,
              data: "AlreadyJoined",
            };
          case 410:
            return {
              ok: true,
              data: "Closed",
            };
          default:
            return {
              ok: false,
              errorCode: "E-S999",
              message: "Failed space join",
            };
        }
      });
  }

  createHeader() {
    const header: Record<string, string> = {};
    header[HEADER_KEY.USER_ID] = this.userId;
    return header;
  }
}
