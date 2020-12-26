import { Router, Request, Response, NextFunction } from 'express';
import { requirePermissionMiddleware } from '@akrons/auth-lib';
import { File } from '../../lib/collections/file';

export const router = Router();

router.use(requirePermissionMiddleware('api.common.file'));

router.get('/*', requirePermissionMiddleware('api.common.file.load'), (req: Request, res: Response, next: NextFunction) => {
    File.getInstance().getFile(req.params[0], req.permissions || [])
        .then(result => {
            res.setHeader('Content-Type', result.file.mimeType);
            res.setHeader('Cache-Control', `public, max-age=${result.file.cachePolicy || 0}`);
            res.sendFile(result.path);
        })
        .catch(next);
});
