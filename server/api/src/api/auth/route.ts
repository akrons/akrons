import { Router, Request, Response, NextFunction } from 'express';
import { router as tokenRoute } from './token/route';
import { router as permissionsRoute } from './permissions/route';
import { getAuthorizationUri, getOAuthLogoutUri } from '../../lib/auth/get-authorization-uri';
import { VerifyLoginMiddleware, Logout } from '../../lib/auth/user-token';
import { Permissions } from '../../lib/collections/permissions';

export const router = Router();

router.use(Permissions.requireMiddleware('api.auth'));

router.use('/token', tokenRoute);
router.use('/permissions', permissionsRoute);

router.get('/authorization-uri', (req: Request, res: Response, next: NextFunction) => {
    res.send({ uri: getAuthorizationUri() });
});

router.get('/logout', async (req: Request, res: Response, next: NextFunction) => {
    Logout(req.userToken, req.oauthToken)
        .then(x => res.send({ uri: getOAuthLogoutUri() }))
        .catch(next);
});
