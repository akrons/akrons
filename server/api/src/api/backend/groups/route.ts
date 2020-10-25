import { Router, Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@akrons/service-utils';
import { Permissions } from '../../../lib/collections/permissions';
import { GraphGroups } from '../../../lib/graph/groups';

export const router = Router();
router.use(Permissions.requireMiddleware('api.backend.groups'));

router.get('', Permissions.requireMiddleware('api.backend.groups.read.all'), (req: Request, res: Response, next: NextFunction) => {
   GraphGroups.getInstance().readAllGroups()
        .then(x => res.send(x))
        .catch(next);
});
