import { requirePermissionMiddleware } from '@akrons/auth-lib';
import { Router } from 'express';
import { Groups } from '../models/groups';

export const router = Router();

router.use(requirePermissionMiddleware('api.auth.groups'));

router.get('', requirePermissionMiddleware('api.auth.groups.list'), (req, res, next): void => {
    Groups.getInstance().getAll()
        .then(x => res.send(x))
        .catch(err => next(err))
});

router.get('/:id', requirePermissionMiddleware('api.auth.groups.get'), (req, res, next): void => {
    Groups.getInstance().get(req.params.id)
        .then(x => res.send(x))
        .catch(err => next(err))
});

router.post('', requirePermissionMiddleware('api.auth.groups.add'), (req, res, next): void => {
    Groups.getInstance().create(undefined, req.body)
        .then(x => res.send(x))
        .catch(err => next(err))
});

router.delete('/:id', requirePermissionMiddleware('api.auth.groups.delete'), (req, res, next): void => {
    Groups.getInstance().delete(req.params.id)
        .then(() => res.sendStatus(204))
        .catch(err => next(err))
});

router.patch('/:id', requirePermissionMiddleware('api.auth.groups.edit'), (req, res, next): void => {
    Groups.getInstance().update(req.params.id, req.body)
        .then(() => res.sendStatus(204))
        .catch(err => next(err))
});
