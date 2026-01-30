/// <reference types="vite/client" />

// tsc 빌드 시 import.meta.env 인식용 (서버 빌드 환경 대비)
interface ImportMetaEnv {
  readonly DEV: boolean
  readonly MODE: string
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
