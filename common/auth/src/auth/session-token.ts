import { decode, isValid } from 'js-base64';

/**
 * The Session token will be stored in a similar format than JWT. ```<TOKEN>.<SIGN>```, both base64 encoded.
 */
export interface SessionToken {
    salt: string;
    userId: string;
    userName: string;
    permissions: string[];
    expires: Date;
    renewableUntil: Date;
}

export function decodeToken(encodedToken: string): { token: SessionToken, signature: string, serializedToken: string } {
    const [serializedBase64, signature] = encodedToken.split('.');
    if (!serializedBase64 || !signature || !isValid(serializedBase64)) {
        throw new Error('invalid token');
    }
    const serializedToken = decode(serializedBase64);
    const token: SessionToken = JSON.parse(serializedToken);
    token.expires = new Date(token.expires);
    token.renewableUntil = new Date(token.renewableUntil);
    return { token, signature, serializedToken };
}
