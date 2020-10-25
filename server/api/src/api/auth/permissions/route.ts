import { Router, Request, Response, NextFunction } from 'express';
import { VerifyLoginMiddleware } from '../../../lib/auth/user-token';
import { keys } from '../../../lib/auth/keys';
import { Permissions } from '../../../lib/collections/permissions';
export const router = Router();

router.use(VerifyLoginMiddleware(keys));

router.get('/permissions', Permissions.requireMiddleware('api.auth.permissions.read'), (req: Request, res: Response, next: NextFunction) => {
    res.send(req.userToken!.permissions);
});
