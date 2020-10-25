import { Router, Request, Response, NextFunction } from 'express';
import { Permissions } from '../../../lib/collections/permissions';
import { Mongo } from '../../../lib/mongo';

export const router = Router();
router.use(Permissions.requireMiddleware('api.backend.indices'));

router.post('', (req: Request, res: Response, next: NextFunction) => {
    Mongo.getInstance().createAllIndices()
        .then(x => res.sendStatus(204))
        .catch(next);
});
