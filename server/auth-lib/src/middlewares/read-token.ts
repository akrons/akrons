import { NotAuthorizedError } from '@akrons/service-utils';
import { RequestHandler } from 'express';
import { verifySign } from '../crypto';
import { isPast } from 'date-fns';
import { auth } from '@akrons/types';

export function GetTokenMiddleware(publicKey: string): RequestHandler {
    return async (req, res, next): Promise<void> => {
        const encodedToken = req.headers['authorization'];
        if (!encodedToken) {
            next();
            return;
        }
        try {
            const { token, signature, serializedToken } = auth.decodeToken(encodedToken);
            const verified = verifySign(serializedToken, signature, publicKey);
            if (!verified) {
                throw new NotAuthorizedError();
            }
            token.expires = new Date(token.expires);
            token.renewableUntil = new Date(token.renewableUntil);
            if (isPast(token.expires)) {
                req.expiredSessionToken = token;
                throw new NotAuthorizedError();
            }
            req.sessionToken = token;
            req.permissions = req.permissions ? [...req.permissions, ...token.permissions] : token.permissions;
            next();
        } catch (err) {
            res.setHeader('INFORMATION', 'AUTHORIZATION-ERROR');
            if (!(err instanceof SyntaxError) && !(err instanceof NotAuthorizedError)) {
                console.error(err);
            }
            next();
        }
    };
}
