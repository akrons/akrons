import { Router, Request, Response, NextFunction } from 'express';
import { Youtube } from '../../../lib/collections/youtube';
import { requirePermissionMiddleware } from '@akrons/auth-lib';

export const router = Router();

router.use(requirePermissionMiddleware('api.backend.page.youtube'));

router.post('/:id', (req: Request, res: Response, next: NextFunction) => {
    Youtube.getInstance().addVideo(req.params.id)
        .then(x => res.sendStatus(204))
        .catch(next);
});
