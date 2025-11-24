/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_MODE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_SSE_BASE_URL: string
  readonly VITE_QES_API_KEY: string
  readonly VITE_APP_FIXED_DATE: string
  readonly VITE_DUMMY_USER_ID: string
}

interface ImportMeta {
  readonly env:ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
