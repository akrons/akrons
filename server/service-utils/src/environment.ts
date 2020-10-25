import { ITimeSpan } from './time-span';
import { loadConfiguration } from '@akrons/configuration';
import type * as yargs from '@akrons/configuration/node_modules/@types/yargs/index';
export interface IEnvironment {
    /**
     * Is the app currently running in debug environment.
     *
     * @type {boolean}
     * @memberof IEnvironment
     */
    isDebug: boolean;
    /**
     * Collection of all api-configs.
     *
     * @memberof IEnvironment
     */
    api: {
        auth: IApiDef & IApiDefMongo & IApiDefRedis,
    };
    /**
     * Time which an auth token's validity should last.
     *
     * @type {ITimeSpan}
     * @memberof IEnvironment
     */
    defaultTokenValidity: ITimeSpan;
    /**
     * Time how long an auth token can be refreshed.
     *
     * @type {ITimeSpan}
     * @memberof IEnvironment
     */
    defaultTokenRenewability: ITimeSpan;
}

/**
 * Config of an api
 *
 * @export
 * @interface IApiDef
 */
export interface IApiDef {
    /**
     * Route to reach the service
     *
     * @type {string}
     * @memberof IApiDef
     */
    route: string;
    /**
     * Name of the service.
     * Correlates to the name of the service in the docker-compose file.
     * The name is also used for determining the internal docker dns of the service.
     *
     * @type {string}
     * @memberof IApiDef
     */
    name: string;
    /**
     * Port on which the service is reachable
     *
     * @type {number}
     * @memberof IApiDef
     */
    port: number;
    /**
     * Defines if the service reachable from outside the docker-network.
     *
     * @type {boolean}
     * @memberof IApiDef
     */
    isPublic: boolean;
}

/**
 * Addition to the IApiDef interface for a mongo connection string.
 *
 * @export
 * @interface IApiDefMongo
 */
export interface IApiDefMongo {
    /**
     * connection-string to the mongodb of the service.
     *
     * @type {string}
     * @memberof IApiDefMongo
     */
    mongoDb: string;
}

/**
 * Addition to the IApiDef interface for a redis connection.
 *
 * @export
 * @interface IApiDefRedis
 */
export interface IApiDefRedis {
    /**
     * connection config to the redis of the service.
     *
     * @type {{
     *         url: string,
     *         port?: number,
     *     }}
     * @memberof IApiDefRedis
     */
    redis: {
        url: string,
        port?: number,
    };
}



export class Environment {
    private static instance: Environment | undefined;
    private constructor(
        public environment: IEnvironment,
    ) { }
    static async read(): Promise<IEnvironment> {
        if (!Environment.instance) {
            const environment = await loadConfiguration<IEnvironment>(
                builder => {
                    let configurations: any = builder
                        .option('isDebug', {
                            type: 'boolean',
                            default: false,
                        })
                        .option('api.auth.route', {
                            type: 'string',
                            demandOption: true
                        })
                        .option('api.auth.name', {
                            type: 'string',
                            demandOption: true
                        })
                        .option('api.auth.port', {
                            type: 'number',
                            demandOption: true
                        })
                        .option('api.auth.isPublic', {
                            type: 'boolean',
                            demandOption: true
                        })
                        .option('api.auth.mongoDb', {
                            type: 'string',
                            demandOption: true
                        })
                        .option('api.auth.redis.url', {
                            type: 'string',
                            demandOption: true
                        })
                        .option('api.auth.redis.port', {
                            type: 'number'
                        })
                    configurations = Environment.buildTimeSpanParameters(configurations, 'defaultTokenValidity', true)
                    configurations = Environment.buildTimeSpanParameters(configurations, 'defaultTokenRenewability', true)
                    return configurations;
                }
            );
            Environment.instance = new Environment(environment);
        }
        return Environment.instance.environment;
    }
    static get(): IEnvironment {
        if (!Environment.instance) {
            throw new Error("Environment is not loaded. Please call load first!");
        }
        return Environment.instance.environment;
    }


    static buildTimeSpanParameters<T>(yargs: yargs.Argv<any>, selector: string, required?: boolean): yargs.Argv<any> {
        return yargs
            .option(`${selector}.seconds`, {
                type: 'number'
            })
            .option(`${selector}.min`, {
                type: 'number'
            })
            .option(`${selector}.hours`, {
                type: 'number'
            })
            .option(`${selector}.days`, {
                type: 'number'
            })
            .option(`${selector}.month`, {
                type: 'number'
            })
            .option(`${selector}.years`, {
                type: 'number'
            })
            .check(args => {
                if (required) {
                    if (args[`${selector}.seconds`]) return;
                    if (args[`${selector}.min`]) return;
                    if (args[`${selector}.hours`]) return;
                    if (args[`${selector}.days`]) return;
                    if (args[`${selector}.month`]) return;
                    if (args[`${selector}.years`]) return;
                    throw new Error(`the option '${selector}' requires at least one of the entities [seconds, min, hours, days, month, years]!`);
                }
            });
    }
}
