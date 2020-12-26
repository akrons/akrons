import { ITimeSpan } from './time-span';
import type * as yargs from '@akrons/configuration/node_modules/@types/yargs/index';
import { nestedDemandOption } from '@akrons/configuration';

export namespace Environment {
    export interface IDefaultEnvironment {
        serviceName: string;
        /**
         * Is the app currently running in debug environment.
         *
         * @type {boolean}
         * @memberof IEnvironment
         */
        isDebug: boolean;
        /**
         * Private key path of the service.
         */
        privateKeyPath: string;
        /**
         * Private key path of the service.
         */
        publicKeyPath: string;
        /**
         * url of the d4s service
         */
        d4s?: string;
        /**
         * Hostname on the service is listens on
         *
         * @type {number}
         * @memberof IApiDef
         */
        hostname: string;
        /**
         * Port on the service is listens on
         *
         * @type {number}
         * @memberof IApiDef
         */
        port: number;
        corsAll: boolean;
        log400Errors: boolean;
    }


    /**
     * Addition to the IApiDef interface for a mongo connection string.
     *
     * @export
     * @interface IApiDefMongo
     */
    export interface IMongoEnvironment {
        mongo: {
            /**
             * connection-string to the mongodb of the service.
             *
             * @type {string}
             * @memberof IApiDefMongo
             */
            mongoDb: string;
            /**
             * name of the database
             */
            database: string;
            /**
             * How long should the mongo client stay open before closing it.
             */
            clientDefaultDurability: ITimeSpan;
        }
    }

    /**
     * Addition to the IApiDef interface for a redis connection.
     *
     * @export
     * @interface IApiDefRedis
     */
    export interface IRedisEnvironment {
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

    export function buildDefaultEnvironmentParameters<T>(yargs: yargs.Argv<T>): yargs.Argv<T & IDefaultEnvironment> {
        return yargs
            .option('serviceName', {
                type: 'string',
                demandOption: true,
            })
            .option('isDebug', {
                type: 'boolean',
                default: false,
            })
            .option('privateKeyPath', {
                type: 'string',
                default: '/run/secrets/privatekey'
            })
            .option('publicKeyPath', {
                type: 'string',
                default: ''
            })
            .middleware(args => {
                if (!args.publicKeyPath) {
                    args.publicKeyPath = `/run/secrets/${args.serviceName}_publickey`;
                }
                return args;
            })
            .option('d4s', {
                type: 'string',
            })
            .option('hostname', {
                type: 'string',
                default: '0.0.0.0'
            })
            .option('port', {
                type: 'number',
                demandOption: true,
            })
            .option('corsAll', {
                type: 'boolean',
                default: false,
            })
            .option('log400Errors', {
                type: 'boolean',
                default: false,
            })
    }

    export function buildIMongoEnvironmentParameters<T>(yargs: yargs.Argv<T>): yargs.Argv<T & IMongoEnvironment> {
        return <any>buildTimeSpanParameters(
            yargs
                .option('mongo.mongoDb', {
                    type: 'string',
                    // demandOption: true,
                })
                .option('mongo.database', {
                    type: 'string',
                    // demandOption: true,
                })
                .check(nestedDemandOption('mongo.mongoDb'))
                .check(nestedDemandOption('mongo.database'))
            , 'mongo.clientDefaultDurability', false, { min: 5 });
    }

    export function buildIRedisEnvironmentParameters<T>(yargs: yargs.Argv<T>): yargs.Argv<T & IRedisEnvironment> {
        return <any>yargs
            .option('redis.url', {
                type: 'string',
                // demandOption: true
            })
            .option('redis.port', {
                type: 'number',
                default: 6379
            })
            .check(nestedDemandOption('redis.url'))
    }

    export function buildTimeSpanParameters<T, K extends string>(yargs: yargs.Argv<any>, selector: K, required?: boolean, defaultValue?: ITimeSpan): yargs.Argv<T & { [A in K]: ITimeSpan }> {
        return <any>yargs
            .option(`${selector}.seconds`, {
                type: 'number',
                default: defaultValue?.seconds,
            })
            .option(`${selector}.min`, {
                type: 'number',
                default: defaultValue?.min,
            })
            .option(`${selector}.hours`, {
                type: 'number',
                default: defaultValue?.hours,
            })
            .option(`${selector}.days`, {
                type: 'number',
                default: defaultValue?.days,
            })
            .option(`${selector}.month`, {
                type: 'number',
                default: defaultValue?.month,
            })
            .option(`${selector}.years`, {
                type: 'number',
                default: defaultValue?.years,
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
                return true;
            });
    }
}
