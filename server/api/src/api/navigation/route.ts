import { Router, Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@akrons/service-utils';
import { Permissions } from '../../lib/collections/permissions';
import { Menu } from '../../lib/collections/menu';

export const router = Router();

router.get('/:menuId', Permissions.requireMiddleware('api.common.navigation.read'), async (req: Request, res: Response, next: NextFunction) => {
    let menuId: string | undefined = req.params.menuId;
    if (!menuId) {
        return next(new BadRequestError());
    }
    Menu.getInstance().loadMenu(menuId, req.permissions)
        .then(result => {
            res.send(result);
        })
        .catch(next);
});
