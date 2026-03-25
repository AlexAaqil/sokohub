// This tells TypeScript about Vite's environment variables.

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_LOGO_FIRST: string;
  readonly VITE_APP_LOGO_SECOND: string;
  readonly VITE_APP_USE_SPLIT_LOGO: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}