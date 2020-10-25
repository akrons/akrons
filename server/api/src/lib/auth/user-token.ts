import { isPast, addSeconds, addMinutes, addHours, addDays } from 'date-fns';
import express from 'express';
import { BadRequestError, NotAuthorizedError } from '@akrons/service-utils';
import * as crypto from 'crypto';
import { readSession, storeSession, deleteSession } from './session';
import { keys } from './keys';
import { mongoConnection } from '../mongo';
import { Db } from 'mongodb';
import { AccessToken } from 'simple-oauth2';
import { getEnvironment } from '../env';

/**
     * Data which will be signed to create an ```ICertifiedUserToken```.
     *
     * @export
     * @interface IUserToken
     */
export interface IUserToken {
    /**
     * Id of the user
     *
     * @type {string}
     * @memberof IUserToken
     */
    userId: string;
    displayName: string;
    userPrincipalName: string;
    permissions: string[];
    /**
     * Date when the validity from the certificate vanishes.
     *
     * @type {Date}
     * @memberof IUserToken
     */
    validUntil: Date;
    /**
     * Date till the token is renewable.
     *
     * @type {Date}
     * @memberof IUserToken
     */
    renewableUntil: Date;
    /**
     * Randomized salt.
     *
     * @type {string}
     * @memberof IUserToken
     */
    salt: string;
}

/**
 * Token which is send to the client to let him prove his authorization.
 *
 * @export
 * @interface ICertifiedUserToken
 * @extends {IUserToken}
 */
export interface ICertifiedUserToken extends IUserToken {
    /**
     * Signature, to prove the authenticity of the token.
     *
     * @type {string}
     * @memberof ICertifiedUserToken
     */
    sign: string;
}

const environment = {
    defaultTokenValidity: {
        seconds: 0,
        min: 10,
        hours: 0,
        days: 0,
    },
    defaultTokenRenewability: {
        seconds: 0,
        min: 0,
        hours: 0,
        days: 1,
    },
};

export function signUserToken(userToken: IUserToken): ICertifiedUserToken {
    const sign = getSignatureByInput(serializeUserToken(userToken), keys.privateKey);
    return {
        ...userToken,
        sign,
    };
}

/**
 * Returns a date till which an user-token is valid.
 *
 * @export
 * @returns {Date}
 */
export function getTokenValidity(): Date {
    let date = new Date();
    const defaultTokenValidity = environment.defaultTokenValidity;
    if (defaultTokenValidity.seconds) date = addSeconds(date, defaultTokenValidity.seconds);
    if (defaultTokenValidity.min) date = addMinutes(date, defaultTokenValidity.min);
    if (defaultTokenValidity.hours) date = addHours(date, defaultTokenValidity.hours);
    if (defaultTokenValidity.days) date = addDays(date, defaultTokenValidity.days);
    return date;
}

/**
 * Returns a date till which an user-token is renewable.
 *
 * @export
 * @returns {Date}
 */
export function getTokenRenewability(): Date {
    let date = new Date();
    const defaultTokenRenewability = environment.defaultTokenRenewability;
    if (defaultTokenRenewability.seconds) date = addSeconds(date, defaultTokenRenewability.seconds);
    if (defaultTokenRenewability.min) date = addMinutes(date, defaultTokenRenewability.min);
    if (defaultTokenRenewability.hours) date = addHours(date, defaultTokenRenewability.hours);
    if (defaultTokenRenewability.days) date = addDays(date, defaultTokenRenewability.days);
    return date;
}

/**
 * Creates an simple user-token for an given user-id.
 *
 * @param {string} userId
 * @returns {IUserToken}
 */
export function createUserToken(
    { userId, displayName, permissions, userPrincipalName }: { userId: string; displayName: string; permissions: string[]; userPrincipalName: string },
): IUserToken {
    const salt = generateSalt(32);
    return {
        salt,
        validUntil: getTokenValidity(),
        renewableUntil: getTokenRenewability(),
        userId,
        displayName,
        permissions,
        userPrincipalName,
    };
}

/**
 * Refreshes an valid token.
 * It removes the old token from the database and creates an new one.
 *
 * @export
 * @param {(string | undefined)} authToken old token
 * @returns {Promise<Auth.ICertifiedUserToken>} new valid token
 */
export async function RefreshToken(authToken: ICertifiedUserToken, oAuthToken: AccessToken): Promise<ICertifiedUserToken> {
    return mongoConnection(async (db: Db) => {
        const oldToken = await VerifyUserToken(authToken, keys.publicKey, true);
        if (isPast(new Date(oldToken.renewableUntil)))
            throw (new NotAuthorizedError());
        if ((await readSession(oldToken!)) === null)
            throw (new NotAuthorizedError());
        await deleteSession(oldToken);
        const newToken = createUserToken(oldToken);
        await storeSession({ userToken: newToken, oAuthToken });
        return signUserToken(newToken);
    });
}

export async function Logout(authToken?: ICertifiedUserToken, oAuthToken?: AccessToken): Promise<void> {
    if (!authToken) throw (new BadRequestError());
    if (!oAuthToken) throw (new NotAuthorizedError());
    return mongoConnection(async (db: Db) => {
        const oldToken = await VerifyUserToken(authToken, keys.publicKey, true);
        if (isPast(new Date(oldToken.renewableUntil)))
            throw (new NotAuthorizedError());
        if ((await readSession(oldToken!)) === null)
            throw (new NotAuthorizedError());
        await deleteSession(oldToken);
    });
}

export function verifySign(input: string, signature: string, publicKey: string): boolean {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(input, 'utf8');
    const result = verifier.verify(crypto.createPublicKey({ key: publicKey, format: 'pem', type: 'spki' }), signature, 'base64');
    return result;
}

/**
 * Verifies if an auth token is valid
 *
 * @export
 * @param {(string | undefined)} authToken The token to verify.
 * @param {IApiDef} apiDef The ApiDef from the service, who has signed the token. For checking user tokens, the ApiDef of the AuthService is required.
 * @param {{ service: string; publicKey: string; }[]} publicKeys Needs to contain the public key, from the service who signed the token.
 * @param {boolean} [ignoreValidity=false] Just for usage in auth service! Ignores the validity date of the token.
 * @returns {Promise<Auth.ICertifiedUserToken>}
 */
export async function VerifyUserToken(
    authToken: ICertifiedUserToken | undefined,
    publicKey: string,
    ignoreValidity: boolean = false,
): Promise<ICertifiedUserToken> {
    if (!authToken)
        throw (new BadRequestError());
    if (!ignoreValidity) {
        if (isPast(new Date(authToken.validUntil)))
            throw (new NotAuthorizedError());
    }
    const serializedUserToken: string = serializeUserToken(authToken);
    const verified = verifySign(serializedUserToken, authToken.sign, publicKey);
    if (!verified)
        throw (new NotAuthorizedError());
    return authToken;
}

/**
 * Creates an serialized string from a UserToken.
 *
 * @export
 * @param {Auth.IUserToken} userToken
 * @returns {string}
 */
export function serializeUserToken(userToken: IUserToken): string {
    return JSON.stringify(<IUserToken>{
        salt: userToken.salt,
        userId: userToken.userId,
        validUntil: userToken.validUntil,
        displayName: userToken.displayName,
        permissions: userToken.permissions,
        userPrincipalName: userToken.userPrincipalName,
    });
}

/**
 * Adds an middleware to the current route, which requires all requests to have an valid authorization.
 * Returns an 401 htt status-code if the authorization is invalid and 400 if the authorization header is missing.
 *
 * @export
 * @param {IApiDef} apiDef The ApiDef of the AuthService is required.
 * @param {{ service: string, publicKey: string }[]} publicKeys Needs to contain the public key from the AuthService.
 * @returns {express.RequestHandler}
 */
export function VerifyLoginMiddleware(keys: { publicKey: string }): express.RequestHandler {
    return async (req, res, next): Promise<void> => {
        if (getEnvironment().DISABLE_AUTHORIZATION) {
            next();
            return;
        }
        await VerifyUserToken(req.userToken, keys.publicKey).catch(next);
        if (!req.oauthToken || !req.oauthToken || req.oauthToken.expired()) {
            next(new NotAuthorizedError());
        }
        next();
    };
}

export function GetTokensMiddleware(): express.RequestHandler {
    return async (req, res, next): Promise<void> => {
        const authToken = req.headers['authorization'];
        if (!authToken) {
            next();
            return;
        }
        try {
            let userToken: ICertifiedUserToken = JSON.parse(authToken);
            req.userToken = userToken;
            let session = await readSession(userToken);
            if (!session) {
                next();
                return;
            }
            let oAuthToken = session.oAuthToken;
            if (oAuthToken.expired()) {
                oAuthToken = await oAuthToken.refresh();
                await deleteSession(userToken);
                await storeSession({ userToken, oAuthToken });
            }
            req.oauthToken = oAuthToken;
            req.permissions = req.userToken.permissions;
            next();
        } catch (err) {
            if (!(err instanceof SyntaxError)) {
                console.error(err);
            }
            next();
        }
    };
}

/**
 * Returns an new randomly generated salt.
 *
 * @export
 * @param {number} [size=128]
 * @returns {string}
 */
export function generateSalt(size: number = 128): string {
    return crypto.randomBytes(size).toString('base64');
}


export function createCertDataForRequest(uri: string, body: Object): string {
    return JSON.stringify({ uri, body });
}

export function getSignatureByInput(input: string, privateKey: string): string {
    let sign = crypto.createSign('RSA-SHA256');
    sign.update(input, 'utf8');
    let signature: string = sign.sign(crypto.createPrivateKey({ key: privateKey, format: 'pem', type: 'pkcs8' }), 'base64');
    return signature;
}
