
import { createApiClient as jsonLoad_createApiClient} from '@/clients/api/base/json_load_client'
import { createApiClient as apiCall_createApiClient} from '@/clients/api/base/api_call_client'

// APIモードのリスト
const envClientList = {
  local: jsonLoad_createApiClient,
  api: apiCall_createApiClient
}

const _createApiClient = (function () {
  if ("VUE_APP_API_MODE" in import.meta.env) {
    return envClientList[import.meta.env.VUE_APP_API_MODE];
  }
  return apiCall_createApiClient;
})();

export {
  _createApiClient as createApiClient
}
