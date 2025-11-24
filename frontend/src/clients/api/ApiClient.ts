import { createApiClient as jsonLoad_createApiClient } from "@/clients/api/base/json_load_client";
import { createApiClient as apiCall_createApiClient } from "@/clients/api/base/api_call_client";
import { AppConfig } from "@/config/env";
import { ApiClient } from "@/clients/api/base/api_client";

// APIモードのリスト
const envClientList = {
  mock: jsonLoad_createApiClient,
  http: apiCall_createApiClient,
  default: apiCall_createApiClient,
};

const apiClientCreator =
  envClientList[AppConfig.apiMode] ?? apiCall_createApiClient;

function _createApiClient(): ApiClient {
  return apiClientCreator();
}

export { _createApiClient as createApiClient };
