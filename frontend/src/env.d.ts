/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_MODE: string,
  readonly VITE_API_BASE_URL: string,
  readonly VITE_WEBSOCKET_ENDPOINT: string,
  readonly VITE_QES_API_KEY: string
  readonly VITE_APP_FIXED_DATE: string
}

interface ImportMeta {
  readonly env:ImportMetaEnv
}
