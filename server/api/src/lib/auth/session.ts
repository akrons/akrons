import { Db } from 'mongodb';
import * as redis from 'redis';
import { promisify } from 'util';
import { getUserOAuthToken } from './user-auth';
import { getAuthenticatedGraphClient } from '../graph/graph-client';
import { GraphInterfaces } from '../graph/interfaces';
import { getApiOauthToken } from './api-auth';
import { createUserToken, IUserToken, ICertifiedUserToken, signUserToken } from './user-token';
import { AccessToken, Token } from 'simple-oauth2';
import { getOauthClient } from './oauth-client';
import { Permissions } from '../collections/permissions';
import { getEnvironment } from '../env';

export async function createUserSession(code: string): Promise<ICertifiedUserToken> {
    let userAuthToken = await getUserOAuthToken(code);
    let graphClient = getAuthenticatedGraphClient(userAuthToken);
    let userDetails: GraphInterfaces.IUserInfo = await graphClient.api('/me').get();
    let permissions = await Permissions.getInstance().loadUserPermissions(userDetails);

    let unsignedUserToken = createUserToken({
        userId: userDetails.id,
        displayName: userDetails.displayName,
        permissions: permissions,
        userPrincipalName: userDetails.userPrincipalName,
    });

    await storeSession({oAuthToken: userAuthToken, userToken: unsignedUserToken})

    return signUserToken(unsignedUserToken);
}

interface IRedisSession {
    userToken: IUserToken;
    oAuthToken: AccessToken;
}

/**
 * stores the session-token in the database.
 *
 * @param {IUserToken} userToken
 * @returns {Promise<void>}
 */
export async function storeSession({ userToken, oAuthToken }: IRedisSession): Promise<void> {
    await redisConnection(async client => {
        const key = tokenToKey(userToken);
        const value = JSON.stringify({
            userToken,
            oAuthToken: oAuthToken.token,
        });
        client.set(key, value);
    });
}

/**
 * Reads the session from the given token out of the database.
 *
 * @param {IUserToken} userToken
 * @returns {(Promise<IUserToken | null>)}
 */
export async function readSession(userToken: IUserToken): Promise<IRedisSession | null> {
    return redisConnection(async client => {
        const getAsync = promisify(client.get).bind(client);
        const key = tokenToKey(userToken);
        const value = await getAsync(key);
        if (!value) return null;
        let storedSession: { userToken: IUserToken; oAuthToken: Token } = JSON.parse(value);
        const oAuthToken = getOauthClient().accessToken.create(storedSession.oAuthToken);
        return {
            userToken: storedSession.userToken,
            oAuthToken: oAuthToken,
        };
    });
}

/**
 * Deletes an Session from the database.
 *
 * @param {IUserToken} userToken
 * @param {Db} db
 * @returns {Promise<void>}
 */
export async function deleteSession(userToken: IUserToken): Promise<void> {
    redisConnection(async client => {
        const key = tokenToKey(userToken);
        client.del(key);
    });
}

function tokenToKey(userToken: IUserToken): string {
    return `${userToken.userId}//${userToken.salt}`;
}

async function redisConnection<T>(fn: (redisClient: redis.RedisClient) => Promise<T>): Promise<T> {
    const redisOptions: redis.ClientOpts = {};
    redisOptions.host = getEnvironment().REDIS_URL;
    // redisOptions.port = redisPort;
    const redisClient: redis.RedisClient = redis.createClient(redisOptions);
    const result: T = await fn(redisClient);
    redisClient.quit();
    return result;
}
