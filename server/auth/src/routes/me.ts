import { requirePermissionMiddleware } from '@akrons/auth-lib';
import { Router } from 'express';
import { Users } from '../models/users';

export const router = Router();

router.get('', requirePermissionMiddleware('api.auth.me'), (req, res, next): void => {
    Users.getInstance().get(req.sessionToken?.userId)
        .then(x => res.send(x))
        .catch(err => next(err));
});

router.patch('/change-password', (req, res, next): void => {
    Users.getInstance().changePasswordByLogin(req.body.login, req.body.old, req.body.new)
        .then(() => res.sendStatus(204))
        .catch(err => next(err));
});
