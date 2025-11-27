import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { ApiClient } from "@/clients/api/base/api_client";
import { HEADER_KEY } from "@/constants";
import { AppConfig } from "@/config/env";

class ApiCallClient extends ApiClient {
  client: AxiosInstance;
  hook: object;

  constructor(client: AxiosInstance, hook: object) {
    super();
    this.client = client;
    this.hook = hook;
  }

  get<T, D>(
    endpoint: string,
    params: D,
    headers: Record<string, string>,
  ): Promise<AxiosResponse<T, D>> {
    return this.client.get(endpoint, {
      params: params,
      headers: headers,
    });
  }

  post<T, D>(
    endpoint: string,
    params: D,
    headers: Record<string, string>,
  ): Promise<AxiosResponse<T, D>> {
    return this.client.post(endpoint, params, {
      headers: headers,
    });
  }
}

// API呼び出しモードでのaxios設定
const axiosClient = (function (): AxiosInstance {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  headers[HEADER_KEY.API_KEY] = AppConfig.qesApiKey;

  return axios.create({
    baseURL: AppConfig.apiBaseUrl,
    headers: headers,
  });
})();

function createApiClient() {
  return new ApiCallClient(axiosClient, {});
}

export { createApiClient };
