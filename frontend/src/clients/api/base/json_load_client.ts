/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { ApiClient } from "@/clients/api/base/api_client";
import { AppConfig } from "@/config/env";

class JsonLoadClient extends ApiClient {
  client: AxiosInstance;
  hook: object;

  userId: string;

  constructor(client: AxiosInstance, hook: object, userId: string) {
    super();
    this.client = client;
    this.hook = hook;
    this.userId = userId;
  }

  #request<T, D>(
    method: string,
    endpoint: string,
  ): Promise<AxiosResponse<T, D>> {
    const path = this.createJsonPath(endpoint, method + ".json");
    return this.client.get("/" + path);
  }

  get<T, D>(
    endpoint: string,
    params: D,
    headers: Record<string, string>,
  ): Promise<AxiosResponse<T, D>> {
    return this.#request("get", endpoint);
  }

  post<T, D>(
    endpoint: string,
    params: D,
    headers: Record<string, string>,
  ): Promise<AxiosResponse<T, D>> {
    return this.#request("post", endpoint);
  }

  put<T, D>(
    endpoint: string,
    params: D,
    headers: Record<string, string>,
  ): Promise<AxiosResponse<T, D>> {
    return this.#request("put", endpoint);
  }

  delete<T, D>(
    endpoint: string,
    params: D,
    headers: Record<string, string>,
  ): Promise<AxiosResponse<T, D>> {
    return this.#request("delete", endpoint);
  }

  createJsonPath(...args: string[]) {
    return args
      .map((str) => (str.charAt(0) === "/" ? str.substring(1) : str))
      .map((str) =>
        str.charAt(str.length - 1) === "/" ? str.substring(1) : str,
      )
      .reduce((url, str) => {
        return url + "/" + str;
      });
  }
}

// ローカル開発モードでのaxios設定
const axiosClient = axios.create({
  baseURL: AppConfig.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export function createApiClient() {
  return new JsonLoadClient(axiosClient, {}, AppConfig.dummyUserId);
}
