import { Router } from 'express';
import { PasswordChangeRequiredError, Session } from '../models/session';
import { router as groupsRoute } from './groups';
import { router as meRoute } from './me';
import { router as usersRoute } from './users';

export const router = Router();

router.use('/groups', groupsRoute);
router.use('/me', meRoute);
router.use('/users', usersRoute);

router.post('/login', (req, res, next): void => {
    Session.getInstance().login(req.body['username'], req.body['password'])
        .then(x => res.send({ token: x }))
        .catch(err => {
            if (err instanceof PasswordChangeRequiredError) {
                res.status(403).send({
                    error: 'passwordChangeRequired'
                });
                return;
            }
            next(err)
        });
});

router.post('/logout', (req, res, next): void => {
    Session.getInstance().logout(req.sessionToken)
        .then(() => res.sendStatus(204))
        .catch(err => next(err));
});

router.post('/refresh-token', (req, res, next): void => {
    Session.getInstance().updateToken(req.sessionToken || req.expiredSessionToken)
        .then(x => res.send({ token: x }))
        .catch(err => next(err));
});
