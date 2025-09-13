/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Declare Hot Module Replacement API
declare module '*.css' {
  const content: string
  export default content
}

// Declare module for imports
declare module '*.js' {
  const content: any
  export default content
}