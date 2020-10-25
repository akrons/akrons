import { Router, Request, Response, NextFunction } from 'express';
import { Views } from '../../../lib/collections/views';
import { Permissions } from '../../../lib/collections/permissions';

export const router = Router();

router.use(Permissions.requireMiddleware('api.backend.views'));


router.get('', (req: Request, res: Response, next: NextFunction) => {
    Views.getInstance().getViews()
        .then(x => res.send(x))
        .catch(next);
});
