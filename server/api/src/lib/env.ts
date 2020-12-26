import { loadConfiguration } from '@akrons/configuration';

export interface IEnv {
    CORS_ALL: string;
    HOST: string;
    PORT: string;
    CALLBACK_URL: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    TENANT_ID: string;
    TOKEN_HOST: string;
    AUTHORIZE_PATH: string;
    TOKEN_PATH: string;
    USER_SCOPE: string;
    REDIS_URL: string;
    PUBLIC_KEY_FILE_PATH: string;
    // PRIVATE_KEY_FILE_PATH: string;
    ROOT_ADMIN: string;
    FILES_DIR: string;
    SERMON_SUB_DIR: string;
    /**
     * Time to live for cached calendar events.
     */
    CALENDAR_EVENT_TTL?: number;
    LOG_400_ERRORS?: boolean;
    FORBID_ROBOTS?: boolean;
    MONGO_DB_NAME?: string;
    MONGO_URL?: string;
    STORAGE_BYTE_LIMIT?: string;
    DISABLE_AUTHORIZATION?: boolean;
    DEFAULT_PERMISSIONS: string[];
    D4S?: string;
    SERVICE_NAME: string;
    AUTH_SERVICE_NAME: string;
}

let environment: IEnv | undefined;

export function getEnvironment(): IEnv {
    if (!environment) {
        throw new Error('environment is not loaded. Please call loadEnvironment first!');
    }
    return environment;
}

export async function loadEnvironment(): Promise<void> {
    environment = await loadConfiguration(
        builder => builder
            .option('CORS_ALL', { type: 'string', demandOption: true })
            .option('HOST', { type: 'string', default: "0.0.0.0" })
            .option('PORT', { type: 'string', demandOption: true })
            .option('CALLBACK_URL', { type: 'string', demandOption: true })
            .option('CLIENT_ID', { type: 'string', demandOption: true })
            .option('CLIENT_SECRET', { type: 'string', demandOption: true })
            .option('TENANT_ID', { type: 'string', demandOption: true })
            .option('TOKEN_HOST', { type: 'string', demandOption: true })
            .option('AUTHORIZE_PATH', { type: 'string', demandOption: true })
            .option('TOKEN_PATH', { type: 'string', demandOption: true })
            .option('USER_SCOPE', { type: 'string', demandOption: true })
            .option('REDIS_URL', { type: 'string', demandOption: true })
            .option('PUBLIC_KEY_FILE_PATH', { type: 'string', demandOption: true })
            // .option('PRIVATE_KEY_FILE_PATH', { type: 'string', demandOption: true })
            .option('ROOT_ADMIN', { type: 'string', demandOption: true })
            .option('FILES_DIR', { type: 'string', demandOption: true })
            .option('SERMON_SUB_DIR', { type: 'string', demandOption: true })
            .option('CALENDAR_EVENT_TTL', { type: 'number' })
            .option('LOG_400_ERRORS', { type: 'boolean' })
            .option('FORBID_ROBOTS', { type: 'boolean' })
            .option('MONGO_DB_NAME', { type: 'string' })
            .option('MONGO_URL', { type: 'string' })
            .option('STORAGE_BYTE_LIMIT', { type: 'string' })
            .option('D4S', { type: 'string' })
            .option('SERVICE_NAME', { type: 'string', demandOption: true })
            .option('AUTH_SERVICE_NAME', { type: 'string', demandOption: true })
            .option('DISABLE_AUTHORIZATION', { type: 'boolean' })
            .option('DEFAULT_PERMISSIONS', { type: 'array', default: ['api.common.*', 'api.config', 'api.auth'] })
    )
}
