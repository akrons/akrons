import { Router, Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@akrons/service-utils';
import { Pages } from '../../lib/collections/pages';
import { Permissions } from '../../lib/collections/permissions';
import { HandleResponse } from '../../lib/utils/handle-response';

export const router = Router();

router.get('/*', Permissions.requireMiddleware('api.common.page.read'), (req: Request, res: Response, next: NextFunction) => {
    let pageId: string | undefined = req.params[0];
    if (!pageId) {
        return next(new BadRequestError());
    }
    HandleResponse(Pages.getInstance().loadPage(pageId, req.permissions), res, next);

});
