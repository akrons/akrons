import { Router, Request, Response, NextFunction } from 'express';
import { NotAuthorizedError, BadRequestError } from '@akrons/service-utils';
import { VerifyLoginMiddleware } from '../../lib/auth/user-token';
import { keys } from '../../lib/auth/keys';
import { Permissions } from '../../lib/collections/permissions';

export const router = Router();

router.use(VerifyLoginMiddleware(keys));

router.get('/information', (req: Request, res: Response, next: NextFunction) => {
    if (!req.userToken) {
        return next(new NotAuthorizedError());
    }
    res.send(req.userToken);
});

router.get('/right', Permissions.requireMiddleware('api.auth.permissions.read'), (req: Request, res: Response, next: NextFunction) => {
    if (!req.userToken) {
        return next(new NotAuthorizedError());
    }
    res.send(req.userToken.permissions);
});

router.get('/right/:right', Permissions.requireMiddleware('api.auth.permissions.read'), (req: Request, res: Response, next: NextFunction) => {
    if (!req.userToken) {
        return next(new NotAuthorizedError());
    }
    const permission: string = <any>req.params.right;
    if (!permission) {
        return next(new BadRequestError());
    }
    res.send(Permissions.getInstance().hasPermission(permission, req.userToken.permissions));
});
