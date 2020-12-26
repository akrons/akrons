import { Router, Request, Response, NextFunction } from 'express';
import { Views } from '../../../lib/collections/views';
import { requirePermissionMiddleware } from '@akrons/auth-lib';

export const router = Router();

router.use(requirePermissionMiddleware('api.backend.views'));


router.get('', (req: Request, res: Response, next: NextFunction) => {
    Views.getInstance().getViews()
        .then(x => res.send(x))
        .catch(next);
});
