import { Router, Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@akrons/service-utils';
import { Permissions } from '../../../lib/collections/permissions';

export const router = Router();
router.use(Permissions.requireMiddleware('api.backend.permissions'));

router.get('', Permissions.requireMiddleware('api.backend.permissions.read.all'), (req: Request, res: Response, next: NextFunction) => {
    Permissions.getInstance().loadAllPermissionConfigs()
        .then(x => res.send(x))
        .catch(next);
});

router.post('/:groupId', Permissions.requireMiddleware('api.backend.permissions.edit'), (req: Request, res: Response, next: NextFunction) => {
    Permissions.getInstance().updatePermissionConfig(req.params.groupId, req.body)
        .then(x => res.sendStatus(204))
        .catch(next);
});

router.delete('/:groupId', Permissions.requireMiddleware('api.backend.permissions.delete'), (req: Request, res: Response, next: NextFunction) => {
    Permissions.getInstance().deletePermissionConfig(req.params.groupId)
        .then(x => res.sendStatus(204))
        .catch(next);
});
