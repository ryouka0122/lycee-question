const env = import.meta.env;

export const AppConfig = {
  mode: env.MODE as "mock" | "dev" | "stg" | "prod",
  isDev: env.DEV,
  isProd: env.PROD,

  apiMode: env.VITE_API_MODE as "mock" | "http",
  apiBaseUrl: env.VITE_API_BASE_URL,
  qesApiKey: env.VITE_QES_API_KEY,
  websocketEndpoint: env.VITE_WEBSOCKET_ENDPOINT,
} as const;
