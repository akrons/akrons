import * as redis from 'redis';
import { Environment } from '../lib/env';
import { promisify } from 'util';
import { NotAuthorizedError } from '@akrons/service-utils';
import { generateSalt } from '../lib/crypto';
import { TimeSpan } from '../lib/time-span';
import { addMilliseconds } from 'date-fns';
import { sign } from '../lib/crypto';
import { Keys } from '../lib/keys';
import { auth } from '@akrons/types';

export class Token {

    private static instance: Token | undefined;
    private constructor() { }

    public static getInstance(): Token {
        if (!Token.instance) {
            Token.instance = new Token();
        }
        return Token.instance;
    }

    async sign(token: auth.SessionToken): Promise<string> {
        const serialized: string = JSON.stringify(token);
        const privateKey = Keys.get().privateKey;
        const signature = sign(serialized, privateKey);
        const serializedBase64 = Buffer.from(serialized).toString('base64');
        return `${serializedBase64}.${signature}`;
    }

    async create(userId: string, userName: string, permissions: string[]): Promise<auth.SessionToken> {
        const now = new Date();
        const expires = addMilliseconds(now, TimeSpan.toMillieSeconds(Environment.get().sessionTokenValidity));
        const renewableUntil = addMilliseconds(now, TimeSpan.toMillieSeconds(Environment.get().sessionTokenRenewability));
        const token: auth.SessionToken = {
            salt: generateSalt(),
            permissions,
            userId,
            userName,
            expires,
            renewableUntil,
        };
        await redisConnection(async client => {
            await client.set(this.getTokenKey(token), JSON.stringify(token));
        });
        return token;
    }

    async check(token: auth.SessionToken): Promise<void> {
        const storedToken = await redisConnection(client => {
            return client.get(this.getTokenKey(token));
        });
        if (!storedToken) {
            throw new NotAuthorizedError();
        }
    }

    async destroy(token: auth.SessionToken): Promise<void> {
        await redisConnection(async client => {
            await client.delete(this.getTokenKey(token));
        });
    }

    private getTokenKey(token: auth.SessionToken): string {
        return `${token.userId}//${token.salt}`;
    }
}

interface AsyncRedisClient {
    get: (key: string) => Promise<string | undefined>;
    set: (key: string, value: string) => Promise<void>;
    delete: (key: string) => Promise<void>;
}

async function redisConnection<T>(fn: (redisClient: AsyncRedisClient) => Promise<T>): Promise<T> {
    const redisOptions: redis.ClientOpts = {};
    redisOptions.host = Environment.get().redis.url;
    if (Environment.get().redis.port) {
        redisOptions.port = Environment.get().redis.port;
    }
    const redisClient: redis.RedisClient = redis.createClient(redisOptions);
    const result: T = await fn({
        delete: async (key) => { redisClient.del(key) },
        get: promisify(redisClient.get).bind(redisClient),
        set: async (key, value) => { promisify(redisClient.set).bind(redisClient)(key, value) }
    });
    redisClient.quit();
    return result;
}
