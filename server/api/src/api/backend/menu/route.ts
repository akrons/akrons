import { Router, Request, Response, NextFunction } from 'express';

import { Permissions } from '../../../lib/collections/permissions';
import { Menu } from '../../../lib/collections/menu';

export const router = Router();
router.use(Permissions.requireMiddleware('api.backend.menu'));

router.get('', Permissions.requireMiddleware('api.backend.menu.read-all'), (req: Request, res: Response, next: NextFunction) => {
    Menu.getInstance().getAll()
        .then(x => res.send(x))
        .catch(next);
});

router.post('/:id', Permissions.requireMiddleware('api.backend.menu.update'), (req: Request, res: Response, next: NextFunction) => {
    Menu.getInstance().update(req.params.id, req.body)
        .then(() => res.sendStatus(204))
        .catch(next);
});

router.delete('/:id', Permissions.requireMiddleware('api.backend.menu.delete'), (req: Request, res: Response, next: NextFunction) => {
    Menu.getInstance().delete(req.params.id)
        .then(() => res.sendStatus(204))
        .catch(next);
});
