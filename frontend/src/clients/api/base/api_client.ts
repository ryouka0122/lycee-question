/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AxiosResponse } from "axios";

export class ApiClient {
  get<T, D>(
    endpoint: string,
    params: D,
    headers: Record<string, string>,
  ): Promise<AxiosResponse<T, D>> {
    throw new Error("Method not implemented.");
  }

  post<T, D>(
    endpoint: string,
    params: D,
    headers: Record<string, string>,
  ): Promise<AxiosResponse<T, D>> {
    throw new Error("Method not implemented.");
  }

  put<T, D>(
    endpoint: string,
    params: D,
    headers: Record<string, string>,
  ): Promise<AxiosResponse<T, D>> {
    throw new Error("Method not implemented.");
  }

  delete<T, D>(
    endpoint: string,
    params: D,
    headers: Record<string, string>,
  ): Promise<AxiosResponse<T, D>> {
    throw new Error("Method not implemented.");
  }
}
