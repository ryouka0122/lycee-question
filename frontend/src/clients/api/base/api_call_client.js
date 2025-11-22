import axios from 'axios'
import ApiClient from '@/clients/api/base/api_client'
import { HEADER_KEY } from '@/constants'
import {AppConfig} from "@/config/env";

class ApiCallClient extends ApiClient {
  client
  hook

  constructor (client, hook) {
    super()
    this.client = client
    this.hook = hook
  }

  async get(endpoint, params, headers) {
    return this.client.get(endpoint, {
      params: params,
      headers: headers
    })
  }

  async post(endpoint, params, headers) {
    return this.client.post(endpoint, params, {
      headers: headers
    })
  }
}

// API呼び出しモードでのaxios設定
const axiosClient = (function() {
  const headers = {
    "Content-Type": "application/json"
  }
  headers[HEADER_KEY.API_KEY] = AppConfig.qesApiKey

  return axios.create({
    baseURL: AppConfig.apiBaseUrl,
    headers: headers
  })
})()

function createApiClient(hook) {
  return new ApiCallClient(axiosClient, hook)
}

export {
  createApiClient
}
