
import { createApiClient as jsonLoad_createApiClient} from '@/clients/api/base/json_load_client'
import { createApiClient as apiCall_createApiClient} from '@/clients/api/base/api_call_client'
import {AppConfig} from "@/config/env";

// APIモードのリスト
const envClientList = {
  mock: jsonLoad_createApiClient,
  http: apiCall_createApiClient
}

const _createApiClient = (function () {
  if (AppConfig.apiMode) {
    return envClientList[AppConfig.apiMode];
  }
  return apiCall_createApiClient;
})();

export {
  _createApiClient as createApiClient
}
