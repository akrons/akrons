
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
    isPublic:boolean;
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
