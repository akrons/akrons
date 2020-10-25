import { Router, Request, Response, NextFunction } from 'express';
import { Pages } from '../../../lib/collections/pages';
import { Permissions } from '../../../lib/collections/permissions';
import { HandleResponse, HandleVoidResponse } from '../../../lib/utils/handle-response';

export const router = Router();
router.use(Permissions.requireMiddleware('api.backend.page'));

router.get('', Permissions.requireMiddleware('api.backend.page.read.all'), (req: Request, res: Response, next: NextFunction) => {
    HandleResponse(Pages.getInstance().getAll(), res, next);
});

router.post('/*', Permissions.requireMiddleware('api.backend.page.edit'), (req: Request, res: Response, next: NextFunction) => {
    let pageId: string | undefined = req.params[0];
    HandleVoidResponse(Pages.getInstance().update(pageId, req.body), res, next);
});

router.delete('/*', Permissions.requireMiddleware('api.backend.page.delete'), (req: Request, res: Response, next: NextFunction) => {
    let pageId: string | undefined = req.params[0];
    HandleVoidResponse(Pages.getInstance().delete(pageId), res, next);
});
