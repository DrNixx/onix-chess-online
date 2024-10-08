/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_USER_ID: string | number;
    readonly VITE_USER_API_TOKEN: string;
    readonly VITE_API_URL: string;
    readonly VITE_WS_HOST: string;
    readonly VITE_WS_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
