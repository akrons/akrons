import { Router, Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@akrons/service-utils';
import { Sermon } from '../../lib/collections/sermon';
import { Permissions } from '../../lib/collections/permissions';

export const router = Router();

router.use(Permissions.requireMiddleware('api.common.sermon'));

router.get('', Permissions.requireMiddleware('api.common.sermon.read.all'), (req: Request, res: Response, next: NextFunction) => {
    Sermon.getInstance().loadPublicSermons()
        .then(result => {
            res.send(result);
        })
        .catch(next);
});

// router.get('/:partitionKey', (req: Request, res: Response, next: NextFunction) => {
//     let partitionKey: string | undefined = req.params.partitionKey;
//     if (!partitionKey) {
//         return next(new BadRequestError());
//     }
//     Sermon.getInstance().loadPublicSermons(partitionKey)
//         .then(result => {
//             res.send(result);
//         })
//         .catch(next);
// });

router.get('/:id', Permissions.requireMiddleware('api.common.sermon.load'), (req: Request, res: Response, next: NextFunction) => {
    Sermon.getInstance().getFilePath(req.params.id)
        .then(result => {
            res.sendFile(result);
        })
        .catch(next);
});
