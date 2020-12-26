import { Router } from 'express';
import { Users } from '../models/users';
import { requirePermissionMiddleware } from '@akrons/auth-lib';

export const router = Router();

router.use(requirePermissionMiddleware('api.auth.users'));

router.get('', requirePermissionMiddleware('api.auth.users.list'), (req, res, next): void => {
    Users.getInstance().getAll()
        .then(x => res.send(x))
        .catch(err => next(err))
});

router.get('/:id', requirePermissionMiddleware('api.auth.users.get'), (req, res, next): void => {
    Users.getInstance().get(req.params.id)
        .then(x => res.send(x))
        .catch(err => next(err))
});

router.post('', requirePermissionMiddleware('api.auth.users.create'), (req, res, next): void => {
    Users.getInstance().createUser(req.body)
        .then(x => res.send(x))
        .catch(err => next(err))
});

router.post('/set-password/:id', requirePermissionMiddleware('api.auth.users.create'), (req, res, next): void => {
    Users.getInstance().setPasswordById(req.params.id, req.body['password'])
        .then(x => res.sendStatus(204))
        .catch(err => next(err))
});

router.delete('/:id', requirePermissionMiddleware('api.auth.users.delete'), (req, res, next): void => {
    Users.getInstance().delete(req.params.id)
        .then(() => res.sendStatus(204))
        .catch(err => next(err))
});

router.patch('/:id', requirePermissionMiddleware('api.auth.users.edit'), (req, res, next): void => {
    Users.getInstance().update(req.params.id, req.body)
        .then(() => res.sendStatus(204))
        .catch(err => next(err))
});
