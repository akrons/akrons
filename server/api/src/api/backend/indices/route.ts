import { Router, Request, Response, NextFunction } from 'express';
import { requirePermissionMiddleware } from '@akrons/auth-lib';
import { Mongo } from '../../../lib/mongo';

export const router = Router();
router.use(requirePermissionMiddleware('api.backend.indices'));

router.post('', (req: Request, res: Response, next: NextFunction) => {
    Mongo.getInstance().createAllIndices()
        .then(x => res.sendStatus(204))
        .catch(next);
});
