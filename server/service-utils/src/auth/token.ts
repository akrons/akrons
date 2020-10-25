import { getPublicKeyForService, verifySign } from '../service-communication';
import { isPast } from 'date-fns';
import express from 'express';
import { auth as Auth } from '@akrons/types';
import { IApiDef } from '../service-definition';
import { BadRequestError, IServiceError, NotAuthorizedError } from '../errors';
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
export async function VerifyToken(authToken: string | undefined, apiDef: IApiDef, publicKeys: {
    service: string;
    publicKey: string;
}[], ignoreValidity: boolean = false): Promise<Auth.ICertifiedUserToken> {
    if (!authToken)
        throw new BadRequestError();
    const signedToken: Auth.ICertifiedUserToken = JSON.parse(authToken);
    if (!ignoreValidity) {
        if (isPast(new Date(signedToken.validUntil)))
            throw new NotAuthorizedError();
    }
    const serializedUserToken: string = serializeUserToken(signedToken);
    const verified = verifySign(serializedUserToken, signedToken.sign, getPublicKeyForService(apiDef.name, publicKeys));
    if (!verified)
        throw new NotAuthorizedError();
    return signedToken;
}

/**
 * Creates an serialized string from a UserToken.
 *
 * @export
 * @param {Auth.IUserToken} userToken
 * @returns {string}
 */
export function serializeUserToken(userToken: Auth.IUserToken): string {
    return JSON.stringify(<Auth.IUserToken>{
        salt: userToken.salt,
        userId: userToken.userId,
        validUntil: userToken.validUntil,
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
export function VerifyLoginMiddleware(apiDef: IApiDef, publicKeys: {
    service: string;
    publicKey: string;
}[]): express.RequestHandler {
    return (req, res, next) => {
        const authToken = req.headers['authorization'];
        return VerifyToken(authToken, apiDef, publicKeys)
            .then(token => {
                (req as any).authorizationToken = token;
                next();
            })
            .catch((err: IServiceError) => {
                if (err.statusCode)
                    return res.sendStatus(err.statusCode);
                throw err;
            });
    };
}
